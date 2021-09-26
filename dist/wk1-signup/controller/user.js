"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const _ = require("lodash");
const validate_1 = __importDefault(require("../middleware/validate"));
const bcrypt = require('bcrypt');
const user_1 = __importDefault(require("../model/user"));
const nodemailer_1 = __importDefault(require("../util/nodemailer"));
console.log('first');
async function createUser(req, res) {
    try {
        const validation = validate_1.default.validate(req.body);
        if (validation.error) {
            return res.send(validation.error.details[0].message);
        }
        const userObj = await user_1.default.findOne({ email: req.body.email });
        if (userObj) {
            return res.status(400).send("Email already exist");
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const user = new user_1.default({
            fullName: req.body.fullName,
            //lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            confirmPassword: req.body.password
        });
        const email = req.body.email;
        const body = `
                <p>
                   Thank you for successfully signing up, click <a href="#">here</a> to complete your sign up
                </p>
                `;
        const savedUser = await user.save();
        (0, nodemailer_1.default)(email, body);
        res.status(201).json({ savedUser, msg: "You have successfully signed up, Log into your mail to continue." });
        // res.status(201).json(_.pick(savedUser, ['_id', 'firstName', 'lastName', 'email']));            
    }
    catch (err) {
        console.log(err);
        res.status(400).send(`${err}`);
    }
}
exports.createUser = createUser;
