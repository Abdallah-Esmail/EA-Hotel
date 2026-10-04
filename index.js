// Import Libraries
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import qs from "qs";
import cors from "cors";

// Import Utils
import httpStatusText from "./utils/httpStatusText.js";
import globalError from "./middlewares/errorMiddleware.js";
dotenv.config();

import dbConnection, { sequelize } from "./config/database.js";

import "./models/index.js";

// import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import bookingRoute from "./routes/booking.route.js";
import roomRoute from "./routes/room.route.js";

import bookingController from "./controllers/booking.controller.js";

// Express app
const app = express();

// Cors
// app.use(
// cors({
// origin: ["https://ae-hotel.vercel.app", "http://localhost:5173"],
// credentials: true,
// }),
// );

// Webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  bookingController.webhookCheckout,
);

// Middlewares
app.use(express.json({ limit: "20kb" }));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Query String parser
app.set("query parser", (str) => qs.parse(str));

// Mount Routes
// app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/rooms", roomRoute);

// global middleware for not found router
app.use((req, res) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "Route not found",
  });
});

// global error handler
app.use(globalError);

let server;

try {
  await dbConnection();
  await sequelize.sync({ force: false });

  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));
} catch (err) {
  console.error("Failed to start server:", err);
  process.exit(1);
}

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
  if (server) {
    server.close(() => {
      console.error("Shutting down....");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
process.on("uncaughtException", (err) => {
  console.error(`uncaughtException Errors: ${err.name} | ${err.message}`);
  if (server) {
    server.close(() => {
      console.error("Shutting down....");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
