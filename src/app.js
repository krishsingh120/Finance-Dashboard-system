const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const errorMiddleware = require("./middlewares/error.middleware");
const NotFoundError = require("./errors/notFound.error");

const app = express();

// security middlewares
app.use(helmet());
app.use(cors());

// request logger
app.use(morgan("dev"));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiter — global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use(limiter);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// routes — baad mein mount karenge
// app.use('/api/auth', authRoutes)
// app.use('/api/users', userRoutes)
// app.use('/api/records', recordRoutes)
// app.use('/api/dashboard', dashboardRoutes)

// 404 handler — sab routes ke baad
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// global error handler — sabse last mein
app.use(errorMiddleware);

module.exports = app;
