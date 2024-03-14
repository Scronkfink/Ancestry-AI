const express = require('express');
const path = require('path');
const userController = require('./controllers/userController');
const app = express();
app.use(express.json());
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_KEY);

app.use(express.static(path.join(__dirname, 'dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post('/signup', userController.signup, (req, res) => {
  res.status(200).json(res.locals.user);
});

app.post('/login', userController.login, (req, res) => {
  res.status(200).json({login: "success"});
});

app.post("/convo", userController.convo, (req, res) => {
  res.status(200).json({mission: "success"})
})

app.listen(3000, () => {
  console.log('Server online');
});

mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});