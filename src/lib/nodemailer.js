const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendMail = (to, subject, body) => {
    const from = "working.abdullahmia@gmail.com";
    mailTransporter.sendMail({ from, to, subject, text: body });
};

module.exports = sendMail;
