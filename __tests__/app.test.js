"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let mongoServer;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mongoose_1.default
        .connect(uri)
        .then(() => {
        console.log('Connected Successfully.');
    });
    jest.setTimeout(10 * 1000);
}, 10000);
afterAll(async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    await mongoServer.stop();
});
let token;
///////Test for password reset route
// describe("Test for all user password reset route", () => {
//How to test a change apssword route
//i have to fire up the logn route so that a token is generated and assigned the user
//test for successful signup
// it("Successful creation of account", async () => {
//     const userInfo = {
//     name:"Sunday",
//     email: "sunday@gmail.com",
//     password: "123456738",
//     repeat_password:"123456738"
//     }
//     const response = await request(app)
//     .post("/users/password/signup")
//     .send(userInfo)
//     .set("Accept", "application/json")
//     expect(response.status).toBe(201)
//     expect(response.body.message).toBe("success")
// })
///test for successful login
// it("Successful user login", async () => {
//     const loginDetails = {
//       email: "sunday@gmail.com",
//       password: "123456738"
//     }
//     const response = await request(app)
//     .post("/users/login")
//     .send(loginDetails)
//     .set("Accept", "application/json")
//     token = response.body.token
//     expect(response.status).toBe(200)
//     expect(response.body).toHaveProperty("message")
//     expect(response.body.message).toEqual(`Welcome back, Sunday`)//entering the catch block
//   })
// it("Wrong old password inputted", async () => {
//     const userInfo = {
//         name: "Eni-iyi",
//         email: "zwiller1000@gmail.com",
//         password: "123456676"
//     }
//     const passwordReset = {
//         oldPassword: "123456677",
//         newPassword: "123456666",
//         repeatPassword: "123456666"
//     }
//     const response = await request(app)
//     .post("users/password/changepassword")
// })
// })
