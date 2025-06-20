const express = require("express");
const router = express.Router();
const multer = require("multer");
const vision = require("@google-cloud/vision");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const auth = require('../middleware/auth');
require("dotenv").config();
const redisClient = require('../client/redisClient'); // adjust path accordingly


const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const upload = multer({ storage: multer.memoryStorage() });

// Utility to extract JSON from Gemini response
function extractJSON(text) {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No valid JSON found");
  }
  const jsonString = text.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonString);
}

// 🔥 Fetch GIF from ExerciseDB API
async function fetchExerciseDbGif(exerciseName) {
  const cacheKey = `gif:${exerciseName.toLowerCase()}`;

  try {
    // 🧠 Step 1: Check cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for: ${exerciseName}`);
      return cached;
    }

    // 🔍 Step 2: Try direct API search
    const url = `https://exercisedb.p.rapidapi.com/exercises/name/${exerciseName.toLowerCase()}`;
    const res = await axios.get(url, {
      headers: {
        "X-RapidAPI-Key": process.env.EXERCISE_API_KEY,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
      }
    });

    let gifUrl = null;

    if (res.data && res.data.length > 0) {
      gifUrl = res.data[0].gifUrl;
    } else {
      // 🤖 Step 3: Fallback - fuzzy search
      const all = await axios.get(`https://exercisedb.p.rapidapi.com/exercises`, {
        headers: {
          "X-RapidAPI-Key": process.env.EXERCISE_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
        }
      });
      const fuzzyMatch = all.data.find(e =>
        e.name.toLowerCase().includes(exerciseName.toLowerCase())
      );
      gifUrl = fuzzyMatch ? fuzzyMatch.gifUrl : "https://via.placeholder.com/200x150";
    }

    // 💾 Step 4: Cache result for 24 hours
    await redisClient.setEx(cacheKey, 60 * 60 * 24, gifUrl); // 86400s = 1 day
    console.log(`Cache set for: ${exerciseName}`);
    return gifUrl;
  } catch (err) {
    console.error(`ExerciseDB error for "${exerciseName}":`, err.message);
    return "https://via.placeholder.com/200x150";
  }
}



// 🔗 POST route to handle image + Gemini + GIF flow
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    // 🎯 Step 1: Detect labels from image
    const [result] = await client.labelDetection({ image: { content: imageBuffer } });
    const labels = result.labelAnnotations;
    const possibleLabels = labels.map(l => l.description.toLowerCase());

    // 🏋️‍♂️ Step 2: Match against gym equipment
    const gymEquipmentKeywords = [
      "dumbbell", "barbell", "lat pulldown", "bench press", "treadmill",
      "elliptical", "rowing machine", "leg press", "cable machine",
      "pull-up bar", "kettlebell", "resistance band", "smith machine"
    ];

    const equipment = possibleLabels.find(label =>
      gymEquipmentKeywords.some(eq => label.includes(eq))
    );

    if (!equipment) {
      return res.status(404).json({ error: "No specific gym equipment detected." });
    }

    // ✍️ Step 3: Ask Gemini for beginner exercises
    const prompt = `
Suggest 2–3 beginner-friendly exercises using: "${equipment}".
For each, include:
- Exercise name
- Target muscles
- One beginner tip  
- Leave "video" field blank

Return valid JSON in this format:
{
  "equipment": "dumbbell",
  "exercises": [
    {
      "name": "Dumbbell Curl",
      "video": "",
      "muscles": ["biceps"],
      "tip": "Keep elbows close to your body"
    }
  ]
}
Only return valid JSON. No text before or after.
`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const resultGemini = await model.generateContent(prompt);
    const response = await resultGemini.response;
    const text = response.text();
    const parsed = extractJSON(text);

    // 🎥 Step 4: Replace blank video fields with ExerciseDB GIFs
    for (let exercise of parsed.exercises) {
      const gifUrl = await fetchExerciseDbGif(exercise.name);
      exercise.video = gifUrl;
    }

    // ✅ Done!
    res.json(parsed);
  } catch (err) {
    console.error("Combo error:", err.message);
    res.status(500).json({ error: "Failed to process combo flow" });
  }
});

module.exports = router;
  