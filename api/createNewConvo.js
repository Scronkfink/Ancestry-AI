const User = require('../src/server/models/userModel.js');
require('dotenv').config({ path: './.env.local' });
const { connectToDatabase } = require('./db');
connectToDatabase();

userController.createNewConvo = async (req, res, next) => {

  const { username, title } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const newConvo = {
      title: title,
      isSelected: false,
      conversation: { user: [], bot: [] },
    };

    user.conversations.push(newConvo);

    await user.save();

    return next();
  } catch (error) {
    console.error("Error creating new conversation:", error);
    return res.status(500).send({ message: "An error occurred while creating the new conversation." });
  }
};