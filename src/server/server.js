const express = require('express');
const path = require('path');
const userController = require('./controllers/userController');
const emailController = require("./controllers/emailController");
const apiController = require("./controllers/apiController");
require('dotenv').config();


const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_KEY);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../dist')));

// Custom CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = ['https://ancestryai.xyz', 'http://localhost:8080'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post('/api/llm', apiController.text, apiController.voice, (req, res)=> {
  res.status(200).send(res.locals.response);
});

app.post('/api/signup', userController.signup, emailController.signup, (req, res) => {
  res.status(200).send(res.locals.newUser);
});

app.post('/api/login', userController.login, (req, res) => {
  res.status(200).json(res.locals.user);
});

app.post('/api/getConvos', userController.getConvos, (req, res) => {
  res.status(200).json(res.locals.conversations);
});

app.post('/api/updateConvos', userController.updateConvos, (req, res) => {
  res.status(200).json(res.locals.user)
});

app.post("/api/deleteConvos", userController.deleteConvos, (req, res) => {
  res.status(200).json(res.locals.user)
});

app.post("/api/getconversation", userController.getConversation, (req, res) => {
  res.status(200).json(res.locals.conversation)
});

app.post("/api/createNewConvo", userController.createNewConvo, (req, res) => {
  res.status(200).json({mission: "completed for createNewConvo"})
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server online on port ${PORT}`);
});

mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});
