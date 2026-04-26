const JWT = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Verifies the JWT token from the Authorization header.
 * Returns proper 401 status codes for auth failures instead of 200.
 */
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        // Differentiate between expired and invalid tokens
        const message =
          err.name === "TokenExpiredError"
            ? "Token expired, please login again"
            : "Invalid token";

        return res.status(401).send({
          message,
          success: false,
        });
      }

      req.body.userId = decode.id;
      next();
    });
  } catch (error) {
    res.status(401).send({
      message: "Authentication failed",
      success: false,
    });
  }
};