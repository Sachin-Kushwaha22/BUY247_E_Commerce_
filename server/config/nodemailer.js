const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.SENDER_MAIL,  // Your Gmail address
        pass: process.env.SMTP_GMAIL_PASS  // Use the generated App Password
    }
});

module.exports = transporter
