import dotenv from "dotenv";
import passport from "passport";
import passportGoogleOauth from "passport-google-oauth20";
import passportfacebook from "passport-facebook";
import userModel from "../models/user";
import bcrypt from "bcrypt";

const GoogleStrategy = passportGoogleOauth.Strategy;
const FacebookStrategy = passportfacebook.Strategy;

dotenv.config();
type customUser = { _id?: string } & Express.User;
//for cookie purpose after login
passport.serializeUser((user: customUser, done) => {
  //tokenize userId
  done(null, user._id);
});
//again visit the page
passport.deserializeUser((id, done) => {
  // console.log(id);
  userModel.findById(id).then((user) => {
    done(null, user);
  });
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
      const currentUser = await userModel
        .findOne({
          facebookId: profile.id,
        })
        .exec();
      //TODO ovie refactor this code!
      if (!currentUser) {
        const newUser = await userModel.create({
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.HOME_URL}:${process.env.PORT}/users/google/redirect`,
    },
    async function (accessToken, refreshToken, profile, done) {
      const currentUser = await userModel
        .findOne({ googleId: profile.id })
        .exec();
      console.log("google strategy currentUser:", currentUser);
      if (!currentUser) {
        // console.log("google strategy new : ", currentUser);
        const newUser = await userModel.create({
          googleId: profile.id,
          fullname: profile.displayName,
          email: profile.emails![0]["value"],
          password: bcrypt.hashSync(profile.id, 12),
        });
        return done(null, newUser);
      }
      return done(null, currentUser);
    }
  )
);
