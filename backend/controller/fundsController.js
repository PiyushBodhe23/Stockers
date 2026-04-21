const { HoldingModel } = require("../middlewares/model/HoldingsModel");

exports.getFunds = async (req, res) => {
  try {
    const holdings = await HoldingModel.find({});
    
    let totalInvestment = 0;
    let totalCurrentValue = 0;
    
    holdings.forEach(holding => {
      totalInvestment += holding.avg * holding.qty;
      totalCurrentValue += holding.price * holding.qty;
    });
    
    const funds = {
      availableMargin: 1000000, // Default large amount
      usedMargin: totalInvestment,
      availableCash: 1000000 - totalInvestment,
      openingBalance: 1000000,
      dayBalance: totalCurrentValue - totalInvestment,
      payin: 0,
      span: totalInvestment * 0.15,
      deliveryMargin: totalInvestment * 0.5,
      exposure: totalInvestment * 0.35,
      optionsPremium: 0,
      collateralLiquid: 50000,
      collateralEquity: 100000,
      totalCollateral: 150000,
    };
    
    res.json(funds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};