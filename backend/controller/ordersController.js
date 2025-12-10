const OrdersModel = require("../middlewares/model/OrdersModel");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    const order = await OrdersModel.create({
      name,
      qty,
      price,
      mode,
      userId: req.user?.id || null
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
