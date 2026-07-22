import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON with generous limit for image uploads
app.use(express.json({ limit: "20mb" }));

// Lazy initializer for the Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to solve chemistry problems
app.post("/api/solve", async (req, res) => {
  try {
    const { prompt, image, mimeType, topic, language, model } = req.body;
    const isEnglish = language === "en";

    if (!prompt && !image) {
      return res.status(400).json({ 
        error: isEnglish ? "Please write a question or upload an image." : "الرجاء تقديم سؤال نصي أو رفع صورة مسألة." 
      });
    }

    let ai;
    try {
      ai = getAiClient();
    } catch (err: any) {
      if (err.message === "GEMINI_API_KEY_MISSING") {
        return res.status(500).json({
          error: isEnglish 
            ? "GEMINI_API_KEY is missing. Please configure it in the Settings panel."
            : "مفتاح واجهة برمجة التطبيقات (GEMINI_API_KEY) مفقود. الرجاء تهيئته في لوحة الإعدادات والمحاولة مرة أخرى.",
        });
      }
      throw err;
    }

    // Dual-language system instruction for the chemistry expert "Dr. Tamer Madbouly" (Qwen AI structured output style)
    const systemInstructionAr = `
أنت الدكتور تامر مدبولي (Dr. Tamer Madbouly)، خبير واستشاري علم الكيمياء والفيزياء الحيوية المتميز، وصاحب الأسلوب التعليمي الراقي والواضح، وتجيب بمحاكاة دقة وعمق وتنظيم نموذج Qwen AI الفائق في العلوم الكيميائية والرياضية.
مهمتك هي تقديم حل كيميائي منهجي متكامل ومفصل للغاية للأسئلة أو الصور المرفوعة (معادلات، هياكل جزيئية، تجارب، أو مسائل رياضية كيميائية).

يرجى الالتزام بالهيكلية الصارمة التالية لإخراج إجابة مطابقة تماماً لتنظيم qwen ai المنسق والاحترافي، مع مراعاة التنسيق التالي:
- ممنوع نهائياً استخدام جداول ماركداون (Markdown tables).
- ممنوع نهائياً استخدام صيغ LaTeX المعقدة (مثل \text{C}_3\text{H}_7\text{Cl}).
- يجب أن تكون الإجابة مرتبة في أسطر تحت بعضها بشكل منسق ومباشر وواضح جداً.
- استخدم الرموز البسيطة للعمليات الحسابية والمعادلات.

1. **🔬 المعادلة الكيميائية الرئيسية / الملخص البصري**: اعرض المعادلة الكيميائية الموزونة أو ملخص التفاعل في سطر مستقل وبشكل واضح.
2. **📝 التحليل الرياضي والكيميائي المفصل**:
   - اذكر المعطيات بوضوح في أسطر منفصلة.
   - اذكر القوانين الكيميائية المستخدمة نصاً قبل البدء بالتعويض.
3. **🧪 خطوات الحل المنهجية**:
   - اعرض الحسابات خطوة بخطوة وبأرقام واضحة في أسطر منفصلة.
4. **🎯 النتيجة النهائية المعتمدة**: النتيجة النهائية بوضوح مع وحدات القياس.
5. **💡 نصيحة د. تامر التعليمية وتطبيقات عملية**: نصيحة وتطبيق عملي.

صغ الإجابة بأقصى درجات الدقة الأكاديمية والجمال الإملائي، مستخدماً لغة عربية رصينة ومفهومة.
`;

    const systemInstructionEn = `
You are Dr. Tamer Madbouly, a highly distinguished Chemistry and Biophysics expert and consultant, known for your elegant, precise, and highly clear pedagogical style. You format your output mimicking the deep, rigorous, and highly structured scientific exposition of Qwen AI.
Your mission is to solve and explain the chemistry problems submitted by students and researchers, whether written as text or uploaded as an image/PDF (equations, molecular structures, laboratory experiments, or stoichiometry questions).

Please strictly adhere to the following Qwen-style structure in your response, following these formatting constraints:
- DO NOT use Markdown tables (e.g., :--- | :---).
- DO NOT use complex LaTeX formulas (e.g., \text{C}_3\text{H}_7\text{Cl}).
- The answer must be organized line-by-line, simple, and direct.
- Use simple notation for chemical formulas and equations.

1. **🔬 Core Chemical Equation / Visual Summary**: Display the balanced chemical equation or main chemical interaction in a separate, clear line.
2. **📝 Detailed Chemical & Mathematical Analysis**:
   - List given data clearly in separate lines.
   - State explicit chemical laws or formulas before substituting.
3. **🧪 Systematic Step-by-Step Exposition**:
   - Render mathematical steps clearly in separate lines.
4. **🎯 Final Certified Result**: State the final result clearly alongside its measurement units.
5. **💡 Dr. Tamer's Educational Tip & Real-World Application**: Educational tip and a real-world application.

Craft your answer with supreme chemical precision, perfect spelling, and a highly professional academic tone.
`;

    let systemInstruction = isEnglish ? systemInstructionEn : systemInstructionAr;

    // Enhanced instructions for charts
    const chartHint = isEnglish 
      ? "\nIf the problem involves reaction rates, titration, or numeric data series, include a special JSON block at the end. Format: [CHART_DATA]: {\"type\": \"line\" | \"scatter\", \"data\": [{\"x\": 0, \"y\": 1}, ...], \"xAxisLabel\": \"Time\", \"yAxisLabel\": \"Concentration\"}"
      : "\nإذا كانت المسألة تتضمن معدلات تفاعل أو معايرة أو سلاسل بيانات رقمية، فقم بتضمين كتلة JSON خاصة في النهاية. التنسيق: [CHART_DATA]: {\"type\": \"line\" | \"scatter\", \"data\": [{\"x\": 0, \"y\": 1}, ...], \"xAxisLabel\": \"Time\", \"yAxisLabel\": \"Concentration\"}";
    
    systemInstruction += chartHint;

    const isQuizRequest = prompt && (prompt.includes("Generate 5 multiple-choice questions") || prompt.includes("strict JSON array of objects"));

    if (isQuizRequest) {
      systemInstruction = `You are an expert chemistry professor and quiz generator. 
Your task is to generate high-quality, scientifically accurate multiple-choice questions on the topic requested.
You must return a raw JSON array of objects following the schema requested by the user.
If they ask for specific fields (like En/Ar versions or specific question counts), strictly follow those instructions.
Standard schema example:
[{
  "id": number,
  "questionEn": "string in English",
  "questionAr": "string in Arabic",
  "optionsEn": ["string", "string", "string", "string"],
  "optionsAr": ["string", "string", "string", "string"],
  "answerIndex": number (0 to 3),
  "explanationEn": "detailed explanation in English",
  "explanationAr": "تفاصيل الشرح باللغة العربية"
}]

Do not include any Markdown wrapper, do not include \`\`\`json or \`\`\`. Your output must be pure raw JSON string representing the array of questions. Ensure names, formulas, and scientific facts are 100% correct.`;
    }

    const parts: any[] = [];

    // If an image is provided, construct the multimodal part
    if (image) {
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: image,
        },
      });
    }

    // Build the user text prompt combining context and user query
    let userPromptText = "";
    if (topic) {
      userPromptText += isEnglish ? `[Topic: ${topic}]\n` : `[موضوع المسألة: ${topic}]\n`;
    }
    
    if (prompt) {
      userPromptText += isEnglish ? `Question: ${prompt}` : `السؤال المطروح: ${prompt}`;
    } else {
      userPromptText += isEnglish 
        ? "Please solve and explain the chemical problem shown in this image step-by-step with methodological explanations."
        : "الرجاء حل وتفسير المسألة الكيميائية الموجودة في هذه الصورة بالتفصيل مع الشرح المنهجي.";
    }

    parts.push({ text: userPromptText });

    // Modern models mapping and retry fallback logic
    const MODERN_MODELS = {
      flash: "gemini-3.6-flash",
      lite: "gemini-3.1-flash-lite",
      pro: "gemini-3.1-pro-preview"
    };

    function mapModel(requestedModel: string): string {
      if (!requestedModel) return MODERN_MODELS.flash;
      switch (requestedModel) {
        case "gemini-2.0-flash":
        case "gemini-1.5-flash":
          return MODERN_MODELS.flash;
        case "gemini-1.5-pro":
          return MODERN_MODELS.pro;
        case "deepseek-r1":
        case "qwen-2.5":
          return MODERN_MODELS.flash;
        default:
          if (requestedModel.startsWith("gemini-2.0") || requestedModel.startsWith("gemini-1.5")) {
            return MODERN_MODELS.flash;
          }
          return requestedModel;
      }
    }

    const MAX_RETRIES = 5;
    let lastError: any;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        let modelToUse: string;
        if (i === 0) {
          modelToUse = mapModel(model);
        } else if (i === 1) {
          modelToUse = MODERN_MODELS.flash;
        } else {
          modelToUse = MODERN_MODELS.lite;
        }
        
        let finalSystemInstruction = systemInstruction;
        if (model === "deepseek-r1") {
          finalSystemInstruction += isEnglish 
            ? "\n[Mode: DeepSeek-R1] Focus on extreme logical reasoning, chain-of-thought, and rigorous mathematical proofs." 
            : "\n[وضع: DeepSeek-R1] ركز على المنطق العميق، وسلسلة الأفكار، والبراهين الرياضية الدقيقة.";
        } else if (model === "qwen-2.5") {
          finalSystemInstruction += isEnglish 
            ? "\n[Mode: Qwen-2.5] Focus on highly structured, step-by-step technical documentation style with clean formatting." 
            : "\n[وضع: Qwen-2.5] ركز على الأسلوب المنظم للغاية والخطوات المنهجية مع تنسيق تقني نظيف.";
        }

        console.log(`Using model: ${modelToUse} (Attempt ${i + 1}/${MAX_RETRIES})`);

        const client = getAiClient();
        const response = await client.models.generateContent({
          model: modelToUse,
          contents: [{ parts }],
          config: {
            systemInstruction: finalSystemInstruction,
            temperature: isQuizRequest ? 0.85 : 0.2,
          },
        });
        
        let solution = response.text || (isEnglish 
          ? "Sorry, the model was unable to generate an appropriate solution for this problem."
          : "عذراً، لم يتمكن النموذج من توليد استجابة مناسبة للمسألة.");

        return res.json({ solution });
      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${i + 1} failed with error:`, error.message || error);
        
        // If we still have retries remaining, we wait and try the next model in fallback sequence
        if (i < MAX_RETRIES - 1) {
          let delay = (2000 + Math.random() * 1000) * Math.pow(1.5, i); // Exponential backoff with jitter
          
          if (error.details && Array.isArray(error.details)) {
            const retryInfo = error.details.find((d: any) => d['@type']?.includes('RetryInfo'));
            if (retryInfo && retryInfo.retryDelay) {
              const match = retryInfo.retryDelay.match(/(\d+)s/);
              if (match) {
                delay = Math.max(delay, parseInt(match[1]) * 1000);
              }
            }
          }
          
          console.log(`Waiting ${Math.round(delay)}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;

  } catch (error: any) {
    console.error("Error solving chemistry problem:", error);
    const isEnglish = req.body?.language === "en";
    const status = (error.status === 429 || error.code === 429 || error.message?.includes("429")) ? 429 : 500;
    return res.status(status).json({
      error: isEnglish
        ? `An error occurred while processing: ${error.message || "Internal Server Error"}`
        : `حدث خطأ أثناء معالجة المسألة: ${error.message || "خطأ داخلي في الخادم"}`,
    });
  }
});

// Configure Vite or Static Assets depending on the environment
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
    console.log(`[Dr. Tamer Chemistry Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
