import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Server-side Gemini AI initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "thesis-mentor-portal", timestamp: new Date().toISOString() });
});

// 1. Advisor Chat Endpoint
app.post("/api/advisor/chat", async (req, res) => {
  try {
    const { message, chatHistory = [], advisorRules = [], studentContext = {} } = req.body;

    const rulesContext = advisorRules.length > 0 
      ? advisorRules.map((r: { title: string; description: string }) => `• 【${r.title}】：${r.description}`).join("\n")
      : "遵循一般國際頂級期刊與學術論文最高嚴謹標準。";

    const systemInstruction = `你代表「崔老師（Prof. Tsuei）」的論文指導體系，是一位嚴謹、博學、具備多年頂級學術期刊審稿經驗與碩博士指導經驗的「資深論文指導教授兼學術導師」。
你的職責是指導研究生撰寫碩博士論文，解答論文各階段疑難雜症，引導學生深入思考，並嚴格把關學術品質。

指導原則：
1. 嚴格遵守崔老師研究室/指導老師設定的守則：
${rulesContext}

2. 指導風格：
- 親切但學術嚴格，不給空泛模糊的回答。
- 「啟發式提問 + 結構化解方」：指出問題核心、說明背後的學術邏輯（Why）、提供具體可操作的改善步驟（How）、並附帶 1~2 個學術例句或範本。
- 強調「批判性思考」、「文獻對話」、「方法論可復現性」與「因果推論嚴謹性」。
- 格式標註：善用 Markdown 標題、條列清單與粗體，字句符合正規繁體中文學術論文用詞規範。`;

    // Format previous messages
    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory.slice(-8)) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [
        {
          text: `【學生當前狀態】：階段：${studentContext.phase || '進行中'}，研究主題：${studentContext.topic || '未指定'}\n\n學生問題：${message}`,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || "指導教授目前在會議中，請稍後再試。" });
  } catch (error: any) {
    console.error("Error in advisor chat:", error);
    res.status(500).json({ error: error.message || "論文指導助理連線異常，請稍後重試。" });
  }
});

