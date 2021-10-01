import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
// import profileRouter from "./w1-profile/routes/profile";
import passport from "passport";
// import homeRouter from "./wk1_sso_fb/routes/home";
import cookieSession from "cookie-session";
// import googleRouter from "./w1_googleAuth/routes/index";
import flash from "connect-flash";
// import passwordRouter from "./w1_resetPassword_Auth/routes/passwordchange";
// import usersRouter from "./wk1-signup/routes/users";
import mainUsersRouter from "./routers/users_router";
// import loginRoute from "./w1-Login/route";
const app = express();

// view engine setup
app.set("views", path.resolve(path.join(__dirname, "../", "views")));
app.use(express.static(path.resolve(path.join(__dirname, "../", "public"))));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cookieSession({
    maxAge: 3 * 60 * 1000, //3 MINUTES
    secret: process.env.JWT_SECRETKEY,
    keys: [
      process.env.COOKIE_SESSION_KEY1 as string,
      process.env.COOKIE_SESSION_KEY2 as string,
    ],
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());
//GLobal Vars
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success_msg = req.flash("sucess_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
// combination area
/*  ROUTES
/welcome
../login
../logout
../loginfail
../google
../google/redirect
../auth/facebook
../auth/facebook/callback
../loginPage
../signup
/acc-activation/:token 
*/
app.use("/users", mainUsersRouter);

// app.use("/user", usersRouter); //user sign up
// app.use("/user", loginRoute); // user login
// app.use("/user", googleRouter); // google signin
// app.use("/", homeRouter); //fb sso
// app.use("/user", passwordRouter); // password reset
// app.use("/user", profileRouter); // user profile
// app.use("/w1-profiles/users", userProfileRouter);

//app.use(sendMail)
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
    message: `Path Error: ${err.message}`,
  });
});

export default app;
