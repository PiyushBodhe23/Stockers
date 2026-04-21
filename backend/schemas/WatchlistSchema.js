const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
  qty: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
}, { timestamps: true });

module.exports = WatchlistSchema;