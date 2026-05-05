const config = require("../config/env");

/**
 * Service to handle disease prediction business logic using the Groq API.
 * 
 * @param {string} symptoms - The symptoms provided by the user.
 * @returns {string} - The JSON string result from the AI model.
 */
async function getDiseasePrediction(symptoms) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.ai.groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant. When given symptoms, respond ONLY with valid JSON in this exact format (no markdown, no backticks):
{
  "symptoms": "user's symptoms",
  "possibleDisease": "most likely condition",
  "severity": "Mild/Moderate/Severe",
  "doctorToConsult": "Specialist type",
  "description": "2-3 line explanation of the condition",
  "immediateSteps": ["step 1", "step 2", "step 3"],
  "warning": "When to seek emergency care (1 line)"
}
Be concise. Do not use asterisks or special formatting. Return ONLY valid JSON.`,
        },
        {
          role: "user",
          content: `My symptoms: ${symptoms}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 512,
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
