const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  mode: { type: String, enum: ["BUY", "SELL"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
}, { timestamps: true });

module.exports = OrdersSchema;
