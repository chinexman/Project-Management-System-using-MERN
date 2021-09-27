"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = void 0;
const profileModel_1 = __importDefault(require("../models/profileModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
function authorizeUser(req, res) {
    const jwtToken = req.cookies.token || req.headers.token;
    if (!jwtToken) {
        throw new Error("Unauthorized user");
    }
    try {
        const userAuthorization = jsonwebtoken_1.default.verify(jwtToken.toString(), process.env.SECRET_KEY);
        return userAuthorization.user_id;
    }
    catch (err) {
        throw new Error("Invalid token!");
    }
}
//Function to create Profile 
async function createProfile(req, res) {
    const userId = authorizeUser(req, res);
    console.log(req.cookies.token);
    console.log(userId);
    const profileSchema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(255).required(),
        address: joi_1.default.string().min(10).max(255).required(),
        profileImage: joi_1.default.string().min(3).max(255).required(),
        phoneNo: joi_1.default.number().min(5).required(),
    });
    const profileValidate = profileSchema.validate(req.body);
    if (profileValidate.error) {
        return res.status(400).json({
            message: profileValidate.error.details[0].message,
        });
    }
    let profileObject = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    profileObject = { ...profileObject, createdAt, updatedAt };
    const profileAccount = await profileModel_1.default.create({
        name: profileObject.name,
        address: profileObject.address,
        profileImage: profileObject.profileImage,
        phoneNo: profileObject.phoneNo,
        userId: userId,
        createdAt: profileObject.createdAt,
        updatedAt: profileObject.updatedAt,
    });
    res.status(201).json({
        status: "success",
        data: profileAccount
    });
}
exports.createProfile = createProfile;
