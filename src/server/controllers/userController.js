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
  const password = req.body.password

  try{
    const response = await User.find({username})
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
    // Check if the user and specific conversation title exist
    let user = await User.findOne({
      username: username,
      "conversations.title": currentConversation
    });

    if (user) {
      // Determine if the message is from the user or the bot
      const messageKey = conversationMessage.from === 'user' ? "conversations.$.conversation.user" : "conversations.$.conversation.bot";
      
      // Append the new message to the appropriate array in the conversation object
      await User.updateOne(
        { username: username, "conversations.title": currentConversation },
        {
          $push: { [messageKey]: conversationMessage.message }
        }
      );
    } else {
      // The conversation title does not exist, push a new conversation object with user and bot arrays initialized
      await User.findOneAndUpdate(
        { username: username },
        {
          $push: {
            conversations: {
              title: currentConversation,
              isSelected: false, // Assuming default
              conversation: { user: [], bot: [] } // Initialize both arrays
            }
          }
        },
        { new: true }
      );
      
      // Since this is a new conversation, add the initial message to the correct array
      const initialMessageKey = conversationMessage.from === 'user' ? "conversations.$.conversation.user" : "conversations.$.conversation.bot";
      await User.updateOne(
        { username: username, "conversations.title": currentConversation },
        {
          $push: { [initialMessageKey]: conversationMessage.message }
        }
      );
    }

    // Fetch the updated user to return or for further processing
    user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

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