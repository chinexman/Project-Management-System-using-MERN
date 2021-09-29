import express, { Request, Response, NextFunction } from 'express';
import Profile from "../models/profileModel"
import jwt, { JwtPayload } from 'jsonwebtoken'
import joi from 'joi';
// import {authorizeUser}



// function authorizeUser(req: customRequest, res: Response) {
//     const Token = req.cookies.token || req.headers.token;
//     if (!Token) {
//         throw new Error("Unauthorized user")
//     }
//     try {
//         const userAuthorization = jwt.verify(
//             Token.toString(),
//             process.env.SECRET_KEY as string
//         ) as JwtPayload;
//         console.log(userAuthorization);
//         return userAuthorization.user_id;
//     } catch (err) {
//         throw new Error("Invalid token!")
//     }
// }


type customRequest = Request & {
    user?: { _id?: string },
}
async function viewProfile(req: customRequest, res: Response) {
    const user_id = req.user!._id
    let viewprofile = await Profile.findOne({ userId: user_id })
    return res.status(400).json({
        status: "profile details",
        data: viewprofile
    });

}



//Function to create Profile 
async function createProfile(req: customRequest, res: Response) {
    const user_id = req.user!._id
    console.log(req.cookies.token);

    const profileSchema = joi.object({
        email: joi.string().min(3).max(255),
        firstName: joi.string().min(3).max(255),
        lastName: joi.string().min(3).max(255),
        gender: joi.string().min(3).max(255),
        role: joi.string().min(3).max(255),
        location: joi.string().min(3).max(255),
        about: joi.string().min(10).max(255),
        profileImage: joi.string().min(3).max(255),
    });

    const profileValidate = profileSchema.validate(req.body);
    if (profileValidate.error) {
        return res.status(400).json({
            message: profileValidate.error.details[0].message,
        });
    }

    let findProfile = await Profile.findOne({ userId: user_id })
    console.log(findProfile)
    console.log("i got befor findprofile")
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

    const profileAccount = await Profile.create({
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


//Function to get Profile by id
// async function getAProfile(id: String, customrequest: any) {
//     const userId = authorizeUser(customrequest)
//     let singleProfile = await Profile.findOne({userId, _id: id})
//     return singleProfile
// }

//Function to edit a Profile
async function updateProfile(req: customRequest, res: Response) {
    const user_id = req.user!._id
    const { firstName, lastName, gender, role, location, about, profileImage } = req.body

    let findProfile = await Profile.findOne({ userId: user_id })
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

    let updatedProfile = await Profile.findOneAndUpdate({ userId: user_id }, { firstName: firstName, lastName: lastName, gender: gender, role: role, location: location, about: about, profileImage: profileImage }, { new: true });
    res.status(201).json({
        status: "success",
        data: updatedProfile
    });
}

//Function to delete a Profile
// async function deleteProfile(id: string, customrequest: any){
//     const userId = authorizeUser(customrequest)
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
    viewProfile
    // // getAllProfiles, 
    // deleteProfile,
    // getAProfile
}





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