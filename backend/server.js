const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
const dotenv = require("dotenv").config();
const DB_connection = require("./helper/DB_connection");

// ─── Security Middleware ───────────────────────────────────────
// Helmet: Sets secure HTTP headers (XSS protection, HSTS, etc.)
app.use(helmet());

// Rate Limiter: Prevents brute-force attacks on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 login/register attempts per IP per 15 min
  message: {
    status: false,
    message: "Too many attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter (more generous)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Core Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize()); // Prevents NoSQL injection attacks
app.use(morgan("dev"));

// ─── Database ─────────────────────────────────────────────────
DB_connection();
const port = process.env.PORT || 6970;

// ─── Routes ───────────────────────────────────────────────────
const userRoutes = require("./routes/user.routes");
const fileRoutes = require("./routes/files.routes");
const doctorRoutes = require("./routes/doctor.routes");
const bookingRoutes = require("./routes/booking.routes");
const adminRoutes = require("./routes/admin.routes");
const reviewRoutes = require("./routes/review.routes");
const errorHandler = require("./middleware/errorHandler");

// Apply strict rate limit to auth routes only
app.use("/api/v1/login", authLimiter);
app.use("/api/v1/register", authLimiter);

// Apply general rate limit to all API routes
app.use("/api/v1/", apiLimiter, userRoutes);
app.use("/api/v1/", fileRoutes);
app.use("/api/v1/", doctorRoutes);
app.use("/api/v1/", bookingRoutes);
app.use("/api/v1/", adminRoutes);
app.use("/api/v1/", reviewRoutes);

// Global Error Handler Middleware (must be AFTER all routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
});
