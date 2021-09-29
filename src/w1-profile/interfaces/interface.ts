import { JwtPayload } from "jsonwebtoken";
import {Request} from "express";


interface RequestInterface extends Request{
    user?: string | JwtPayload
}

interface UserInterface {
    email: string;
    password: string;
    name: string;
    createdAt: number
}

// interface RequestInterface {
//     cookies: {
//         token: string,
//     }
//     headers: {

// }

export {
    RequestInterface,
    UserInterface
}