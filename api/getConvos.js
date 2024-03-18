const User = require('../models/userModel');
require('dotenv').config({ path: './.env.local' });

module.exports = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username }, 'conversations.title');

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Extract titles from the conversations
    const titles = user.conversations.map(convo => ({ title: convo.title }));

    res.status(200).json({ conversations: titles });
  } catch (err) {
    console.error("Error in getConvos:", err);
    res.status(500).json({ message: "An error occurred while fetching conversations." });
  }
};
