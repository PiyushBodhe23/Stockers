const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../middlewares/model/UserModel");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashed,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


// **** IMPORTANT EXPORT ****
module.exports = {
  loginUser,
  registerUser,
};
