require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/Holdingsmode");
const { OrdersModel } = require("./model/Ordersmodel");
const { PositionsModel } = require("./model/Positionsmodel");

const app = express();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const UserModel = require("./model/UserModel");


app.use(cors());
app.use(bodyParser.json());

// const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

app.get('/allholdings', async (req, res) => {
  let allholdings = await HoldingsModel.find({});
  res.json(allholdings);
});

app.get('/allPositions', async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post('/newOrder', async (req, res) => {

  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });
  newOrder.save();
});

app.get('/allOrders', async (req, res) => {

  let allOrders = await OrdersModel.find({});

  res.json(allOrders);
});

app.post("/register", async (req, res) => {

  try {

    const {
      username,
      email,
      password,
    } = req.body;



    const existingUser =
      await UserModel.findOne({ email });



    if (existingUser) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new UserModel({

      username,

      email:
        email.toLowerCase(),

      password:
        hashedPassword,

    });

    await user.save();

    res.status(201).json({
      message:
        "User registered successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;



    const user =
      await UserModel.findOne({

        email:
        email.toLowerCase(),

      });



    if (!user) {

      return res.status(400).json({
        message: "User not found",
      });

    }



    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );



    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid password",
      });

    }



    const token = jwt.sign(

      {
        id: user._id,
      },

      "SECRET_KEY",

      {
        expiresIn: "7d",
      }

    );



    res.status(200).json({

      token,

      user: {

        id: user._id,

        username: user.username,

        email: user.email,

      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

// app.listen(PORT, () => {
//   console.log("Server is running on port 3002");
//   mongoose.connect(uri);
//   console.log("Connected to MongoDB");
// });