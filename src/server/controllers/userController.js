const User = require("../models/userModel")
const userController = {}
require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



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

const isValidPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error validating password:", error);
    return false;
  }
};

userController.signup = async (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ username, password: hashedPassword, email: email});

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN, { expiresIn: '24h' });

    res.locals.newUser = { token, username: newUser.username }
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: err.message, message: "This username is taken" });
  }
  return next();
};

userController.login = async (req, res, next) => {
  
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }, { password: 1, username: 1, _id: 1 });

    if (!user || !(await isValidPassword(password, user.password))) {
      return res.status(422).json({ message: "That's an invalid username or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: '24h' }); 

    console.log(user)

    res.status(200).send({ token, username: user.username });
  } catch (err) {
    res.status(500).send({ message: "An error occurred during the login process." });
  }
};


userController.getConvos = (async(req, res, next) => {
  const username = req.body.username;

  try {
    // Use projection in the query to select only the title field from each conversation
    const response = await User.findOne({ username }, { 'conversations.title': 1, _id: 0 });

    console.log("This is response from getConvos: ", response);

    if (response) {
      // Map through the conversations to extract only the titles
      const titles = response.conversations.map(convo => ({ title: convo.title }));
      res.locals.conversations = titles;
      return next();
    } else {
      console.log(response);
      res.status(422).json({ message: "That's an invalid username or password, dumbass." });
    }
  } catch (err) {
    console.error(err);
    return next();
  }
});


userController.updateConvos = async (req, res, next) => {
  console.log("This is the req.body in updateConvos: ", req.body)
  const { username, conversationMessage, currentConversation } = req.body;

  try {
    // Fetch only the conversation matching the title
    const user = await User.findOne({ username }, { conversations: { $elemMatch: { title: currentConversation } } });

    console.log("This is the user object returned from updateConvos: ", user);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the conversation was found
    if (user.conversations.length === 0) {
      // If the conversation doesn't exist, add a new one
      const newConvo = {
        title: currentConversation,
        isSelected: false,
        conversation: {
          user: [conversationMessage.user],
          bot: [conversationMessage.bot]
        }
      };
      await User.updateOne({ username }, { $push: { conversations: newConvo } });
    } else {
      // Append the newest messages to the existing conversation
      const userPath = `conversations.$.conversation.user`;
      const botPath = `conversations.$.conversation.bot`;
      await User.updateOne(
        { username, "conversations.title": currentConversation },
        { $push: { [userPath]: conversationMessage.user, [botPath]: conversationMessage.bot } }
      );
    }

    // Fetch the updated conversations list to return it in the response
    const updatedUser = await User.findOne({ username }, { conversations: { $elemMatch: { title: currentConversation } } });
    res.locals.user = {
      username: updatedUser.username,
      conversations: updatedUser.conversations
    };
    return next();
  } catch (error) {
    console.error("Error updating user conversations:", error);
    res.status(500).send({ message: "Houston, we've had a problem updating the database" });
    return next();
  }
};



userController.deleteConvos = async (req, res, next) => {
  const { username, title } = req.body;

  try {
    // Find the user and update by removing the conversation with the matching title
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $pull: { conversations: { title: title } } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // Further actions here, like sending back the updated user or success message
    res.locals.user = updatedUser;
    return next();
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).send({ message: "Houston, we've had a problem updating the database" });
    return next();
  }
};


userController.getConversation = async (req, res, next) => {
  const { username, title } = req.body;

  try {
    // Use $elemMatch to find and return only the matching conversation
    const projection = {
      conversations: { $elemMatch: { title: title } }
    };

    const userWithConvo = await User.findOne({ username: username }, projection);

    if (!userWithConvo) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log("This is the object returned from getConversation: ", userWithConvo)

    if (!userWithConvo.conversations || userWithConvo.conversations.length === 0) {
      return res.status(404).send({ message: "Conversation not found" });
    }

    const conversation = userWithConvo.conversations[0];

    res.locals.conversation = conversation;
    return next();
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).send({ message: "An error occurred while fetching the conversation" });
  }
};

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



module.exports = userController