require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const holdingsRoute = require("./routes/holdingsRoute");
const positionsRoute = require("./routes/positionsRoute");
const orderRoute = require("./routes/orderRoute");
const userRoute = require("./routes/userRoute");

const PORT = process.env.PORT || 3001;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Attach Routes
app.use("/holdings", holdingsRoute);
app.use("/positions", positionsRoute);
app.use("/orders", orderRoute);
app.use("/users", userRoute);

// MongoDB Connect then start server
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB Connected!");
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed:", err);
  });
