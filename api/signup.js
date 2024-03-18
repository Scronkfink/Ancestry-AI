const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env.local' });

const hashPassword = async (password) => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

module.exports = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN, { expiresIn: '24h' });

    res.status(201).send({ token, username: newUser.username });
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: err.message, message: "This username is taken" });
  }
};
