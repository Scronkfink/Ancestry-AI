const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  title: { type: String, required: true },
  isSelected: { type: Boolean, required: true },
  conversation: {
    user: [String], // Assuming messages are strings; adjust if they're more complex
    bot: [String]
  }
});

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  conversations: [conversationSchema] // Use the schema for conversations
});

module.exports = mongoose.model('User', userSchema);
