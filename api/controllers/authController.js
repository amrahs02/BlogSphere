const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const salt = bcrypt.genSaltSync(10);

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "Username already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res
        .status(400)
        .json({ error: true, message: "User does not exist" });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, (err, token) => {
        if (err)
          return res
            .status(500)
            .json({ error: true, message: "Token generation failed" });
        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          })
          .json({
            error: false,
            message: "Login successful",
            data: { id: userDoc._id, username },
          });
      });
    } else {
      res.status(400).json({ error: true, message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "").json("Logged out");
};

exports.profile = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err)
      return res.status(400).json({ message: "You are not authenticated" });
    try {
      const user = await User.findById(info.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...userWithoutPassword } = user._doc;
      res.json({ message: "User profile", user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
};
