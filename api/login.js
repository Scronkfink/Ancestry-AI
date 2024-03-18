const User = require('../src/server/models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env.local' });
const { connectToDatabase } = require('../db.js');
connectToDatabase();

const isValidPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error validating password:", error);
    return false;
  }
};

module.exports = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await isValidPassword(password, user.password))) {
      return res.status(422).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: '24h' });

    res.send({ token, username: user.username });
  } catch (err) {
    res.status(500).send({ message: "An error occurred during the login process." });
  }
};
