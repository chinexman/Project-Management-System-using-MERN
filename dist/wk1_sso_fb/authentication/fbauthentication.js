"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
// import findOrCreate from "mongoose-findorcreate"
const dotenv_1 = __importDefault(require("dotenv"));
// import User from "../models/userSchema";
const mongoose_1 = __importDefault(require("mongoose"));
const findOrCreate = require("mongoose-findorcreate");
dotenv_1.default.config();
const userSchema = new mongoose_1.default.Schema({
    facebookId: {
        type: String,
        required: [true, "id is required"],
    },
    fullname: {
        type: String,
        required: [true, "fullname is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
}, { timestamps: true });
userSchema.plugin(findOrCreate);
const User = mongoose_1.default.model("FBusers", userSchema);
const FacebookStrategy = passport_facebook_1.default.Strategy;
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3008/auth/facebook/callback",
    profileFields: ["id", "displayName", "email"],
}, function (accessToken, refreshToken, profile, done) {
    //TODO ovie refactor this code!
    User.findOneAndUpdate(//User.findOrCreate(
    { facebookId: profile.id, fullname: profile.displayName, email: profile._json.email }, function (err, user) {
        //    return cb(err, user);
        console.log(profile);
        return done(null, profile);
    });
}));
// function cb(err: any, user: any) {
//     throw new Error("Function not implemented.");
// }
