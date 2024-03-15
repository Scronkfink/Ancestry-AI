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
      console.log(response)
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
    const response = await User.find({username, password})
    console.log(response)
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
    // First, check if the user and specific conversation title exist
    let user = await User.findOne({
      username: username,
      "conversations.title": currentConversation
    });

    if (user) {
      // The conversation title exists, append the new message to the conversation array
      await User.updateOne(
        { username: username, "conversations.title": currentConversation },
        {
          $push: { "conversations.$.conversation": conversationMessage }
        }
      );
    } else {
      // The conversation title does not exist, push a new conversation object
      await User.findOneAndUpdate(
        { username: username },
        {
          $push: {
            conversations: {
              title: currentConversation,
              isSelected: false, // Assuming default
              conversation: [conversationMessage] // Initialize with the new message
            }
          }
        },
        { new: true }
      );
    }

    // Optionally, fetch the updated user to return or for further processing
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



module.exports = userController