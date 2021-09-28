import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import passportfacebook from "passport-facebook";
import session from "express-session"
import dotenv from "dotenv";
const mongoose = require("mongoose");
require("dotenv").config();
require("./wk1_sso_fb/database/database");
import "./wk1_sso_fb/authentication/fbauthentication"
import homeRouter from "./wk1_sso_fb/routes/home";
import userRouter from "./wk1_sso_fb/routes/userRoutes";
const FacebookStrategy = passportfacebook.Strategy;
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/", homeRouter);
app.use("/users", userRouter);


// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: `Error occurred: ${err.message}`,
  });
});

export default app;
