import express from "express";
import passport, { Profile, Authenticator } from "passport";
//Nedd a database schema
import Users from "../wk1-signup/model/user";
import bcrypt from "bcrypt";
const localStrategy = require("passport-local").Strategy;
interface User {
  id?: string;
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
        const passwordMatch = bcrypt.compareSync(password, user.password);
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
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id, function (err: Error, user: User) {
    done(err, user);
  });
});
