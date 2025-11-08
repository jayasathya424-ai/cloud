export const getOpenRouterModel = async (
  prompt: string,
  model = "gpt-3.5-turbo"
) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OpenRouter API key! Set VITE_OPENROUTER_API_KEY in .env");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a helpful AI travel planner." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenRouter API error:", err);
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response from model.";
};
