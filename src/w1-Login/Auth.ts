import express, {Request, Response, NextFunction} from "express"
function authorization(req:Request, res:Response, next:NextFunction) {
    if(!req.user){
        res.redirect("/")
    }else{
        next()
    }
}
export {authorization}