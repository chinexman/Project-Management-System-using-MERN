import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
const _ = require("lodash")
import userSchema from '../middleware/validate'
const bcrypt = require('bcrypt')
import UserModel from '../model/user'
import sendMail from '../util/nodemailer'


export async function createUser(req: Request, res:Response) {

    try{
        const validation = userSchema.validate(req.body)
        if(validation.error) {
          return res.status(400).send(validation.error.details[0].message)
        }
        let {fullName, email, password} = req.body;
        
        const userObj = await UserModel.findOne({email: email})
            if(userObj) {
                return res.status(400).send("Email already exist");
        }
        const token = jwt.sign({fullName, email, password}, 'activateVerification', {expiresIn: '30m'})

         email = email
         const body = `
            <h2>
            Thank you for successfully signing up, click <a href="http://localhost:3800/auth/acctActivation/${token}">here</a> to activate your account
            </h2>
            `
            //<p>http://localhost:3000/auth/acctActivation/${token}</P>
            if(process.env.NODE_ENV != 'test'){
                sendMail(email, body)
            }
            res.status(201).json({msg: "Email has been sent, kindly activate your account."})           
               
        } catch(err) {
            console.log(err)
            res.status(400).send(`${err}`)
        }
    }

    export async function activateUserAcct(req: Request, res:Response) {

       try {
           const token = req.params.token
           console.log(token)
           if(token) {
               jwt.verify(token, 'activateVerification', async (err: any, decodedToken: any) => {
             if(err) {
                 res.status(400).json({error: "Incorrect or Expired link"})
                 return;
             }
             const {fullName, email, password} = decodedToken;
             const checkEmail = await UserModel.findOne({email})

             if(checkEmail) return res.status(400).json({msg: 'User with this email already exists'})
             const hashPassword = await bcrypt.hash(password, 10)
             const newUser = new UserModel({fullName, email, password: hashPassword});
             const user = await newUser.save()

             if(user) {
                 return res.status(201).json({user, msg: "New User created"})
             }
             res.status(400).json({success: false, msg: "Unable to activate user account"})
               } )
           }

       } catch(err) {
           res.status(400).json({msg: 'Something went wrong..'})
       }
    }
    
    // try{

    // const validation = userSchema.validate(req.body)
    // if(validation.error) {
    //   return res.send(validation.error.details[0].message)
    // }
    // const userObj = await UserModel.findOne({email: req.body.email})
    //     if(userObj) {
    //         return res.status(400).send("Email already exist");
    // }
    //     const hashPassword = await bcrypt.hash(req.body.password, 10)
    //     const user = new UserModel({
    //         fullName: req.body.fullName,
    //         //lastName: req.body.lastName,
    //         email: req.body.email,
    //         password: hashPassword,
    //         confirmPassword: req.body.password

    //     })
    //     const email = req.body.email
    //     const body = `
    //             <p>
    //                Thank you for successfully signing up, click <a href="#">here</a> to activate your account
    //             </p>
    //             `
    //     await user.save()
    //         sendMail(email, body)
    //         res.status(201).json({msg: "You have successfully signed up, Log into your mail to continue."}); 
    //         // res.status(201).json(_.pick(savedUser, ['_id', 'firstName', 'lastName', 'email']));            
           
    // } catch(err) {
    //     console.log(err)
    //     res.status(400).send(`${err}`)
    // }
