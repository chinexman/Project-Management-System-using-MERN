import passport from "passport";
import Users from "../models/user";
import bcrypt from "bcrypt";
import { Strategy as localStrategy } from "passport-local";

interface User {
  _id?: string;
}

passport.use(
  new localStrategy(
    { usernameField: "email" },
    async (email: string, password: string, done: Function) => {
      //Vetting a user
      try {
        let user = await Users.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            message: " This email  does not exit ",
          });
        }
        const passwordMatch = bcrypt.compareSync(
          password,
          user.password as string
        );
        if (!passwordMatch) {
          return done(null, false, { message: "User password is incorrect" });
        } else {
          return done(null, user);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);
passport.serializeUser((user: User, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id, function (err: Error, user: User) {
    done(err, user);
  });
});
