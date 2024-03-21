const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const emailController = {};

const html = fs.readFileSync(
  path.join(__dirname, '../../email.html'),
);


const transporter = nodemailer.createTransport({
  service: 'Yahoo',
  auth: {
    user: process.env.YAHOO_EMAIL, 
    pass: process.env.YAHOO_APP_PASSWORD, 
  },
});

emailController.signup = async (req, res, next) => {
  const { email } = req.body;

  const mailOptions = {
    from: process.env.YAHOO_EMAIL,
    to: email, 
    subject: 'Welcome to Ancestry AI!',
    html: html,
  };

  try {
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    return next(error);
  }

  return next();
};

module.exports = emailController;
