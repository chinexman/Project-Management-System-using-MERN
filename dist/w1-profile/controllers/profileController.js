"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = exports.updateProfile = exports.createProfile = void 0;
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
        console.log(userAuthorization);
        return userAuthorization;
    }
    catch (err) {
        throw new Error("Invalid token!");
    }
}
exports.authorizeUser = authorizeUser;
//Function to create Profile 
async function createProfile(req, res) {
    const user = authorizeUser(req, res);
    console.log(req.cookies.token);
    console.log(user);
    const profileSchema = joi_1.default.object({
        email: joi_1.default.string().min(3).max(255).required(),
        firstName: joi_1.default.string().min(3).max(255).required(),
        lastName: joi_1.default.string().min(3).max(255).required(),
        gender: joi_1.default.string().min(3).max(255).required(),
        role: joi_1.default.string().min(3).max(255).required(),
        location: joi_1.default.string().min(3).max(255).required(),
        about: joi_1.default.string().min(10).max(255).required(),
        profileImage: joi_1.default.string().min(3).max(255).required(),
    });
    const profileValidate = profileSchema.validate(req.body);
    if (profileValidate.error) {
        return res.status(400).json({
            message: profileValidate.error.details[0].message,
        });
    }
    let findProfile = await profileModel_1.default.findOne({ userId: user.user_id });
    console.log(findProfile);
    console.log("i got befor findprofile");
    if (findProfile) {
        return res.status(400).json({
            message: `Profile  with user ${user.user_email} already exist`
        });
    }
    console.log("second place");
    let profileObject = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    profileObject = { ...profileObject, createdAt, updatedAt };
    const profileAccount = await profileModel_1.default.create({
        userId: user.user_id,
        email: profileObject.email,
        firstName: profileObject.firstName,
        lastName: profileObject.lastName,
        gender: profileObject.gender,
        role: profileObject.role,
        location: profileObject.location,
        about: profileObject.about,
        profileImage: profileObject.profileImage,
        createdAt: profileObject.createdAt,
        updatedAt: profileObject.updatedAt,
    });
    res.status(201).json({
        status: "success",
        data: profileAccount
    });
}
exports.createProfile = createProfile;
//Function to get Profile by id
// async function getAProfile(id: String, request: any) {
//     const userId = authorizeUser(request)
//     let singleProfile = await Profile.findOne({userId, _id: id})
//     return singleProfile
// }
//Function to edit a Profile
async function updateProfile(req, res) {
    const user = authorizeUser(req, res);
    const { firstName, lastName, gender, role, location, about, profileImage } = req.body;
    let findProfile = await profileModel_1.default.findOne({ userId: user.user_id });
    console.log(findProfile);
    if (!findProfile) {
        return res.status(404).json({
            status: "failed",
            message: "Profile does not exist"
        });
    }
    //   findProfile.firstName = firstName,
    //   findProfile.lastName = lastName,
    //   findProfile.gender = gender,
    //   findProfile.role = role,
    //   findProfile.location = location,
    //   findProfile.about = about,
    //   findProfile.profileImage = profileImage
    let updatedProfile = await profileModel_1.default.findOneAndUpdate({ userId: user.user_id }, { firstName: firstName, lastName: lastName, gender: gender, role: role, location: location, about: about, profileImage: profileImage }, { new: true });
    res.status(201).json({
        status: "success",
        data: updatedProfile
    });
}
exports.updateProfile = updateProfile;
