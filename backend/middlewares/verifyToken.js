const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET; // move to .env later

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
  { id: newUser._id, email: newUser.email },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

res.json({ token });
;

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
