"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//generation of token
const secret = process.env.JWT_SECRET;
const days = process.env.JWT_EXPIRES_IN;
const signToken = (user) => {
    // console.log("token-user", user)
    // console.log("secret", secret)
    const { id, username, password, email, name } = user;
    return jsonwebtoken_1.default.sign({ id, username, password, email, name }, secret, {
        expiresIn: days,
    });
};
exports.signToken = signToken;
