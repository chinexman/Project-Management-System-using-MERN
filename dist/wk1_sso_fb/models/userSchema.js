"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const findOrCreate = require("mongoose-findorcreate");
const userSchema = new mongoose_1.default.Schema({
    facebookId: {
        type: String,
        required: [true, "id is required"],
    },
    fullname: {
        type: String,
        required: [true, "fullname is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
}, { timestamps: true });
userSchema.plugin(findOrCreate);
const User = mongoose_1.default.model("FBusers", userSchema);
exports.User = User;
// export default User;
