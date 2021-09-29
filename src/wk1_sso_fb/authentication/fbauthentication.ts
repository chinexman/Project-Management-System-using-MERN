import passport from "passport";
import passportfacebook from "passport-facebook";
// import findOrCreate from "mongoose-findorcreate"
import dotenv from "dotenv"
// import User from "../models/userSchema";
import mongoose from "mongoose";
const findOrCreate = require("mongoose-findorcreate");
dotenv.config()


interface userInterface {
  facebookId: String;
  fullname: String;
}

const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);
userSchema.plugin(findOrCreate);
const User = mongoose.model("FBusers", userSchema);



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
      //TODO ovie refactor this code!
      User.findOneAndUpdate( //User.findOrCreate(
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

