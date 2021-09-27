"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter = nodemailer_1.default.createTransport({
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
