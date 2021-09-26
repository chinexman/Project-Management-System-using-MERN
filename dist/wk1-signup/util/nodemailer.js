"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'isintumejenny@gmail.com',
        pass: 'Jen.ny18',
    }
});
const sendMail = (email, body) => {
    let mailOptions = {
        from: 'isintumejenny@gmail.com',
        to: email,
        subject: 'Successfully Signed up',
        html: body
    };
    return transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('Error Occus: ', err);
        }
        console.log('Email sent!!:' + data);
    });
};
exports.default = sendMail;
