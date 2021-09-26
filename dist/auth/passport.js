"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const extractJwt = passport_jwt_1.default.ExtractJwt;
const strategyJwt = passport_jwt_1.default.Strategy;
passport_1.default.use("google", new strategyJwt({
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "kdhfghfhdhfgfhhfhf",
}, function (jwtPayLoad, done) {
    return done(null, { name: "kayode Odole" });
}));
