"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetPassword = exports.forgetPassword = exports.changePassword = exports.login = exports.signup = void 0;
const users_1 = __importDefault(require("../model/users"));
const generateToken_1 = require("../utils/generateToken");
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const secret = process.env.JWT_SECRET;
// const days: string = process.env.JWT_EXPIRES_IN as string
async function signup(req, res) {
    const registerSchema = joi_1.default
        .object({
        name: joi_1.default.string().trim().min(4).max(64).required(),
        password: joi_1.default.string().required(),
        repeat_password: joi_1.default.ref('password'),
        email: joi_1.default
            .string()
            .trim()
            .lowercase().required()
    })
        .with('password', 'repeat_password'); ///what does this line mean
    try {
        const validateInput = await registerSchema.validate(req.body, {
            abortEarly: false,
        });
        //  console.log(validateInput.error)
        if (validateInput.error) {
            // console.log("verify block")
            // console.log(validateInput.error)
            res.status(400).json({
                message: "Please verify the inputs provided"
            });
            return;
        }
        const newUser = await users_1.default.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        res.status(201).json({
            message: 'success',
            data: {
                newUser
            }
        });
        console.log(req.body);
    }
    catch (err) {
        console.log(err);
        res.json({
            mesg: err
        });
    }
}
exports.signup = signup;
async function login(req, res) {
    const { email, password } = req.body;
    const loginSchema = joi_1.default.object({
        password: joi_1.default.string().required(),
        email: joi_1.default
            .string()
            .trim()
            .lowercase()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
    });
    try {
        const validationResult = await loginSchema.validate(req.body, {
            abortEarly: false,
        });
        // console.log("validationResult.error",validationResult.error)
        if (validationResult.error) {
            // console.log("validation error")
            res.status(400).json({
                message: "Invalid login details",
            });
            return;
        }
        const user = await users_1.default.findOne({ email }); //it seems this is the line of code that beaks the code
        // console.log("user-login", user)
        if (user) {
            // console.log("user", user)
            const validUser = await bcryptjs_1.default.compare(password, user.password); //the syntax => incomingpassword, hashedpassword
            // console.log("validUser", validUser)
            if (validUser) {
                const token = (0, generateToken_1.signToken)(user);
                //   console.log(token);
                //   user.tokens = user.tokens.concat({ token });
                await user.save();
                // res.cookie('jwt', token, { httpOnly: true });
                // res.clearCookie()
                // res.redirect('/loginusers');
                res.status(200).json({
                    token: token,
                    message: `Welcome back, ${user.name}`
                });
                return;
            }
            else {
                // console.log("else block")
                res.status(400).json({
                    message: `Wrong password provided`
                });
                return;
            }
        }
        else {
            res.status(400).json({
                message: 'Incorrect password or email'
            });
            return;
        }
    }
    catch (err) {
        console.log("catch error");
        console.log(err);
        res.status(400).json({
            message: `Invalid login details`
        });
        return;
    }
}
exports.login = login;
async function changePassword(req, res) {
    var _a;
    const user = req.user;
    const { oldPassword, newPassword, repeatPassword } = req.body;
    //validation of all input fields
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const validUser = await bcryptjs_1.default.compare(oldPassword, req.user.password);
        // console.log(validUser, "validUser")
        if (validUser) {
            if (newPassword === repeatPassword) {
                const newPasswordUpdate = await bcryptjs_1.default.hash(newPassword, 12);
                const newUserInfo = await users_1.default.findByIdAndUpdate({ _id: id }, { password: newPassword }, { new: true });
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
                message: "Wrong Old password"
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
        const user = await users_1.default.findOne({ email: email });
        console.log(user);
        // console.log(user)
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, secret, { expiresIn: '30mins' });
            const link = `http://localhost:5009/users/password/resetPassword/${token}`;
            // console.log(link)
            // console.log(token)
            //the variables for the nodemailer
            const body = `
      Dear ${user.fullname},

      <p>Follow this <a href=${link}> link </a> to change your password. The link would expire in 30 mins.</P>
            `;
            (0, nodemailer_1.default)(email, body);
            res.status(200).json({
                message: "Link sent to your mail.",
                link: link
            });
        }
        else {
            res.status(400).json({
                message: "Wrong email provided"
            });
            return;
        }
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
    const isValidId = users_1.default.findOne({ _id: id });
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
            const user = await users_1.default.findOne({ _id: id });
            if (user) {
                let { newPassword, repeatPassword } = req.body;
                if (newPassword === repeatPassword) {
                    newPassword = await bcryptjs_1.default.hash(newPassword, 12);
                    const updatedUser = await users_1.default.findOneAndUpdate({ _id: id }, { password: newPassword }, { new: true });
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
