import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import cookieSession from "cookie-session";
import googleRouter from "./w1_googleAuth/routes/index";

// import indexRouter from "./routes/index";
// import usersRouter from "./routes/users";

var app = express();

// view engine setup
app.set("views", path.resolve(path.join(__dirname, "../", "views")));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(path.join(__dirname, "../", "public"))));

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

app.use("/w1-googlesso", googleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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
