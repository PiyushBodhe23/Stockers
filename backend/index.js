require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const holdingsRoute = require("./routes/holdingsRoute");
const positionsRoute = require("./routes/positionsRoute");
const orderRoute = require("./routes/orderRoute");
const userRoute = require("./routes/userRoute");
const watchlistRoute = require("./routes/watchlistRoute");
const marketRoute = require("./routes/marketRoute");
const fundsRoute = require("./routes/fundsRoute");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

// CORS configuration for React frontend
app.use(cors({
  origin: 'http://localhost:3000', // Your React app
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!", port: PORT });
});

// Attach Routes
app.use("/holdings", holdingsRoute);
app.use("/positions", positionsRoute);
app.use("/orders", orderRoute);
app.use("/users", userRoute);
app.use("/watchlist", watchlistRoute);
app.use("/market", marketRoute);
app.use("/funds", fundsRoute);

// MongoDB Connect then start server
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB Connected!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
      console.log("\n📋 Available Endpoints:");
      console.log(`   GET  http://localhost:${PORT}/holdings`);
      console.log(`   GET  http://localhost:${PORT}/positions`);
      console.log(`   GET  http://localhost:${PORT}/orders`);
      console.log(`   POST http://localhost:${PORT}/orders`);
      console.log(`   POST http://localhost:${PORT}/users/login`);
      console.log(`   POST http://localhost:${PORT}/users/register`);
      console.log(`   GET  http://localhost:${PORT}/watchlist`);
      console.log(`   GET  http://localhost:${PORT}/market/indices`);
      console.log(`   GET  http://localhost:${PORT}/funds`);
    });
  })
  .catch((err) => {
    console.log("❌ DB Connection Failed:", err);
  });