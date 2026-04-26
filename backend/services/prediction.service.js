const config = require("../config/env");

/**
 * Service to handle disease prediction business logic using the Groq API.
 * 
 * @param {string} symptoms - The symptoms provided by the user.
 * @returns {string} - The JSON string result from the AI model.
 */
async function getDiseasePrediction(symptoms) {
  const prompt = `Analyze the following symptoms and suggest a possible disease(s) in English language: ${symptoms} and give suggested disease on the basis of symptoms in this manner {symptoms:"Pain chest",PossibleDisease:"Angina " , doctorToConsult:"Cardiologist", desription:"Small discription about disease"} dont use asterisk or special characters  in response text`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.ai.groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // This error will be automatically caught by our asyncHandler and sent to the global Error Handler
    throw new Error(`Groq API Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = {
  getDiseasePrediction,
};
