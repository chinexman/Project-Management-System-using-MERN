"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const callbackurl = "http://localhost/3000/api/v1/auth";
let callBackUser = null;
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackurl,
}, (accessToken, refreshToken, profile, cb) => {
    const defaultUser = {
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        id: profile.id,
    };
    callBackUser = defaultUser;
    console.log(defaultUser);
    console.log("defaultUser:", defaultUser);
    return cb(null, defaultUser);
}));
passport_1.default.serializeUser;
passport_1.default.serializeUser((user, cb) => {
    console.log("serializing user:", user);
    cb(null, "rantingId");
});
passport_1.default.deserializeUser(async (id, cb) => {
    console.log("id of user before deserializing:", id);
    return cb(null, callBackUser);
});
