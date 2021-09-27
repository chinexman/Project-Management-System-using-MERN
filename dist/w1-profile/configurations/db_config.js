"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function databaseConnection() {
    mongoose_1.default.connect(process.env.DATABASE_URL)
        .then(() => console.log("Connecting in 5,4,3,3,1...."))
        .catch((err) => console.log(" Error Connecting to Database => ", err));
}
exports.default = databaseConnection;
