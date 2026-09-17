import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "국토계획법 개발행위허가 진단 서비스" });
});

app.post("/api/ai/analyze-case", async (req, res) => {
  try {
    const { caseDetails, activityType, zoning, landSize, details } = req.body;

    if (!caseDetails && !activityType) {
      return res.status(400).json({ error: "상세 내용 또는 행위 유형을 입력해주세요." });
    }

    const ai = getGeminiClient();

    const prompt = `당신은 대한민국 '국토의 계획 및 이용에 관한 법률'(약칭: 국토계획법) 및 국토교통부 '개발행위허가운영지침'에 정통한 국토계획 및 도시계획 전문 행정/법률 고문관입니다.

다음 사용자의 실제 개발행위 및 토지 이용 계획에 대해 개발행위허가(국토계획법 제56조) 대상 여부를 심층 분석하여 전문가 검토 의견서를 작성해주세요.

[사용자 입력 정보]
- 주요 행위 유형: ${activityType || "종합/복합 검토"}
- 해당 용도지역: ${zoning || "미지정 또는 미상"}
- 사업/토지 면적: ${landSize || "미입력"}
- 사전 세부조건: ${JSON.stringify(details || {})}
- 구체적 상황 설명:
"""
${caseDetails || "선택된 세부조건에 따라 법적 쟁점을 정밀 분석해주세요."}
"""

[필수 분석 항목 및 출력 가이드라인]
1. **최종 판정 요약**:
   - 허가 필요 여부 (① 허가 필수 / ② 경미한 행위로 허가 불요 / ③ 도시계획위원회 심의 필요 / ④ 재해복구 응급조치 사후신고 대상 / ⑤ 건축허가 등에 따른 의제협의 사항 중 명확히 제시)
   - 핵심 근거 한 줄 요약

2. **국토계획법 및 시행령 법적 조항 검토**:
   - 국토계획법 제56조(개발행위의 허가), 시행령 제51조(개발행위허가의 대상) 해당 여부
   - 시행령 제53조(허가를 받지 아니하여도 되는 경미한 행위) 해당 여부 세부 검토 (예: 50cm 이내 절성토, 660㎡ 이하, 공작물 규격 등)
   - 시행령 제55조(개발행위허가의 규모)에 따른 용도지역별 허가 규모 상한(5천/1만/3만㎡) 초과 여부 및 도시계획위원회 심의 필요성

3. **타 법률 연계 및 의제 협의 검토**:
   - 건축법(건축허가/신고, 가설건축물 축조신고)
   - 농지법(농지전용허가/신고, 영농 목적 성토 2m 기준 및 농지개량 범위)
   - 산지관리법(산지전용허가/신고)
   - 하천법, 사도법 등 연계성

4. **지자체 도시·군계획조례 체크포인트**:
   - 지자체별 경사도, 표고, 입목축적 기준
   - 성토/절토 시 옹벽 설치 기준 및 인접 필지와의 이격
   - 영농 목적 성토라도 2m 이상 또는 지자체 조례에 따라 허가 대상으로 정한 경우

5. **인허가 신청 절차 및 필수 구비서류**:
   - 신청 창구 (시·군·구청 도시계획과/건축과/개발행위허가팀)
   - 필수 제출 서류 (개발행위허가 신청서, 토지소유권/사용권 증빙, 공사계획서, 설계도서, 위해방지·환경오염방지·경관조경 계획서 등)
   - 처리 기간(통상 15일) 및 준공검사 절차

6. **실무 주의사항 및 행정처분 리스크**:
   - 무허가 개발행위 시 국토계획법 제140조에 따른 벌칙 (3년 이하의 징역 또는 3천만원 이하의 벌금 및 원상회복명령 제133조) 안내
   - 인접지 주민과의 배수/일조/경계 분쟁 방지 팁

한국어로 명확하고 체계적인 마크다운 서식으로 전문적이고 신뢰성 있게 작성해주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const resultText = response.text || "분석 결과를 생성하지 못했습니다.";
    res.json({ analysis: resultText });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    res.status(500).json({
      error: error.message || "개발행위허가 분석 처리 중 오류가 발생했습니다.",
    });
  }
});

app.post("/api/ai/classify-activity", async (req, res) => {
  try {
    const { text, landCategory, zoning } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "개발하고자 하는 내용을 입력해주세요." });
    }

    const ai = getGeminiClient();

    const prompt = `당신은 대한민국 '국토의 계획 및 이용에 관한 법률'(약칭: 국토계획법) 제56조 제1항의 개발행위허가 분류 전문가입니다.
사용자가 계획 중인 개발 내용 텍스트를 분석하여, 국토계획법 제56조 제1항에서 규정하는 5가지 개발행위 유형 중 어디에 해당하는지 엄밀하게 분류하고 판단해주세요.

5가지 법정 행위 유형:
1. "BUILDING_STRUCTURE": 건축물의 건축 또는 공작물의 설치 (건축법 제2조제1항제2호에 따른 건축물, 인공을 가하여 제작한 시설물, 태양광발전시설, 철탑 등)
2. "LAND_ALTERATION": 토지의 형질변경 (절토·성토·정지·포장 등의 방법으로 토지의 형상을 변경하는 행위와 공유수면의 매립)
3. "ROCK_EXCAVATION": 토석의 채취 (흙·모래·자갈·바위 등의 토석을 채취하는 행위)
4. "LAND_SUBDIVISION": 토지분할 (건축물이 없는 토지의 분할)
5. "STOCKPILING_GOODS": 물건을 쌓아놓는 행위 (녹지지역·관리지역 또는 자연환경보전지역에서 물건을 1개월 이상 쌓아놓는 행위)

[사용자 입력 정보]
- 개발 계획 내용: """${text.trim()}"""
${landCategory ? `- 토지 지목: ${landCategory}` : ""}
${zoning ? `- 용도지역: ${zoning}` : ""}

반드시 아래 JSON 형식으로만 응답해주세요 (마크다운 코드블록 없이 순수 JSON만 반환):
{
  "primaryCategory": "BUILDING_STRUCTURE" | "LAND_ALTERATION" | "ROCK_EXCAVATION" | "LAND_SUBDIVISION" | "STOCKPILING_GOODS",
  "categoryTitle": "해당 행위 한국어 명칭",
  "confidence": 0부터 100 사이 정수,
  "secondaryCategories": ["복합 행위가 있을 경우 추가 카테고리 코드 배열"],
  "reasoning": "사용자의 어떤 표현과 계획 때문에 이 행위 유형으로 분류되었는지 명쾌한 법적 판단 이유 (2~3문장)",
  "matchedKeywords": ["매칭된 주요 단어/표현들"],
  "suggestedInputs": {
    "alterationType": "CUT" | "FILL" | "LEVEL" | "PAVE" | "RECLAMATION" (형질변경일 경우),
    "structureType": "BUILDING" | "STRUCTURE" | "VINYL_HOUSE" (건축물/공작물일 경우),
    "isAgriculturalPurpose": boolean (영농 목적 여부),
    "heightOrDepthCm": number (언급된 성토/절토 높이/깊이 cm 단위, 없으면 null)
  },
  "keyLegalBasis": "국토계획법 제56조 제1항 제O호",
  "preliminaryVerdictHint": "경미한 행위 제외 가능성 또는 허가 필수 여부에 관한 1줄 사전 힌트"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text?.trim() || "{}";
    const parsed = JSON.parse(outputText);
    res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error("AI Classify error:", error);
    res.status(500).json({
      error: error.message || "행위 유형 분류 처리 중 오류가 발생했습니다.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
