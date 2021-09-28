"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signUpSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please do input your name"]
    },
    email: {
        type: String,
        required: [true, "Please do input your email"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8
    }
    // ,
    // tokens: [
    //     {
    //         token: String,
    //     }
    // ]
});
signUpSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    next();
});
const SignUp = mongoose_1.default.model('SignUp', signUpSchema);
exports.default = SignUp;
