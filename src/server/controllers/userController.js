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

userController.convo = (async(req, res, next) => {

  console.log("AYE CAPT'N HERE IS YE CONVO! ", req.body)

  const bot = ""
  const user = ""

  try{
    const response = await User.updateOne({username, })
    res.locals.user = {username: response.username, password: response.password}
    return next()
  }
  catch{
    res.status(500).send({message: "Housten, we've had a problem updating the database"})
    return next()
  }

});

module.exports = userController