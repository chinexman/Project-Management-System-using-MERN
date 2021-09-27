"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
require('dotenv').config();
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'isintumejenny@gmail.com',
//         pass: 'Jen.ny18',
//     }
// })
// const sendMail = (email:string, body: string) => { 
//     let mailOptions = {
//         from: `Project Management Team <isintumejenny@gmail.com>`,
//         to: email,
//         subject: 'Successfully Signed up',
//         html: body
//     }
//     return transporter.sendMail(mailOptions, (err:any, data:any) => {
//         if (err) {
//             console.log('Error Occus: ', err)
//         }
//         console.log('Email sent!!:' + data)
//     })
// }
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'isintumejenny@gmail.com',
        pass: 'Jen.ny18',
    }
});
const sendMail = (email, body) => {
    let mailOptions = {
        from: `Project Management Team`,
        to: email,
        subject: 'Account activation link',
        html: body
    };
    return transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('Error Occurs: ', err);
        }
        console.log('Email sent!!:' + data);
    });
};
exports.default = sendMail;
