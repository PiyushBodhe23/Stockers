const mongoose = require("mongoose");
const HoldingsSchema = require("../../schemas/HoldingsSchema");

const HoldingModel = mongoose.model("Holdings", HoldingsSchema);

module.exports = {
  HoldingModel,
};
