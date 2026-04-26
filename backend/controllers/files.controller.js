const multer = require("multer");
const fs = require("fs");
const config = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Analyze a food image using Groq's Llama Vision model.
 * Note: llama-3.2-90b-vision-preview supports image analysis.
 *
 * @param {string} filePath - Path to the uploaded image file.
 * @returns {Object} - Parsed food analysis data.
 */
async function analyzeFood(filePath) {
  const imageFile = await fs.promises.readFile(filePath);
  const imageBase64 = imageFile.toString("base64");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.ai.groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.2-90b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Analyse the food in this image and answer in only in English language and give output in this manner in a json format eg {"Name":"Chicken Burger","status":"unhealthy","description":"the food contains paneer and gravy","est_calories":"400-500 cal","XP":"the value ranges from 1-10 depending on the food health","diet":"suggest a good diet for the person to stay fit and healthy"} pls do not hallucinate and give unique recommendations. Return ONLY valid JSON, no markdown.',
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.4,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq Vision API Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  let resultText = data.choices[0].message.content;

  // Clean markdown code block wrappers if present
  if (resultText.startsWith("```json")) {
    resultText = resultText.substring(7);
  }
  if (resultText.startsWith("```")) {
    resultText = resultText.substring(3);
  }
  if (resultText.endsWith("```")) {
    resultText = resultText.slice(0, -3);
  }
  resultText = resultText.trim();

  return resultText;
}

// Multer storage config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * Controller to handle food image upload and analysis.
 */
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Please upload an image file.");
    error.statusCode = 400;
    throw error;
  }

  const filePath = req.file.path;
  const analysisResult = await analyzeFood(filePath);

  // Clean up uploaded file after processing
  fs.unlink(filePath, () => {});

  res.status(200).send({
    status: true,
    message: "Food analysis complete",
    data: analysisResult,
  });
});

module.exports = { upload, uploadFile };
