const { model } = require("mongoose");
const { HoldingsSchema } = require("../schemas/HoldingsSchema");

const HoldingsModel = model("holdings", HoldingsSchema);

module.exports = { HoldingsModel };