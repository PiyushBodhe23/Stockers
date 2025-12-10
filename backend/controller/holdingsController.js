const { HoldingModel } = require("../middlewares/model/HoldingsModel");

exports.getAllHoldings = async (req, res) => {
  try {
    const data = await HoldingModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
