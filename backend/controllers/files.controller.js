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
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist AI. Analyze food images and return ONLY valid JSON with no markdown formatting. Be concise and accurate.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the food in this image. Return ONLY valid JSON in this exact format:
{
  "Name": "Food name",
  "status": "healthy/moderate/unhealthy",
  "est_calories": "300-400 cal",
  "macros": {
    "protein": "12g",
    "carbs": "45g",
    "fats": "8g",
    "fiber": "3g",
    "sugar": "5g"
  },
  "description": "Brief 1-line description of the food",
  "healthTip": "One practical health tip about this food",
  "diet": "Brief diet suggestion in 1-2 lines"
}
Return ONLY valid JSON, no markdown, no backticks.`,
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
      temperature: 0.3,
      max_tokens: 512,
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

  // Parse the JSON string from the AI model
  let parsedData;
  try {
    parsedData = JSON.parse(analysisResult);
  } catch (e) {
    parsedData = { Name: "Unknown", description: analysisResult };
  }

  res.status(200).send({
    status: true,
    message: "Food analysis complete",
    data: parsedData,
  });
});

module.exports = { upload, uploadFile };
