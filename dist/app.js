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
const passport_1 = __importDefault(require("passport"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const index_1 = __importDefault(require("./w1_googleAuth/routes/index"));
// import indexRouter from "./routes/index";
// import usersRouter from "./routes/users";
var app = (0, express_1.default)();
// view engine setup
app.set("views", path_1.default.resolve(path_1.default.join(__dirname, "../", "views")));
app.set("view engine", "ejs");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.resolve(path_1.default.join(__dirname, "../", "public"))));
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
app.use("/w1-googlesso", index_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500).json({
        message: `Error occurred: ${err.message}`,
    });
});
exports.default = app;
