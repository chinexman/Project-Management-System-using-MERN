"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import Users from "../model/usersScema"
const secret = process.env.JWT_SECRETKEY;
//replacing the req with the context function
async function auth(req, res, next) {
    try {
        // console.log(req.headers, "headers")
        const token = req.headers.auth;
        if (!token) {
            return res.status(401).send({
                message: 'no token provided'
            });
        }
        const verified = jsonwebtoken_1.default.verify(token, secret); //why is this line of code given us the user back
        if (!verified) {
            return res.status(401).send({
                message: 'invalid token provided'
            });
        }
        req.user = verified;
        //the user object gets slammed or added to the request object on authorization
        next();
    }
    catch (err) {
        res.status(401).send("User not logged In");
    }
}
exports.auth = auth;
