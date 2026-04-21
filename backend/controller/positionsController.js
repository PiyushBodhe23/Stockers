const { PositionModel } = require("../middlewares/model/PositionsModel");

const getAllPositions = async (req, res) => {
  try {
    const data = await PositionModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllPositions,
};
