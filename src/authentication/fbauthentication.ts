import passport from "passport";
import passportfacebook from "passport-facebook";
import mongoose from "mongoose";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

interface userInterface {
  facebookId: String;
  fullname: String;
}

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

const FacebookStrategy = passportfacebook.Strategy;

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
      callbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
      profileFields: ["id", "displayName", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      const currentUser = await UserModel.findOne({
        facebookId: profile.id,
      }).exec();
      //TODO ovie refactor this code!
      if (!currentUser) {
        const newUser = await UserModel.create({
          facebookId: profile.id,
          fullname: profile.displayName,
          email: profile._json.email,
          password: bcrypt.hashSync(profile.id, 12),
        });
        return done(null, profile);
      }
      return done(null, profile);
    }
  )
);
