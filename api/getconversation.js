const User = require('../src/server/models/userModel.js');
require('dotenv').config({ path: './.env.local' });
const { connectToDatabase } = require('./db');
connectToDatabase();

module.exports = async (req, res) => {
  const { username, title } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const conversation = user.conversations.find(convo => convo.title === title);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "An error occurred while fetching the conversation" });
  }
};
