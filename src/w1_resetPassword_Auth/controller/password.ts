import  { Request, Response} from "express";
import SignUp from "../../wk1-signup/model/user";
import { generateJwtToken } from "../utils/generateToken";
import joi from "joi"
import bcrypt from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import sendMail from "../../wk1-signup/util/nodemailer"
// import EmailDomainValidator from "email-domain-validator";
// import { validate } from"email-domain-validator";


const secret: string = process.env.JWT_SECRETKEY as string;
// const days: string = process.env.JWT_EXPIRES_IN as string

// export async function signup (req: Request, res: Response): Promise<void> {
//     const registerSchema = joi
//     .object({
//         name: joi.string().trim().min(4).max(64).required(),
//         password: joi.string().required(),
//         repeat_password: joi.ref('password'),
//         email: joi
//         .string()
//         .trim()
//         .lowercase().required()
//     })
//     .with('password', 'repeat_password');///what does this line mean


//     try {
//         const validateInput = await registerSchema.validate(req.body, {
//             abortEarly: false,
//         });
//         //  console.log(validateInput.error)
//         if(validateInput.error){
//           // console.log("verify block")
//           // console.log(validateInput.error)
//             res.status(400).json({
//                 message: "Please verify the inputs provided"
//             })
//             return;
//         }

//         const newUser = await SignUp.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//         });

//         res.status(201).json({
//             message: 'success',
//             data: {
//                 newUser
//             }
//         })
        
//     console.log(req.body);
//     }catch(err: any){
//       console.log(err)
//       res.json({
//         mesg: err
//       })
//     }
// }

// export async function login(req: Request, res: Response): Promise<void> {
//     const { email, password } = req.body;
//     const loginSchema = joi.object({
//       password: joi.string().required(),
//       email: joi
//         .string()
//         .trim()
//         .lowercase()
//         .required()
//         // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
//     });
//     try {
//       const validationResult = await loginSchema.validate(req.body, {
//         abortEarly: false,
//       });
//       // console.log("validationResult.error",validationResult.error)
//       if (validationResult.error) {
//           // console.log("validation error")
//           res.status(400).json({
//           message: "Invalid login details",
//         });
//         return;
//       }
//       const user = await SignUp.findOne({ email });//it seems this is the line of code that beaks the code
//       // console.log("user-login", user)
  
//       if(user){
//         // console.log("user", user)
//         const validUser = await bcrypt.compare(password, user.password)//the syntax => incomingpassword, hashedpassword
//         // console.log("validUser", validUser)
//         if(validUser){
//           const token = generateJwtToken(user);
//         //   console.log(token);
//         //   user.tokens = user.tokens.concat({ token });
//           await user.save();
//           // res.cookie('jwt', token, { httpOnly: true });
//           // res.clearCookie()
//           // res.redirect('/loginusers');
//           res.status(200).json({
//             token: token,
//             message: `Welcome back, ${user.name}`
//           });
//           return;
//         }else{
//           // console.log("else block")
//           res.status(400).json({
//             message: `Wrong password provided`
//           });
  
//           return;
//         }
//       }else{
//         res.status(400).json({
//           message: 'Incorrect password or email'
//         });
//         return;
//       }
  
//     } catch (err: any) {
//       console.log("catch error")
//       console.log(err)
//       res.status(400).json({
//         message: `Invalid login details`
//       });
//       return;
//     }
//   }

type customRequest = {user?: any} & Request

export async function changePassword(req: customRequest , res: Response){
    const { oldPassword, newPassword, repeatPassword } = req.body

    //validation of all input fields
    const id = req.user._id

    try{
        const validUser = await bcrypt.compare( oldPassword, req.user.password)
        // console.log(validUser, "validUser")
        if(validUser){
            if(newPassword === repeatPassword){
                const newPasswordUpdate = await bcrypt.hash(newPassword, 12);
                const newUserInfo = await SignUp.findByIdAndUpdate({_id:id}, {password: newPassword}, {new: true})
                // console.log(newUserInfo, "newUserInfo")
                res.status(200).json({
                    newUserInfo
                })
                return ;
            }else{
              res.status(404).json({
                message: "Password and repeat password does not match"
            })
              return;
            }
        }
        else{
            res.status(404).json({
                message: "Incorrect password"
            })
            return;
        }
        return res.json(req.body)

    }
    catch(err: any){
        // console.log(err)
        res.status(400).json({
            error: err
        })
        return ;
    }
   
}


export async function forgetPassword(req: Request, res: Response){
  try{
    const { email } = req.body
    console.log(email)
    // const emailValidation: any = await validate(email)

    // if(emailValidation?.isValidDomain){
      const user = await SignUp.findOne({ email: email })
      console.log(user)
      // console.log(user)

      if(user){
        const token = jwt.sign({ id: user._id}, secret, { expiresIn: '30mins' });
        const link = `http://localhost:${process.env.PORT}/users/password/resetPassword/${token}`
        // console.log(link)
        // console.log(token)
        
        //the variables for the nodemailer
        
        const body = `
        Dear ${user.fullname},

        <p>Follow this <a href=${link}> link </a> to change your password. The link would expire in 30 mins.</P>
              `

        sendMail(email, body)///adding the title variable to the nodemailer

        res.status(200).json({
          message: "Link sent to your mail.",
          link: link
        })

      }else{
        res.status(400).json({
          message: "Email not found."
        })
        return ;
      }
    
    // }else{
    //   res.status(400).json({
    //     message: "Invalid email provided."
    //   })
    //   return ;
    // }
  }catch(err){
    console.log(err)
    res.status(404).json({
      message: "Route crashed"
   })
  }

}

export async function verifyResetPassword(req: Request, res: Response){
  
    let { token } = req.params
    console.log(token, "token-verify")
    const verification = await jwt.verify(token, secret) as JwtPayload///verification
    console.log(verification, "verification")
    const id = verification.id
    const isValidId = await SignUp.findOne({_id: id})
    try{
      if(isValidId){
        //line missing?
        token = jwt.sign({id: id}, secret, { expiresIn: '1d' })
        res.render("reset-password", { title: "Reset-Password",
      token: token})
      }
    }catch(err){
      res.json({
        message: err
      })
    }

}


export async function resetPassword (req: Request, res: Response){
  const { token } = req.params
  console.log(token, "token-reset")
  try{ 
    // res.json(req.params)
    const verification = await jwt.verify(token, secret) as JwtPayload///verification
    console.log(verification, "verification-reset")
    const id = verification.id
    if(verification){
      const user = await SignUp.findOne({ _id: id })
        if(user){
          let { newPassword, repeatPassword } = req.body
          if( newPassword === repeatPassword){
            newPassword = await bcrypt.hash(newPassword, 12);
            const updatedUser = await SignUp.findOneAndUpdate({ _id: id }, {password: newPassword}, {new: true})
            res.status(400).json({
              updatedUser: updatedUser
            })
            return ;

          }else{
            res.status(400).json({
              message: "newpassword and repeatpassword don't match"
            })
            return ;
          }

        }else{
          res.status(400).json({
            message: "user does not exist"
          })
          return ;
        }
      }
      else{
      res.status(400).json({
          message: "verification error"
      })
        return ;
    }
  }catch(err: any){
    res.status(400).json({
      message: "This is the catch block message",
      // message: "Catch block",
      error: err.message
    })
    return ;
  }
}


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
