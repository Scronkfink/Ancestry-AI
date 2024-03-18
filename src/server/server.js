const express = require('express');
const path = require('path');
const userController = require('./controllers/userController');
const app = express();
app.use(express.json());
require('dotenv').config();

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:8080' }));

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_KEY);

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ancestryai.xyz');
  next();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post('/signup', userController.signup, (req, res) => {
  res.status(200).json(res.locals.user);
});

app.post('/login', userController.login, (req, res) => {
  res.status(200).json(res.locals.user);
});

app.post('/getConvos', userController.getConvos, (req, res) => {
  res.status(200).json(res.locals.conversations);
});

app.post('/updateConvos', userController.updateConvos, (req, res) => {
  res.status(200).json(res.locals.user)
});

app.post("/deleteConvos", userController.deleteConvos, (req, res) => {
  res.status(200).json(res.locals.user)
});

app.post("/getconversation", userController.getConversation, (req, res) => {
  res.status(200).json(res.locals.conversation)
});

app.post("/createNewConvo", userController.createNewConvo, (req, res) => {
  res.status(200).json({mission: "completed for createNewConvo"})
});


app.listen(3000, () => {
  console.log('Server online');
});

mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});