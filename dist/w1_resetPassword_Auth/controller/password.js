"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetPassword = exports.forgetPassword = exports.changePassword = void 0;
const user_1 = __importDefault(require("../../wk1-signup/model/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("../../wk1-signup/util/nodemailer"));
// import EmailDomainValidator from "email-domain-validator";
// import { validate } from"email-domain-validator";
const secret = process.env.JWT_SECRETKEY;
async function changePassword(req, res) {
    const { oldPassword, newPassword, repeatPassword } = req.body;
    //validation of all input fields
    const id = req.user._id;
    try {
        const validUser = await bcryptjs_1.default.compare(oldPassword, req.user.password);
        // console.log(validUser, "validUser")
        if (validUser) {
            if (newPassword === repeatPassword) {
                const newPasswordUpdate = await bcryptjs_1.default.hash(newPassword, 12);
                const newUserInfo = await user_1.default.findByIdAndUpdate({ _id: id }, { password: newPassword }, { new: true });
                // console.log(newUserInfo, "newUserInfo")
                res.status(200).json({
                    newUserInfo
                });
                return;
            }
            else {
                res.status(404).json({
                    message: "Password and repeat password does not match"
                });
                return;
            }
        }
        else {
            res.status(404).json({
                message: "Incorrect password"
            });
            return;
        }
        return res.json(req.body);
    }
    catch (err) {
        // console.log(err)
        res.status(400).json({
            error: err
        });
        return;
    }
}
exports.changePassword = changePassword;
async function forgetPassword(req, res) {
    try {
        const { email } = req.body;
        console.log(email);
        // const emailValidation: any = await validate(email)
        // if(emailValidation?.isValidDomain){
        const user = await user_1.default.findOne({ email: email });
        console.log(user);
        // console.log(user)
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, secret, { expiresIn: '30mins' });
            const link = `http://localhost:${process.env.PORT}/users/password/resetPassword/${token}`;
            // console.log(link)
            // console.log(token)
            //the variables for the nodemailer
            const body = `
        Dear ${user.fullname},

        <p>Follow this <a href=${link}> link </a> to change your password. The link would expire in 30 mins.</P>
              `;
            (0, nodemailer_1.default)(email, body); ///adding the title variable to the nodemailer
            res.status(200).json({
                message: "Link sent to your mail.",
                link: link
            });
        }
        else {
            res.status(400).json({
                message: "Email not found."
            });
            return;
        }
        // }else{
        //   res.status(400).json({
        //     message: "Invalid email provided."
        //   })
        //   return ;
        // }
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            message: "Route crashed"
        });
    }
}
exports.forgetPassword = forgetPassword;
async function verifyResetPassword(req, res) {
    let { token } = req.params;
    console.log(token, "token-verify");
    const verification = await jsonwebtoken_1.default.verify(token, secret); ///verification
    console.log(verification, "verification");
    const id = verification.id;
    const isValidId = await user_1.default.findOne({ _id: id });
    try {
        if (isValidId) {
            //line missing?
            token = jsonwebtoken_1.default.sign({ id: id }, secret, { expiresIn: '1d' });
            res.render("reset-password", { title: "Reset-Password",
                token: token });
        }
    }
    catch (err) {
        res.json({
            message: err
        });
    }
}
exports.verifyResetPassword = verifyResetPassword;
async function resetPassword(req, res) {
    const { token } = req.params;
    console.log(token, "token-reset");
    try {
        // res.json(req.params)
        const verification = await jsonwebtoken_1.default.verify(token, secret); ///verification
        console.log(verification, "verification-reset");
        const id = verification.id;
        if (verification) {
            const user = await user_1.default.findOne({ _id: id });
            if (user) {
                let { newPassword, repeatPassword } = req.body;
                if (newPassword === repeatPassword) {
                    newPassword = await bcryptjs_1.default.hash(newPassword, 12);
                    const updatedUser = await user_1.default.findOneAndUpdate({ _id: id }, { password: newPassword }, { new: true });
                    res.status(400).json({
                        updatedUser: updatedUser
                    });
                    return;
                }
                else {
                    res.status(400).json({
                        message: "newpassword and repeatpassword don't match"
                    });
                    return;
                }
            }
            else {
                res.status(400).json({
                    message: "user does not exist"
                });
                return;
            }
        }
        else {
            res.status(400).json({
                message: "verification error"
            });
            return;
        }
    }
    catch (err) {
        res.status(400).json({
            message: "This is the catch block message",
            // message: "Catch block",
            error: err.message
        });
        return;
    }
}
exports.resetPassword = resetPassword;
// export async function resetPassword (req: Request, res: Response){
//   try{ 
//     // res.json(req.params)
//     const { token } = req.params
//     console.log(token, "token")
//     const verification = await jwt.verify(token, secret) as JwtPayload///verification
//     console.log(verification, "verification")
//     const id = verification.id
//     if(verification){
//       const user = await SignUp.findOne({ _id: id })
//         if(user){
//           let { newPassword, repeatPassword } = req.body
//           if( newPassword === repeatPassword){
//             newPassword = await bcrypt.hash(newPassword, 12);
//             const updatedUser = await SignUp.findOneAndUpdate({ _id: id }, {password: newPassword}, {new: true})
//             res.status(400).json({
//               updatedUser: updatedUser
//             })
//             return ;
//           }else{
//             res.status(400).json({
//               message: "newpassword and repeatpassword don't match"
//             })
//             return ;
//           }
//         }else{
//           res.status(400).json({
//             message: "user does not exist"
//           })
//           return ;
//         }
//       }
//       else{
//       res.status(400).json({
//           message: verification
//       })
//         return ;
//     }
//   }catch(err: any){
//     res.status(400).json({
//       message: "Catch block",
//       error: err?.message
//     })
//     return ;
//   }
// }
// export async function resetPassword(req: Request, res: Response){
//   const { oldPassword, newPassword, repeatPassword } = req.body
// }
