import express, { Request, Response, NextFunction } from "express";
import UserModel from "../models/user";
function authorization(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.json({ msg: "You're not logged in, please login." });
  } else {
    next();
  }
}
export { authorization };
