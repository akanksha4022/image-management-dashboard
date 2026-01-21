const axios = require("axios");
const fs = require("fs");

const analyzeImageWithGemini = async (filePath, mimeType) => {
  const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });

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

JSON format:
{
  "description": "one short sentence describing the image",
  "tags": ["tag1", "tag2"]
}
`
            },
            {
              inlineData: {
                mimeType,
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

  try {
    return JSON.parse(raw);
  } catch {
    return { description: "", tags: [] };
  }
};

module.exports = { analyzeImageWithGemini };
