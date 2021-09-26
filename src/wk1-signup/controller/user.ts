import { Request, Response } from "express";
const _ = require("lodash")
import userSchema from '../middleware/validate'
const bcrypt = require('bcrypt')
import UserModel from '../model/user'
import sendMail from '../util/nodemailer'
console.log('first')

export async function createUser(req: Request, res:Response) {
    
    try{

    const validation = userSchema.validate(req.body)
    if(validation.error) {
      return res.send(validation.error.details[0].message)
    }
    const userObj = await UserModel.findOne({email: req.body.email})
        if(userObj) {
            return res.status(400).send("Email already exist");
    }
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const user = new UserModel({
            fullName: req.body.fullName,
            //lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            confirmPassword: req.body.password

        })
        const email = req.body.email
        const body = `
                <p>
                   Thank you for successfully signing up, click <a href="#">here</a> to complete your sign up
                </p>
                `
                const savedUser = await user.save()
            sendMail(email, body)
            res.status(201).json({savedUser, msg: "You have successfully signed up, Log into your mail to continue." }); 
            // res.status(201).json(_.pick(savedUser, ['_id', 'firstName', 'lastName', 'email']));            
           
    } catch(err) {
        console.log(err)
        res.status(400).send(`${err}`)
    }
}
