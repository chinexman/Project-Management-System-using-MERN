"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
// import profileRouter from "./w1-profile/routes/profile";
const passport_1 = __importDefault(require("passport"));
// import homeRouter from "./wk1_sso_fb/routes/home";
const cookie_session_1 = __importDefault(require("cookie-session"));
// import googleRouter from "./w1_googleAuth/routes/index";
const connect_flash_1 = __importDefault(require("connect-flash"));
// import passwordRouter from "./w1_resetPassword_Auth/routes/passwordchange";
// import usersRouter from "./wk1-signup/routes/users";
const users_router_1 = __importDefault(require("./routers/users_router"));
// import loginRoute from "./w1-Login/route";
const app = (0, express_1.default)();
// view engine setup
app.set("views", path_1.default.resolve(path_1.default.join(__dirname, "../", "views")));
app.use(express_1.default.static(path_1.default.resolve(path_1.default.join(__dirname, "../", "public"))));
app.set("view engine", "ejs");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cookie_session_1.default)({
    maxAge: 3 * 60 * 1000,
    secret: process.env.JWT_SECRETKEY,
    keys: [
        process.env.COOKIE_SESSION_KEY1,
        process.env.COOKIE_SESSION_KEY2,
    ],
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//Connect flash
app.use((0, connect_flash_1.default)());
//GLobal Vars
app.use((req, res, next) => {
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
app.use("/users", users_router_1.default);
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
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, _next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500).json({
        message: `Path Error: ${err.message}`,
    });
});
exports.default = app;
