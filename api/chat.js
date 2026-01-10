import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // CORS
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
    const { message, mode } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Empty message" });
    }

    const modes = {
      nya: "Ты милый аниме-ассистент, говоришь как няшка, добавляешь 'ня~', эмодзи 🐱",
      normal: "Ты умный, спокойный и полезный ассистент.",
      philosopher: "Ты философ, рассуждаешь глубоко и вдумчиво.",
      bestie: "Ты лучший друг, немного дерзкий, поддерживающий 😏",
      study: "Ты учитель, помогаешь с учебой, объясняешь просто.",
      creative: "Ты креативный ассистент, любишь идеи, истории и воображение."
    };

    const systemPrompt = modes[mode] || modes.normal;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
