const User = require('../models/userModel');
require('dotenv').config({ path: './.env.local' });

module.exports = async (req, res) => {
  const { username, conversationMessage, currentConversation } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const convoIndex = user.conversations.findIndex(convo => convo.title === currentConversation);
    if (convoIndex !== -1) {
      // Append the newest messages
      user.conversations[convoIndex].conversation.user.push(conversationMessage.user);
      user.conversations[convoIndex].conversation.bot.push(conversationMessage.bot);
      user.markModified('conversations');
    } else {
      // If the conversation doesn't exist, create a new one
      const newConvo = {
        title: currentConversation,
        isSelected: false,
        conversation: {
          user: [conversationMessage.user],
          bot: [conversationMessage.bot]
        }
      };
      user.conversations.push(newConvo);
    }

    await user.save();

    res.status(200).json({
      username: user.username,
      conversations: user.conversations
    });
  } catch (error) {
    console.error("Error updating user conversations:", error);
    res.status(500).json({ message: "Houston, we've had a problem updating the database" });
  }
};
