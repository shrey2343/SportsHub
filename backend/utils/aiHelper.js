import OpenAI from "openai";

let openai = null;

// ✅ Initialize OpenAI only if key exists
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "") {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// ✅ Keep the same function name your controllers expect
export const getAIResponse = async (prompt) => {
  if (!openai) {
    return { message: "AI features disabled (no API key found)" };
  }

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return res.choices[0].message;
  } catch (error) {
    console.error("AI error:", error.message);
    return { message: "AI analysis failed" };
  }
};
