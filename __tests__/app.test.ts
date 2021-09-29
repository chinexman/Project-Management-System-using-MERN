// import mongoose from "mongoose";
// import { MongoMemoryServer }  from "mongodb-memory-server";
// import request from "supertest";
// import dotenv from 'dotenv';
// dotenv.config()
// import app from "../src/app";
// import { Request, Response } from "express"
// import SignUp from "../src/w1_resetPassword_Auth/model/users"

// let mongoServer: MongoMemoryServer


// beforeAll(async() => {
//   mongoServer = await MongoMemoryServer.create()
//   const uri = mongoServer.getUri()
//   mongoose
//   .connect(uri)
//   .then(() => {
//     console.log('Connected Successfully.')
//   })
//   jest.setTimeout(10*1000)
// }, 10000)
// afterAll(async() => {
//   await mongoose.connection.dropDatabase()
//   await mongoose.connection.close()
//   await mongoServer.stop()
// })

// let token: string;


// ///////Test for password reset route
// // describe("Test for all user password reset route", () => {
//     //How to test a change apssword route
//     //i have to fire up the logn route so that a token is generated and assigned the user
    
//     //test for successful signup
//     // it("Successful creation of account", async () => {
//     //     const userInfo = {
//     //     name:"Sunday",
//     //     email: "sunday@gmail.com",
//     //     password: "123456738",
//     //     repeat_password:"123456738"
//     //     }

//     //     const response = await request(app)
//     //     .post("/users/password/signup")
//     //     .send(userInfo)
//     //     .set("Accept", "application/json")

//     //     expect(response.status).toBe(201)
//     //     expect(response.body.message).toBe("success")
//     // })
    
//     ///test for successful login
//     // it("Successful user login", async () => {
//     //     const loginDetails = {
//     //       email: "sunday@gmail.com",
//     //       password: "123456738"
//     //     }
  
//     //     const response = await request(app)
//     //     .post("/users/login")
//     //     .send(loginDetails)
//     //     .set("Accept", "application/json")
//     //     token = response.body.token
  
//     //     expect(response.status).toBe(200)
//     //     expect(response.body).toHaveProperty("message")
//     //     expect(response.body.message).toEqual(`Welcome back, Sunday`)//entering the catch block
//     //   })
    
    
    
//     // it("Wrong old password inputted", async () => {
//     //     const userInfo = {
//     //         name: "Eni-iyi",
//     //         email: "zwiller1000@gmail.com",
//     //         password: "123456676"
//     //     }

//     //     const passwordReset = {
//     //         oldPassword: "123456677",
//     //         newPassword: "123456666",
//     //         repeatPassword: "123456666"
//     //     }

//     //     const response = await request(app)
//     //     .post("users/password/changepassword")

//     // })
// // })


