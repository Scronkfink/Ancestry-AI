const User = require("../models/userModel")
const userController = {}

userController.signup = (async(req, res, next) => {

  const username = req.body.username
  const password = req.body.password

  try{
    const response = await User.create({username, password});
    res.locals.user = {username: response.username, password: response.password}
    return next()
  }

  catch (err){
    res.status(422).send({error: err.message, message: "This username is taken"})
    return next()
    }

});

userController.login = (async(req, res, next) => {

  const username = req.body.username
  const password = req.body.password

  try{
    const response = await User.find({username, password})
    if(response.length >= 1){
      res.locals.user = {username: username, password: password}
      return next()
    }
    else{
      res.status(422).json({message: "That's an invalid username or password, dumbass."})
    }
  }

  catch (err){
    return next()
    }

});

userController.getConvos = (async(req, res, next) => {
  
  const username = req.body.username

  try{
    const response = await User.find({username})
    console.log("IN SERVER; this is response from getConvos: ", response)
    if(response.length >= 1){
      res.locals.conversations = response[0].conversations
      return next()
    }
    else{
      console.log(response)
      res.status(422).json({message: "That's an invalid username or password, dumbass."})
    }
  }
  catch (err){
    return next()
    }
});

userController.updateConvos = async (req, res, next) => {
  const { username, conversationMessage, currentConversation } = req.body;

  try {
    // Find the user document
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the current conversation exists and update it
    const convoIndex = user.conversations.findIndex(convo => convo.title === currentConversation);
    if (convoIndex !== -1) {
      // Conversation exists, append messages
      conversationMessage.forEach(msg => {
        if (msg.user) user.conversations[convoIndex].conversation.user.push(msg.user);
        if (msg.bot) user.conversations[convoIndex].conversation.bot.push(msg.bot);
      });
    } else {
      // Conversation doesn't exist, create a new one
      const newConvo = {
        title: currentConversation,
        isSelected: false,
        conversation: { user: [], bot: [] }
      };
      conversationMessage.forEach(msg => {
        if (msg.user) newConvo.conversation.user.push(msg.user);
        if (msg.bot) newConvo.conversation.bot.push(msg.bot);
      });
      user.conversations.push(newConvo);
    }

    // Save the updated user document
    await user.save();

    res.locals.user = {
      username: user.username,
      conversations: user.conversations
    };
    return next();
  } catch (error) {
    console.error("Error updating user conversations:", error);
    res.status(500).send({ message: "Houston, we've had a problem updating the database" });
    return next();
  }
};




userController.deleteConvos = ( async(req,res,next) => {

  const updatedConversations = req.body.updatedConversations
  const username = req.body.username

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $set: { conversations: updatedConversations } }, 
      { new: true, returnDocument: 'after' } 
    );

    if (!updatedUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }
  
    res.locals.user = updatedUser;
    return next();
  } catch (error) {
    console.error("Error updating user conversations:", error);
    res.status(500).send({ message: "Houston, we've had a problem updating the database" });
    return next();
  }
});

userController.getConversation = async (req, res, next) => {
  const { username, title } = req.body;

  try {

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }


    const conversation = user.conversations.find(convo => convo.title === title);


    if (!conversation) {
      return res.status(404).send({ message: "Conversation not found" });
    }

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