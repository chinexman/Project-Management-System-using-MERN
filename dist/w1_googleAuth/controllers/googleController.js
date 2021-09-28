"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallBackFn = exports.logout = exports.login = exports.homePage = void 0;
function homePage(req, res) {
    console.log(req.user);
    res.render("homepage", { data: req.user });
}
exports.homePage = homePage;
function login(req, res) {
    res.render("loginPage");
}
exports.login = login;
function logout(req, res) {
    req.logout();
    res.redirect("/w1-googlesso/login");
}
exports.logout = logout;
function googleCallBackFn(req, res) {
    console.log(req.user);
    res.redirect("/w1-googlesso/profile");
}
exports.googleCallBackFn = googleCallBackFn;
