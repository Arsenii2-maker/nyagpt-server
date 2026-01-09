export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { model, messages } = req.body;

  const systemPrompts = {
    nya: "Ты милый аниме ассистент, говоришь нежно и с 'ня~'",
    smart: "Ты умный, логичный и краткий ассистент",
    homework: "Ты объясняешь школьные задания просто и понятно"
  };

  const system =
    systemPrompts[model] || "Ты полезный ассистент";

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": Bearer ${process.env.OPENAI_KEY},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          ...messages
        ]
      })
    }
  );

  const data = await response.json();

  res.status(200).json({
    reply: data.choices[0].message.content
  });
}
