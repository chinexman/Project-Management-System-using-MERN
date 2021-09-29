import userModel from "../models/usersModel";
import express, { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { UserInterface} from "../interfaces/interface";
import sendMailer from '../utils/nodeMailer';

dotenv.config();

//Function to register users
async function registerUser(req: Request, res: Response) {
  const ValidateSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().required().min(6).max(225).email(),
    password: Joi.string().required().min(6).max(225),
  });

  //Validating User
  const validationValue = ValidateSchema.validate(req.body);
  if (validationValue.error) {
    return res.status(400).json({
      message: validationValue.error.details[0].message,
    });
  }
  //check for existing email
  const existingUser = await userModel.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({
      message: "User with email already exists!",
    });
  }
  //Hash user password
  const hashPassword = bcrypt.hashSync(req.body.password, 12);
  // Register user
  const value = await userModel.create({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: hashPassword,
  });

  res.status(201).json({
    data: value,
  });
}

//Function to login users
async function loginUser(req: Request, res: Response) {
  const validateSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  //validate body
  const validationResult = await validateSchema.validate(req.body);
  //check for errors
  if (validationResult.error) {
    return res.status(400).json({
      msg: validationResult.error.details[0].message,
    });
  }
  //check for existing email
  const existingUser = await userModel.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (!existingUser) {
    return res.status(404).json({
      message: "Account user does not exist!",
    });
  }
  //check if the password is wrong or doesn't match
  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    existingUser.password
  );
  if (!passwordIsValid) {
    console.log("pasword is invalid")
    //invalid password
    return res.status(400).json({
      message: "Invalid password",
    });
  }





  
  const token1 = jwt.sign(
    { user_id: existingUser._id, user_email: existingUser.email },
    process.env.SECRET_KEY as string,
    {
      expiresIn: process.env.DURATION,
    }
  );
        const link = `http://localhost:3000/users/profile/${token1}`
        // console.log(link)
        // console.log(token)
        
        //the variables for the nodemailer
        
        const body = `
        Dear ${existingUser.name},
  
        <p>Follow this <a href=${link}> link </a> to change your password. The link would expire in 45 mins.</P>
              `
  
        sendMailer(existingUser.email, body)
  
  
  




  //email exist and password matches, proceed to create token
  // Create token
  const token = jwt.sign(
    { user_id: existingUser._id, user_email: existingUser.email },
    process.env.SECRET_KEY as string,
    {
      expiresIn: process.env.DURATION,
    }
  );
  res.cookie("token", token, { httpOnly: true });

  res.status(200).json({
    status: "signed in successfully!",
    token,
  });
}

//Function to get All Users
async function getAllUsers(req: Request, res: Response) {
  const result= await userModel.find();
  return result;
}

//Function to logout
async function logoutUser(req: Request, res: Response) {
  if (!req.cookies.token) {
    return res.status(403).json({ msg: "Please login first" });
  }
  //clear the cookies
  res.clearCookie("token");
  res.status(200).json({
    msg: "Logged out successfully",
  });
}

export { registerUser, loginUser, getAllUsers, logoutUser };
