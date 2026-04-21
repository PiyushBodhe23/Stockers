const { WatchlistModel } = require("../middlewares/model/WatchlistModel");

exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await WatchlistModel.find({ userId: req.user?.id });
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { name, symbol, price, qty } = req.body;
    const watchlistItem = await WatchlistModel.create({
      name,
      symbol,
      price,
      qty,
      userId: req.user.id
    });
    res.json(watchlistItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    await WatchlistModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};