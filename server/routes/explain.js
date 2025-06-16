const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/auth');
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Define extractJSON function here FIRST
function extractJSON(text) {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No valid JSON found");
  }
  const jsonString = text.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonString);
}

router.post("/", auth, async (req, res) => {
  const { equipment } = req.body;

  if (!equipment) {
    return res.status(400).json({ error: "Equipment is required" });
  }

  const prompt = `
Suggest 2–3 beginner-friendly exercises using: "${equipment}".
For each, include:
- Exercise name
- Target muscles
- One beginner tip
- GIF or video link (use placeholder if needed)

Return valid JSON in this format:
{
  "equipment": "dumbbell",
  "exercises": [
    {
      "name": "Dumbbell Curl",
      "video": "https://example.com/curl.gif",
      "muscles": ["biceps"],
      "tip": "Keep elbows close to your body"
    }
  ]
}
Only return valid JSON. Do not include explanations or markdown. No triple backticks.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsed = extractJSON(text); 
    res.json(parsed);

  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Failed to parse JSON from Gemini" });
  }
});

module.exports = router;
