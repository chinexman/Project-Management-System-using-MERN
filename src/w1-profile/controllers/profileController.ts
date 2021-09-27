import express, { Request, Response, NextFunction } from 'express';
import Profile from "../models/profileModel"
import jwt, { JwtPayload } from 'jsonwebtoken'
import joi from 'joi';


function authorizeUser(req: Request, res: Response) {
    const jwtToken = req.cookies.token || req.headers.token;
    if (!jwtToken) {
        throw new Error("Unauthorized user")
    }
    try {
        const userAuthorization = jwt.verify(
            jwtToken.toString(),
            process.env.SECRET_KEY as string
        ) as JwtPayload;
      console.log(userAuthorization);
        return userAuthorization;
    } catch (err) {
        throw new Error("Invalid token!")
    }
}

//Function to create Profile 
async function createProfile(req: Request, res: Response) {
    const user = authorizeUser(req, res);
    console.log(req.cookies.token);
    console.log(user);

    const profileSchema = joi.object({
        email: joi.string().min(3).max(255).required(),
        firstName: joi.string().min(3).max(255).required(),
        lastName: joi.string().min(3).max(255).required(),
        gender: joi.string().min(3).max(255).required(),
        role: joi.string().min(3).max(255).required(),
        location: joi.string().min(3).max(255).required(),
        about: joi.string().min(10).max(255).required(),
        profileImage: joi.string().min(3).max(255).required(),
    });

    const profileValidate = profileSchema.validate(req.body);
    if (profileValidate.error) {
        return res.status(400).json({
            message: profileValidate.error.details[0].message,
        });
    }

    let findProfile = await Profile.findOne({userId:user.user_id}) 
    console.log(findProfile)
    console.log("i got befor findprofile")
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

    const profileAccount = await Profile.create({
        userId : user.user_id,
        email : profileObject.email,
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


//Function to get Profile by id
// async function getAProfile(id: String, request: any) {
//     const userId = authorizeUser(request)
//     let singleProfile = await Profile.findOne({userId, _id: id})
//     return singleProfile
// }

//Function to edit a Profile
async function updateProfile(req: Request, res: Response){
    const user = authorizeUser(req, res);
const { firstName,lastName,gender,role,location,about,profileImage} = req.body
    
    let findProfile = await Profile.findOne({userId: user.user_id}) 
    console.log(findProfile)
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

     let updatedProfile = await Profile.findOneAndUpdate({userId:user.user_id}, { firstName:firstName,lastName:lastName,gender:gender,role:role,location:location,about:about,profileImage:profileImage}, {new: true});
    res.status(201).json({
        status: "success",
        data: updatedProfile
    });
}

//Function to delete a Profile
// async function deleteProfile(id: string, request: any){
//     const userId = authorizeUser(request)
//     const ProfileId = id;
//     let findProfile = await Profile.findOne({userId, _id: id}) 
//         if (!findProfile) {
//             throw new Error("Profile does not exist")
//         }
//     let deletedProfile = await Profile.findByIdAndDelete(ProfileId)
//     return `Profile with ${ProfileId} deleted successfully`
// }

export {
    createProfile,
    updateProfile, 
    // // getAllProfiles, 
    // deleteProfile,
    // getAProfile
}