import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* 🎭 SYSTEM PROMPTS */
const SYSTEM_PROMPTS = {
  nya: "Ты милый и дружелюбный AI-котик. Общайся тепло, используй милые выражения и эмодзи, но оставайся умным. Если вопрос серьёзный — отвечай адекватно, просто мягким тоном.",
  smart: "Ты умный и дружелюбный ассистент. Отвечай ясно, современным языком, без лишней воды. Если нужно — объясняй подробно.",
  philosopher: "Ты философский собеседник. Помогаешь размышлять, задаёшь глубокие вопросы, смотришь на ситуации с разных сторон. Говори спокойно и вдумчиво.",
  bestie: "Ты лучший друг пользователя. Общайся живо, современно, с юмором. Поддерживай, шути, давай советы, но без романтики и флирта.",
  study: "Ты помощник в учёбе. Объясняй темы простыми словами, шаг за шагом. Помогай понять материал, а не просто давать готовые ответы.",
  creative: "Ты креативный ассистент. Генерируй идеи, истории, концепции, тексты и образы. Мысли нестандартно и вдохновляюще.",
};

export default async function handler(req, res) {
  // 🔓 CORS (ОЧЕНЬ ВАЖНО ДЛЯ MINI APP)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, mode = "smart" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const systemPrompt =
      SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.smart;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    return res.status(500).json({
      error: "AI error",
      details: err.message,
    });
  }
}
