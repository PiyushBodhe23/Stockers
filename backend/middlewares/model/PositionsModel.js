const mongoose = require("mongoose");
const PositionsSchema = require("../../schemas/PositionsSchema");

const PositionModel = mongoose.model("Positions", PositionsSchema);

module.exports = {
  PositionModel,
};
