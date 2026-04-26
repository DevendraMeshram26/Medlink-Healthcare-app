const asyncHandler = require("../utils/asyncHandler");
const predictionService = require("../services/prediction.service");

/**
 * Controller to handle POST /predict requests.
 * Uses asyncHandler to automatically catch any errors thrown by the service.
 */
const predictDiseaseHandler = asyncHandler(async (req, res) => {
  const { symptoms } = req.body;

  // Basic input validation
  if (!symptoms) {
    // By throwing an error here, the global errorHandler automatically catches it
    const error = new Error("Please provide symptoms in the request body.");
    error.statusCode = 400;
    throw error;
  }

  // Call the Service Layer to handle the business logic
  const predictedDisease = await predictionService.getDiseasePrediction(symptoms);

  // Send the successful response
  res.status(200).send({
    status: true,
    message: "Disease prediction successful",
    data: predictedDisease,
  });
});

module.exports = { predictDiseaseHandler };
