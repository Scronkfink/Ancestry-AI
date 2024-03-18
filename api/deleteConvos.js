const User = require('../models/userModel');
require('dotenv').config({ path: './.env.local' });

module.exports = async (req, res) => {
  const { username, title } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $pull: { conversations: { title } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Conversation deleted successfully", user: updatedUser });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ message: "An error occurred while deleting the conversation." });
  }
};
