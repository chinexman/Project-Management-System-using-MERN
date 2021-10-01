import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import joiUserSchema from "../validations/validate";
import bcrypt from "bcrypt";
import UserModel from "../models/user";
import ProfileModel from "../models/profileModel";
import sendMail from "../utils/nodemailer";
import Joi from "joi";
const _ = require("lodash");

const secret: string = process.env.JWT_SECRETKEY as string;

export async function createUser(req: Request, res: Response) {
  try {
    const validation = joiUserSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).send(validation.error.details[0].message);
    }
    let { fullname, email, password } = req.body;

    const userObj = await UserModel.findOne({ email: email });
    if (userObj) {
      return res.status(400).send("Email already exist");
    }
    const token = jwt.sign(
      { fullname, email, password },
      process.env.JWT_SECRETKEY as string,
      { expiresIn: process.env.JWT_EMAIL_EXPIRES as string }
    );

    email = email;
    const body = `
            <h2>
            Thank you for successfully signing up, click <a href="${process.env.HOME_URL}:${process.env.PORT}/users/acct-activation/${token}">here</a> to activate your account
            </h2>
            `;
    if (process.env.NODE_ENV != "test") {
      sendMail(email, body);
    }
    res
      .status(201)
      .json({ msg: "Email has been sent, kindly activate your account." });
  } catch (err) {
    console.log(err);
    res.status(400).send(`${err}`);
  }
}

export async function activateUserAcct(req: Request, res: Response) {
  try {
    const token = req.params.token;
    console.log(token);
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRETKEY as string,
        async (err: any, decodedToken: any) => {
          if (err) {
            res.status(400).json({ error: "Incorrect or Expired link" });
            return;
          }
          const { fullname, email, password } = decodedToken;
          console.log(decodedToken);
          const checkEmail = await UserModel.findOne({ email });

          if (checkEmail)
            return res
              .status(400)
              .json({ msg: "User with this email already exists" });
          const hashPassword = await bcrypt.hash(password, 10);
          const newUser = new UserModel({
            fullname,
            email,
            password: hashPassword,
          });
          const user = await newUser.save();

          if (user) {
            return res.status(201).json({ msg: "New User created", user });
          }
          res
            .status(400)
            .json({ success: false, msg: "Unable to activate user account" });
        }
      );
    }
  } catch (err) {
    res.status(400).json({ msg: "Something went wrong.." });
  }
}

export function logout(req: Request, res: Response) {
  req.logOut();
  res.json({
    msg: "Logged out successfully.",
  });
}

//fake home page for google
export function loginPage(req: Request, res: Response) {
  console.log(req.user);
  res.render("loginPage");
}

export function googleSuccessCallBackFn(req: Request, res: Response) {
  console.log("googleSuccessCB:", req.user);
  res.redirect("/users/welcome");
}

type customRequest = { user?: any } & Request;
export async function changePassword(req: customRequest, res: Response) {
  const { oldPassword, newPassword, repeatPassword } = req.body;

  //validation of all input fields
  const id = req.user._id;

  try {
    const validUser = await bcrypt.compare(oldPassword, req.user.password);
    // console.log(validUser, "validUser")
    if (validUser) {
      if (newPassword === repeatPassword) {
        const newPasswordUpdate = await bcrypt.hash(newPassword, 12);
        const newUserInfo = await UserModel.findByIdAndUpdate(
          { _id: id },
          { password: newPasswordUpdate },
          { new: true }
        );
        // console.log(newUserInfo, "newUserInfo")
        res.status(200).json({
          newUserInfo,
        });
        return;
      } else {
        res.status(404).json({
          message: "Password and repeat password does not match",
        });
        return;
      }
    } else {
      res.status(404).json({
        message: "Incorrect password",
      });
      return;
    }
    return res.json(req.body);
  } catch (err: any) {
    // console.log(err)
    res.status(400).json({
      error: err,
    });
    return;
  }
}

