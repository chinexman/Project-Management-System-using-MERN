import dotenv from "dotenv";
import passport from "passport";
import passportGoogleOauth from "passport-google-oauth20";
import userModel from "../../wk1-signup/model/user";
import bcrypt from "bcrypt"

const GoogleStrategy = passportGoogleOauth.Strategy;

dotenv.config();
type customUser = { id?: string } & Express.User;
//for cookie purpose after login
passport.serializeUser((user: customUser, done) => {
  console.log("SerializeUser says user.id: ", user.id);
  console.log("SerializeUser says user: ", user);
  //tokenize userId
  done(null, user.id);
});
//again visit the page
passport.deserializeUser((id, done) => {
  // console.log(id);
  userModel.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/w1-googlesso/google/redirect",
    },
    async function (accessToken, refreshToken, profile, done) {
      const currentUser = await userModel
        .findOne({ google_id: profile.id })
        .exec();
      //   console.log("google strategy currentUser:", currentUser);
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
