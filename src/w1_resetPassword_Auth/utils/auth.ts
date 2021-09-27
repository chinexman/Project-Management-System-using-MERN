import { Request, NextFunction, Response  } from "express";
import jwt from "jsonwebtoken";
// import Users from "../model/usersScema"
const secret: string = process.env.JWT_SECRET as string;
//replacing the req with the context function
export async function auth(req: any, res: any, next: NextFunction): Promise<void> {
    try {
        // console.log(req.headers, "headers")
        const token = req.headers.auth;
        if(!token) {
            return res.status(401).send({//replace with throw new error
                message: 'no token provided'
            })
        }
        const verified = jwt.verify(token, secret)//why is this line of code given us the user back
        if(!verified) {
            return res.status(401).send({
                message: 'invalid token provided'
            })
        }
        req.user = verified
        //the user object gets slammed or added to the request object on authorization
        
        next();
    }catch(err){
        res.status(401).send("User not logged In")
    }
}