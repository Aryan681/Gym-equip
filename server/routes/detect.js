const express = require('express');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const path = require('path');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

router.post('/', upload.single('image'), async (req, res) => {
   console.log("✅ Route hit: /api/detect");
  try {
    const imagePath = path.resolve(req.file.path);
    const [result] = await client.labelDetection(imagePath);

    const labels = result.labelAnnotations.map(label => label.description.toLowerCase());

    const knownEquipment = ['dumbbell', 'barbell', 'treadmill', 'kettlebell', 'leg press'];

    const detected = labels.find(label =>
      knownEquipment.some(eq => label.includes(eq))
    );

    if (!detected) {
      return res.status(404).json({ error: 'No gym equipment detected' });
    }

    res.json({ equipment: detected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Detection failed' });
  }
});

module.exports = router;
