"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewProfile = exports.authorizeUser = exports.updateProfile = exports.createProfile = void 0;
const profileModel_1 = __importDefault(require("../models/profileModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
function authorizeUser(req, res) {
    const Token = req.cookies.token || req.headers.token;
    if (!Token) {
        throw new Error("Unauthorized user");
    }
    try {
        const userAuthorization = jsonwebtoken_1.default.verify(Token.toString(), process.env.SECRET_KEY);
        console.log(userAuthorization);
        return userAuthorization.user_id;
    }
    catch (err) {
        throw new Error("Invalid token!");
    }
}
exports.authorizeUser = authorizeUser;
async function viewProfile(req, res) {
    const user_id = authorizeUser(req, res);
    let viewprofile = await profileModel_1.default.findOne({ userId: user_id });
    return res.status(400).json({
        status: "profile details",
        data: viewprofile
    });
}
exports.viewProfile = viewProfile;
//Function to create Profile 
async function createProfile(req, res) {
    const user_id = authorizeUser(req, res);
    console.log(req.cookies.token);
    const profileSchema = joi_1.default.object({
        email: joi_1.default.string().min(3).max(255),
        firstName: joi_1.default.string().min(3).max(255),
        lastName: joi_1.default.string().min(3).max(255),
        gender: joi_1.default.string().min(3).max(255),
        role: joi_1.default.string().min(3).max(255),
        location: joi_1.default.string().min(3).max(255),
        about: joi_1.default.string().min(10).max(255),
        profileImage: joi_1.default.string().min(3).max(255),
    });
    const profileValidate = profileSchema.validate(req.body);
    if (profileValidate.error) {
        return res.status(400).json({
            message: profileValidate.error.details[0].message,
        });
    }
    let findProfile = await profileModel_1.default.findOne({ userId: user_id });
    console.log(findProfile);
    console.log("i got befor findprofile");
    if (findProfile) {
        return res.status(400).json({
            message: `Profile  already exist`
        });
    }
    console.log("second place");
    let profileObject = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    profileObject = { ...profileObject, createdAt, updatedAt };
    const profileAccount = await profileModel_1.default.create({
        userId: user_id,
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
    const user_id = authorizeUser(req, res);
    const { firstName, lastName, gender, role, location, about, profileImage } = req.body;
    let findProfile = await profileModel_1.default.findOne({ userId: user_id });
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
    let updatedProfile = await profileModel_1.default.findOneAndUpdate({ userId: user_id }, { firstName: firstName, lastName: lastName, gender: gender, role: role, location: location, about: about, profileImage: profileImage }, { new: true });
    res.status(201).json({
        status: "success",
        data: updatedProfile
    });
}
exports.updateProfile = updateProfile;
// const profileAccount = await Profile.create({
//     userId : user_id,
//     email : "",
//     firstName: "",
//     lastName: "",
//     gender: "",
//     role: "",
//     location: "",
//     about: "",
//     profileImage: "",
//     createdAt: new Date().toISOString();,
//     updatedAt: new Date().toISOString();,
// });
//required fields
// email: joi.string().min(3).max(255).required(),
// firstName: joi.string().min(3).max(255).required(),
// lastName: joi.string().min(3).max(255).required(),
// gender: joi.string().min(3).max(255).required(),
// role: joi.string().min(3).max(255).required(),
// location: joi.string().min(3).max(255).required(),
// about: joi.string().min(10).max(255).required(),
// profileImage: joi.string().min(3).max(255).required(),
