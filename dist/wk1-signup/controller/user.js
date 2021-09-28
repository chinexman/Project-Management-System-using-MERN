"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateUserAcct = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _ = require("lodash");
const validate_1 = __importDefault(require("../middleware/validate"));
const bcrypt = require('bcrypt');
const user_1 = __importDefault(require("../model/user"));
const nodemailer_1 = __importDefault(require("../util/nodemailer"));
async function createUser(req, res) {
    try {
        const validation = validate_1.default.validate(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details[0].message);
        }
        let { fullName, email, password } = req.body;
        const userObj = await user_1.default.findOne({ email: email });
        if (userObj) {
            return res.status(400).send("Email already exist");
        }
        const token = jsonwebtoken_1.default.sign({ fullName, email, password }, process.env.JWT_SECRETKEY, { expiresIn: '30m' });
        email = email;
        const body = `
            <h2>
            Thank you for successfully signing up, click <a href="http://localhost:${process.env.PORT}/user/acct-activation/${token}">here</a> to activate your account
            </h2>
            `;
        if (process.env.NODE_ENV != 'test') {
            (0, nodemailer_1.default)(email, body);
        }
        res.status(201).json({ msg: "Email has been sent, kindly activate your account." });
    }
    catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
}
exports.createUser = createUser;
async function activateUserAcct(req, res) {
    try {
        const token = req.params.token;
        console.log(token);
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRETKEY, async (err, decodedToken) => {
                if (err) {
                    res.status(400).json({ error: "Incorrect or Expired link" });
                    return;
                }
                const { fullName, email, password } = decodedToken;
                const checkEmail = await user_1.default.findOne({ email });
                if (checkEmail)
                    return res.status(400).json({ msg: 'User with this email already exists' });
                const hashPassword = await bcrypt.hash(password, 10);
                const newUser = new user_1.default({ fullName, email, password: hashPassword });
                const user = await newUser.save();
                if (user) {
                    return res.status(201).json({ msg: "New User created", user });
                }
                res.status(400).json({ success: false, msg: "Unable to activate user account" });
            });
        }
    }
    catch (err) {
        res.status(400).json({ msg: 'Something went wrong..' });
    }
}
exports.activateUserAcct = activateUserAcct;
// try{
// const validation = userSchema.validate(req.body)
// if(validation.error) {
//   return res.send(validation.error.details[0].message)
// }
// const userObj = await UserModel.findOne({email: req.body.email})
//     if(userObj) {
//         return res.status(400).send("Email already exist");
// }
//     const hashPassword = await bcrypt.hash(req.body.password, 10)
//     const user = new UserModel({
//         fullName: req.body.fullName,
//         //lastName: req.body.lastName,
//         email: req.body.email,
//         password: hashPassword,
//         confirmPassword: req.body.password
//     })
//     const email = req.body.email
//     const body = `
//             <p>
//                Thank you for successfully signing up, click <a href="#">here</a> to activate your account
//             </p>
//             `
//     await user.save()
//         sendMail(email, body)
//         res.status(201).json({msg: "You have successfully signed up, Log into your mail to continue."}); 
//         // res.status(201).json(_.pick(savedUser, ['_id', 'firstName', 'lastName', 'email']));            
// } catch(err) {
//     console.log(err)
//     res.status(400).send(`${err}`)
// }
