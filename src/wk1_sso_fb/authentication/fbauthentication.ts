import passport from "passport";
import passportfacebook from "passport-facebook";
// import findOrCreate from "mongoose-findorcreate"
const findOrCreate = require("mongoose-findorcreate")
import dotenv from "dotenv"
// import User from "../models/userSchema";
const User = require("../models/userSchema");
dotenv.config()

const FacebookStrategy = passportfacebook.Strategy


passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user: any, cb) {
  cb(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3008/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        { facebookId: profile.id, fullname: profile.displayName, email: profile._json.email },
        function (err: any, user: any) {
          //    return cb(err, user);
          console.log(profile);
          return done(null, profile);
        }
      );
    }
  )
);

// function cb(err: any, user: any) {
//     throw new Error("Function not implemented.");
// }

