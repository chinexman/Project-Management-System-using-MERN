"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_local_1 = require("passport-local");
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email" }, async (email, password, done) => {
    //Vetting a user
    try {
        let user = await user_1.default.findOne({ email: email });
        if (!user) {
            return done(null, false, {
                message: " This email  does not exit ",
            });
        }
        const passwordMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: "User password is incorrect" });
        }
        else {
            return done(null, user);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => {
    user_1.default.findById(id, function (err, user) {
        done(err, user);
    });
});
