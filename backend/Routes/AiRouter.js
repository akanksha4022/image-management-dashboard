const express = require("express");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ---------- TEXT AI ---------- */
router.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: question }] }],
      }
    );

    const aiText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ reply: aiText });
  } catch (error) {
    console.error("Gemini text error:", error.response?.data || error);
    res.status(500).json({ reply: "AI request failed" });
  }
});

/* ---------- IMAGE AI ---------- */
router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are an AI vision system.
Analyze the image and respond with ONLY valid JSON.
Do not include explanations, markdown, or extra text.

JSON format:
{
  "description": "one short sentence describing the image",
  "tags": ["tag1", "tag2", "tag3"]
}
`
              },
              {
                inlineData: {
                  mimeType: req.file.mimetype,
                  data: imageBase64
                }
              }
            ]
          }
        ]
      }
    );

    let raw =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    raw = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("AI RAW OUTPUT:", raw);
      parsed = { description: "", tags: [] };
    }

    res.json(parsed);
  } catch (error) {
    console.error("Gemini image error:", error.response?.data || error);
    res.status(500).json({ message: "AI image analysis failed" });
  }
});


module.exports = router;
