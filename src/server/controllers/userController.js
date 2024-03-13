const User = require("../models/userModel")
const userController = {}

userController.signup = (async(req, res, next) => {

  console.log("AYE CAPT'N HERE BE YOUR USER!", req.body)
  const username = req.body.username
  const password = req.body.password

  try{
    const response = await User.create({username, password})
    res.locals.user = {username: response.username, password: response.password}
    return next()
  }

  catch (err){
    res.status(422).send({error: err.message, message: "This username is taken"})
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