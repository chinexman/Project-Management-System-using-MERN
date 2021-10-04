"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleSuccessCallBackFn = exports.logout = exports.login = exports.homePage = void 0;
function homePage(req, res) {
    console.log(req.user);
    res.render("googleHomepage", { data: req.user });
}
exports.homePage = homePage;
function login(req, res) {
    res.render("loginPage");
}
exports.login = login;
function logout(req, res) {
    req.logout();
}
exports.logout = logout;
function googleSuccessCallBackFn(req, res) {
    console.log(req.user);
    res.redirect("/user/googleprofile");
}
exports.googleSuccessCallBackFn = googleSuccessCallBackFn;