// 2. Thesis Paragraph Diagnosis Endpoint
app.post("/api/advisor/diagnose", async (req, res) => {
  try {
    const { draftText, chapterContext = "全篇/未指定章節", targetStyle = "APA 7th", advisorRules = [] } = req.body;

    if (!draftText || draftText.trim().length === 0) {
      return res.status(400).json({ error: "請提供需要診斷的論文段落內容。" });
    }

    const rulesContext = advisorRules.length > 0
      ? advisorRules.map((r: { title: string; description: string }) => `• ${r.title}: ${r.description}`).join("\n")
      : "無特定自訂規則，遵循一般標準學術寫作規範。";

    const prompt = `你是一位資深學術期刊副主編兼論文指導教授。請針對以下學生提交的論文段落進行嚴格的「學術寫作診斷審查」：

【所屬章節脈絡】：${chapterContext}
【寫作格式規範】：${targetStyle}
【指導教授實驗室規範】：
${rulesContext}

【待診斷之學生論文草稿】：
"""
${draftText}
"""

請以嚴格的學術標準評審，並輸出符合指定 JSON 結構的診斷報告：
包含各項評分 (0-100)、優點分析、發現的問題清單（分類為 logic, academic_tone, format, advisor_rule, citation）、具體改善建議，以及由你親自親筆潤飾後的「頂級學術標準示範段落（rewrittenSample）」。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "總體評分 (0-100)" },
            logicCoherenceScore: { type: Type.INTEGER, description: "邏輯連貫與論證嚴謹度 (0-100)" },
            academicToneScore: { type: Type.INTEGER, description: "學術語氣與客觀性評分 (0-100)" },
            advisorRuleComplianceScore: { type: Type.INTEGER, description: "指導教授規則符合度 (0-100)" },
            critiqueSummary: { type: Type.STRING, description: "整體審稿評語總結 (約100-200字)" },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "本段落表現良好之處 (2-3項)",
            },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "問題類型: logic / academic_tone / format / advisor_rule / citation" },
                  severity: { type: Type.STRING, description: "嚴重性: error / warning / suggestion" },
                  title: { type: Type.STRING, description: "問題簡述" },
                  snippet: { type: Type.STRING, description: "草稿中出現問題的原文字句" },
                  suggestion: { type: Type.STRING, description: "具體修改建議" },
                  advisorGuidelineRef: { type: Type.STRING, description: "違反或關聯的指導規範說明" },
                },
                required: ["type", "severity", "title", "snippet", "suggestion"],
              },
              description: "具體問題診斷清單",
            },
            rewrittenSample: { type: Type.STRING, description: "指導教授親自重寫之高水準示範段落（符合正規學術論文語態與文獻引用）" },
            nextStepAdvice: { type: Type.STRING, description: "學生下一步修改具體指引" },
          },
          required: [
            "overallScore",
            "logicCoherenceScore",
            "academicToneScore",
            "advisorRuleComplianceScore",
            "critiqueSummary",
            "strengths",
            "issues",
            "rewrittenSample",
            "nextStepAdvice",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in thesis diagnosis:", error);
    res.status(500).json({ error: error.message || "論文診斷失敗，請重試。" });
  }
});

// 3. Custom Outline & Draft Structure Generator
app.post("/api/advisor/generate-outline", async (req, res) => {
  try {
    const { topic, field, methodology, chapterNumber, customRequirements } = req.body;

    const prompt = `請以學術指導教授的視角，為以下研究題目量身規劃「第 ${chapterNumber || 1} 章」的完整高規格章節大綱與寫作藍圖：

【研究題目】：${topic}
【研究領域】：${field || '商管/社會科學/資訊工程'}
【研究方法】：${methodology || '量化研究/質性研究'}
【額外特殊要求】：${customRequirements || '無'}

請輸出詳細的章節規劃，包含：
1. 本章核心目標與口委審查重點
2. 結構化節次大綱（小節標題、各段落必備元素、核心理論鏈接）
3. 推薦使用的學術句型（Academic Phrasebank）
4. 預期圖表與表格設計建議
5. 常見寫作地雷避坑提醒`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "你是一位頂尖大學論文指導教授，善於規劃層次嚴密、符合頂級學術標準的論文大綱與寫作架構。",
        temperature: 0.7,
      },
    });

    res.json({ outlineContent: response.text });
  } catch (error: any) {
    console.error("Error generating outline:", error);
    res.status(500).json({ error: error.message || "大綱生成失敗。" });
  }
});

// 4. Citation & Reference Format Validator
app.post("/api/advisor/check-format", async (req, res) => {
  try {
    const { rawReferences, targetFormat = "APA 7th" } = req.body;

    if (!rawReferences || rawReferences.trim().length === 0) {
      return res.status(400).json({ error: "請提供欲校驗的參考文獻列表。" });
    }

    const prompt = `你是一位專業學術期刊格式編輯。請依據「${targetFormat}」格式規範，嚴格校對以下參考文獻：

【待校驗文獻列表】：
"""
${rawReferences}
"""

請逐條檢查並輸出 JSON 格式報告：
包含校驗文獻筆數、整體格式合格率 (0-100)、逐條校對結果（包含原始字串、校對後標準格式、錯誤類型分析如作者姓名縮寫、年份括號、期刊名斜體/卷期號缺失、DOI超連結格式等）。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalEntries: { type: Type.INTEGER },
            validScore: { type: Type.INTEGER, description: "總體格式準確率 (0-100)" },
            formatSummary: { type: Type.STRING, description: "總體格式診斷摘要" },
            entries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING, description: "依據規範修訂後之標準格式（含 markdown 斜體/粗體）" },
                  inTextCitationSample: { type: Type.STRING, description: "此文獻對應之正文內文引註範例 (例如: (Wang et al., 2023))" },
                  isFormatValid: { type: Type.BOOLEAN },
                  errorNotes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "具體錯誤點說明" },
                },
                required: ["id", "original", "corrected", "isFormatValid", "errorNotes"],
              },
            },
          },
          required: ["totalEntries", "validScore", "formatSummary", "entries"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in reference format check:", error);
    res.status(500).json({ error: error.message || "參考文獻校驗失敗。" });
  }
});

