"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// const userSchema = new mongoose.Schema(
//   {
//     facebookId: {
//       type: String,
//       required: [true, "id is required"],
//     },
//     fullname: {
//       type: String,
//       required: [true, "fullname is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "email is required"],
//       unique: true,
//     },
//   },
//   { timestamps: true }
// );
// const User = mongoose.model("FBusers", userSchema);
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
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ["id", "displayName", "email"],
}, async function (accessToken, refreshToken, profile, done) {
    const currentUser = await user_1.default.findOne({
        facebookId: profile.id,
    }).exec();
    //TODO ovie refactor this code!
    if (!currentUser) {
        const newUser = await user_1.default.create({
            facebookId: profile.id,
            fullname: profile.displayName,
            email: profile._json.email,
            password: bcrypt_1.default.hashSync(profile.id, 12),
        });
        return done(null, profile);
    }
    return done(null, profile);
}));
