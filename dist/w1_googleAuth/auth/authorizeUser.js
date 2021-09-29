"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// authCheck middleware function
function authorizeUser(req, res, next) {
    console.log("Authorize User: ", req.user);
    if (!req.user) {
        return res.redirect("/w1-googlesso/login");
    }
    next();
}
exports.default = authorizeUser;
