const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini_api_key = "AIzaSyBetXs8uAtM3HhPmAKIow9qEKuvzYa17nE";
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  geminiConfig,
});

async function test() {
  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: "hi" }] }],
    });
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