// 5. Mock Defense Simulator Endpoint
app.post("/api/advisor/mock-defense", async (req, res) => {
  try {
    const { action, thesisTitle, thesisAbstract, methodology, studentAnswer, currentQuestion } = req.body;

    if (action === "generate_questions") {
      const prompt = `你是一個由三位資深口試委員組成的口試評審團（包含：嚴格的方法論專家委員、強調產業實務貢獻的實務專家委員、重視理論邏輯的理論學者）。
請針對以下學位論文，提出 4~5 個極具學術水準、直擊痛點的「口試尖銳高頻問題」：

【論文題目】：${thesisTitle}
【研究方法】：${methodology || '未指定'}
【論文摘要】：${thesisAbstract || '無'}

請輸出符合規範的 JSON 格式。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                examinerRole: { type: Type.STRING, description: "口委角色 (如: 方法論委員 / 理論架構委員 / 實務審查委員)" },
                question: { type: Type.STRING, description: "委員提問內容" },
                intent: { type: Type.STRING, description: "委員問此問題的真正核心意圖" },
                keyEvaluationCriteria: { type: Type.ARRAY, items: { type: Type.STRING }, description: "委員評分重點" },
                tip: { type: Type.STRING, description: "指導教授建議之答辯拆解技巧" },
              },
              required: ["id", "examinerRole", "question", "intent", "keyEvaluationCriteria", "tip"],
            },
          },
        },
      });

      const questions = JSON.parse(response.text || "[]");
      return res.json({ questions });
    }

    if (action === "evaluate_answer") {
      const prompt = `學生在學位論文口試時，回答了口試委員的提問。請以口試評審團與指導教授的角度進行評估：

【論文題目】：${thesisTitle}
【口試委員問題】：${currentQuestion}
【學生的現場答辯回答】：
"""
${studentAnswer}
"""

請評估學生的答辯表現，輸出 JSON 評估報告：
包含答辯得分 (0-100)、評語（指出是否正面回答、邏輯漏洞、是否過度防衛）、推薦的最佳示範答辯說法。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "答辯表現評分 (0-100)" },
              passed: { type: Type.BOOLEAN, description: "是否過關" },
              examinerFeedback: { type: Type.STRING, description: "口委評語與印象" },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "回答亮點" },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "待改進之處或被抓到的漏洞" },
              suggestedModelAnswer: { type: Type.STRING, description: "指導教授示範之滿分高 EQ 學術答辯範本" },
            },
            required: ["score", "passed", "examinerFeedback", "strengths", "weaknesses", "suggestedModelAnswer"],
          },
        },
      });

      const evaluation = JSON.parse(response.text || "{}");
      return res.json({ evaluation });
    }

    res.status(400).json({ error: "無效的 action 參數。" });
  } catch (error: any) {
    console.error("Error in mock defense:", error);
    res.status(500).json({ error: error.message || "模擬口試處理失敗。" });
  }
});

// 6. Research Conceptual Diagram & Flowchart Generator
app.post("/api/advisor/generate-diagram", async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = "16:9",
      imageSize = "1K",
      diagramType = "conceptual_framework" // conceptual_framework | research_flowchart | system_architecture | experimental_design
    } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "請提供欲生成之學術架構圖描述。" });
    }

    // Build specialized academic diagram prompt
    let enhancedPrompt = `Academic thesis research diagram, professional clean minimalist vector schematic diagram for scientific publication. 
Diagram Type: ${diagramType}.
Details: ${prompt}.
Style: Clean crisp lines, high contrast, elegant typography, clear boxes, flow arrows, professional academic palette (navy blue, slate grey, subtle teal accents), pure white background, publication-ready vector chart.`;

    const modelToUse = "gemini-3.1-flash-image";

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any,
        },
      },
    });

    let imageUrl = "";
    let captionText = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        } else if (part.text) {
          captionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: "未能生成架構圖，請檢查模型與提示詞。" });
    }

    res.json({
      imageUrl,
      caption: captionText || `圖：${prompt.slice(0, 40)} 之學術研究架構示意圖`,
      aspectRatio,
      imageSize,
    });
  } catch (error: any) {
    console.error("Error generating research diagram:", error);
    res.status(500).json({ error: error.message || "研究架構圖生成失敗。" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Thesis Advisor Portal running at http://localhost:${PORT}`);
  });
}

startServer();
