"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const usersModel_1 = __importDefault(require("../models/usersModel"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Function to register users
async function registerUser(req, res) {
    const ValidateSchema = joi_1.default.object({
        name: joi_1.default.string().required().min(3).max(30),
        email: joi_1.default.string().required().min(6).max(225).email(),
        password: joi_1.default.string().required().min(6).max(225),
    });
    //Validating User
    const validationValue = ValidateSchema.validate(req.body);
    if (validationValue.error) {
        return res.status(400).json({
            message: validationValue.error.details[0].message,
        });
    }
    //check for existing email
    const existingUser = await usersModel_1.default.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({
            message: "User with email already exists!",
        });
    }
    //Hash user password
    const hashPassword = bcrypt_1.default.hashSync(req.body.password, 12);
    // Register user
    const value = await usersModel_1.default.create({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: hashPassword,
    });
    res.status(201).json({
        data: value,
    });
}
exports.registerUser = registerUser;
//Function to login users
async function loginUser(req, res) {
    const validateSchema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
    });
    //validate body
    const validationResult = await validateSchema.validate(req.body);
    //check for errors
    if (validationResult.error) {
        return res.status(400).json({
            msg: validationResult.error.details[0].message,
        });
    }
    //check for existing email
    const existingUser = await usersModel_1.default.findOne({
        email: req.body.email.toLowerCase(),
    });
    if (!existingUser) {
        return res.status(404).json({
            message: "Account user does not exist!",
        });
    }
    //check if the password is wrong or doesn't match
    const passwordIsValid = bcrypt_1.default.compareSync(req.body.password, existingUser.password);
    if (!passwordIsValid) {
        console.log("pasword is invalid");
        //invalid password
        return res.status(400).json({
            message: "Invalid password",
        });
    }
    //email exist and password matches, proceed to create token
    // Create token
    const token = jsonwebtoken_1.default.sign({ user_id: existingUser._id, user_email: existingUser.email }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({
        status: "signed in successfully!",
        token,
    });
}
exports.loginUser = loginUser;
//Function to get All Users
async function getAllUsers(req, res) {
    const result = await usersModel_1.default.find();
    return result;
}
exports.getAllUsers = getAllUsers;
//Function to logout
async function logoutUser(req, res) {
    if (!req.cookies.token) {
        return res.status(403).json({ msg: "Please login first" });
    }
    //clear the cookies
    res.clearCookie("token");
    res.status(200).json({
        msg: "Logged out successfully",
    });
}
exports.logoutUser = logoutUser;
