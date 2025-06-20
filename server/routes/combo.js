const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const auth = require("../middleware/auth");
require("dotenv").config();
const redisClient = require("../client/redisClient");

const upload = multer({ storage: multer.memoryStorage() });

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

async function fetchWgerExercisesFromAPI() {
  try {
    let allExercises = [];
    let nextUrl = "https://wger.de/api/v2/exercise/?limit=100";

    while (nextUrl) {
      const res = await axios.get(nextUrl);
      const data = res.data;
      allExercises.push(...data.results);
      nextUrl = data.next;
    }

    // Filter English exercises only
    return allExercises.filter((e) => e.language === 2);
  } catch (err) {
    console.error("Wger fetch error:", err.message);
    return [];
  }
}

async function fetchExerciseGif(slug) {
  const url = `https://wger.de/en/exercise/${slug}/view/`;
  try {
    const res = await axios.get(url);
    const html = res.data;
    const match = html.match(/<img[^>]+src="([^">]+\/media\/exercise-images[^">]+)"/);
    return match ? `https://wger.de${match[1]}` : "https://via.placeholder.com/200x150";
  } catch (err) {
    console.error(`GIF fetch error for "${slug}":`, err.message);
    return "https://via.placeholder.com/200x150";
  }
}

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    const formData = new FormData();
    formData.append("file", imageBuffer, {
      filename: req.file.originalname || "image.jpg",
      contentType: req.file.mimetype,
    });

    const fastApiRes = await axios.post(
      process.env.EQUIPMENT_PREDICTOR_URL,
      formData,
      { headers: formData.getHeaders() }
    );

    const equipment = fastApiRes.data.label;
    console.log("FastAPI predicted equipment:", equipment);
    if (!equipment) {
      return res.status(404).json({ error: "No gym equipment detected." });
    }

    const cacheKey = `wger-exercises`;
    let allExercises = JSON.parse(await redisClient.get(cacheKey));
    if (!allExercises) {
      allExercises = await fetchWgerExercisesFromAPI();
      await redisClient.setEx(cacheKey, 86400, JSON.stringify(allExercises));
    }

    const matched = allExercises
      .filter((e) =>
        e.name?.toLowerCase().includes(equipment.toLowerCase())
      )
      .slice(0, 3);

    if (matched.length === 0) {
      return res.status(404).json({ error: "No exercises found for this equipment." });
    }

    const finalExercises = [];

    for (const ex of matched) {
      const slug = slugify(ex.name);
      const gif = await fetchExerciseGif(slug);

      finalExercises.push({
        name: ex.name,
        slug,
        description: ex.description.replace(/(<([^>]+)>)/gi, ""),
        video: gif,
      });
    }

    res.json({
      equipment,
      exercises: finalExercises,
    });
  } catch (err) {
    console.error("Combo flow error:", err.message);
    res.status(500).json({ error: "Failed to process combo flow." });
  }
});

module.exports = router;