export async function forgetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    console.log(email);
    // const emailValidation: any = await validate(email)

    // if(emailValidation?.isValidDomain){
    const user = await UserModel.findOne({ email: email });
    console.log(user);
    // console.log(user)

    if (user) {
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "30mins" });
      const link = `${process.env.HOME_URL}:${process.env.PORT}/users/password/resetPassword/${token}`;
      // console.log(link)
      // console.log(token)

      //the variables for the nodemailer

      const body = `
        Dear ${user.fullname},
        <p>Follow this <a href=${link}> link </a> to change your password. The link would expire in 30 mins.</P>
              `;

      sendMail(email, body); ///adding the title variable to the nodemailer

      res.status(200).json({
        message: "Link sent to your mail.",
        link: link,
      });
    } else {
      res.status(400).json({
        message: "Email not found.",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Route crashed",
    });
  }
}

export async function verifyResetPassword(req: Request, res: Response) {
  let { token } = req.params;
  console.log(token, "token-verify");
  const verification = (await jwt.verify(token, secret)) as JwtPayload; ///verification
  console.log(verification, "verification");
  const id = verification.id;
  const isValidId = await UserModel.findOne({ _id: id });
  try {
    if (isValidId) {
      //line missing?
      token = jwt.sign({ id: id }, secret, { expiresIn: "1d" });
      res.render("reset-password", { title: "Reset-Password", token: token });
    }
  } catch (err) {
    res.json({
      message: err,
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  const { token } = req.params;
  console.log(token, "token-reset");
  try {
    const verification = (await jwt.verify(token, secret)) as JwtPayload; ///verification
    console.log(verification, "verification-reset");
    const id = verification.id;
    if (verification) {
      const user = await UserModel.findOne({ _id: id });
      if (user) {
        let { newPassword, repeatPassword } = req.body;
        if (newPassword === repeatPassword) {
          newPassword = await bcrypt.hash(newPassword, 12);
          const updatedUser = await UserModel.findOneAndUpdate(
            { _id: id },
            { password: newPassword },
            { new: true }
          );
          res.status(400).json({
            updatedUser: updatedUser,
          });
          return;
        } else {
          res.status(400).json({
            message: "newpassword and repeatpassword don't match",
          });
          return;
        }
      } else {
        res.status(400).json({
          message: "user does not exist",
        });
        return;
      }
    } else {
      res.status(400).json({
        message: "verification error",
      });
      return;
    }
  } catch (err: any) {
    res.status(400).json({
      message: "This is the catch block message",
      // message: "Catch block",
      error: err.message,
    });
    return;
  }
}

export async function viewProfile(req: customRequest, res: Response) {
  const user_id = req.user!._id;
  let viewprofile = await ProfileModel.findOne({ userId: user_id });
  return res.status(200).json({
    status: "profile details",
    data: viewprofile,
  });
}

export async function createProfile(req: customRequest, res: Response) {
  const user_id = req.user!._id;
  console.log(req.cookies.token);

  const profileSchema = Joi.object({
    email: Joi.string().min(3).max(255),
    firstName: Joi.string().min(3).max(255),
    lastName: Joi.string().min(3).max(255),
    gender: Joi.string().min(3).max(255),
    role: Joi.string().min(3).max(255),
    location: Joi.string().min(3).max(255),
    about: Joi.string().min(10).max(255),
    profileImage: Joi.string().min(3).max(255),
  });

  const profileValidate = profileSchema.validate(req.body);
  if (profileValidate.error) {
    return res.status(400).json({
      message: profileValidate.error.details[0].message,
    });
  }

  let findProfile = await ProfileModel.findOne({ userId: user_id });
  console.log(findProfile);
  console.log("i got befor findprofile");
  if (findProfile) {
    return res.status(400).json({
      message: `Profile  already exist`,
    });
  }
  let profileObject = req.body;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  profileObject = { ...profileObject, createdAt, updatedAt };

  const profileAccount = await ProfileModel.create({
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
    data: profileAccount,
  });
}

export async function updateProfile(req: customRequest, res: Response) {
  const user_id = req.user!._id;
  const { firstName, lastName, gender, role, location, about, profileImage } =
    req.body;
  console.log("update profile: ", req.user);
  let findProfile = await ProfileModel.findOne({ userId: user_id });
  console.log("profile Found:", findProfile);
  if (!findProfile) {
    return res.status(404).json({
      status: "failed",
      message: "Profile does not exist",
    });
  }

  let updatedProfile = await ProfileModel.findOneAndUpdate(
    { userId: user_id },
    {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      role: role,
      location: location,
      about: about,
      profileImage: profileImage,
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    data: updatedProfile,
  });
}
