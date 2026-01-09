import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, model, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // 🐱 режим няшки
    let systemPrompt = "You are a helpful AI assistant.";

    if (mode === "nya") {
      systemPrompt =
        "You are a cute anime cat assistant. Speak softly, friendly, and add small 'nya~' sometimes.";
    }

    const completion = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "AI failed to respond" });
  }
}
