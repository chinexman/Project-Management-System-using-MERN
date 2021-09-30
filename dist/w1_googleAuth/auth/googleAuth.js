"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const user_1 = __importDefault(require("../../wk1-signup/model/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
dotenv_1.default.config();
//for cookie purpose after login
passport_1.default.serializeUser((user, done) => {
    console.log("SerializeUser says user.id: ", user.id);
    console.log("SerializeUser says user: ", user);
    //tokenize userId
    done(null, user.id);
});
//again visit the page
passport_1.default.deserializeUser((id, done) => {
    // console.log(id);
    user_1.default.findById(id).then((user) => {
        done(null, user);
    });
});
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/w1-googlesso/google/redirect",
}, async function (accessToken, refreshToken, profile, done) {
    const currentUser = await user_1.default
        .findOne({ google_id: profile.id })
        .exec();
    //   console.log("google strategy currentUser:", currentUser);
    if (!currentUser) {
        // console.log("google strategy new : ", currentUser);
        const newUser = await user_1.default.create({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0]["value"],
            password: bcrypt_1.default.hashSync(profile.id, 12),
        });
        return done(null, newUser);
    }
    return done(null, currentUser);
}));
