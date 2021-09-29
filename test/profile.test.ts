import request from "supertest";
import app from "../src/app"
import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import userModel from "../src/w1-profile/models/usersModel";
let sendMail = require("../src/w1-profile/utils/nodeMailer").default;
import {connect , closeDatabase} from '../mongodb.handler'
import Profile from "../src/w1-profile/models/profileModel";


beforeAll(async () => await connect());

afterAll(async () => await closeDatabase());
let token: any

describe("run the level", () => {
    test('Should return 201 for profile created', async () => {
    
        const profile = await Profile.create({
          firstName: "chinedu emordi",
          email: "chineduemordi@gmail.com"
          
        })
        expect(profile.firstName).toBe("chinedu emordi");
      });
})


// describe("run the level", () => {
//     test('Should return 201 for profile created', async () => {

//         const user = {
//             email: "chineduemordi@gmail.com",
//             password: "bornagain"
//           }
//           await request(app)
//           .post('/w1-profiles/users/login')
//           .send(user)
//           .expect('Content-Type', 'application/json; charset=utf-8')
//           .expect(200)
//           .expect(res => {
//             token = res.body.token
//             expect(res.body.status).toBe("signed in successfully!")
//           })
    
//         // userModel.findOne = function(){
//         //     email : "chineduemordi@gmail.com";
//         // }

        
//         let mailSent = false;
//         sendMail = function (email:any,message:any){
//           mailSent = true;

//         }
//         expect(mailSent).toBe(true);
//       });
// })

