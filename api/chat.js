import OpenAI from "openai";

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

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompts = {
      nya: "Ты милый кот-ассистент, говоришь с 'ня~', дружелюбный и тёплый.",
      normal: "Ты умный, спокойный и полезный AI помощник.",
      philosopher: "Ты философ, рассуждаешь глубоко и вдумчиво.",
      bestie: "Ты лучший друг, общаешься неформально и поддерживающе.",
      study: "Ты строгий, но добрый учитель, помогаешь учиться.",
      creative: "Ты креативный писатель и фантазёр."
    };

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompts[mode] || systemPrompts.normal
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
