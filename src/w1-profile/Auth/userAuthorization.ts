import jwt from "jsonwebtoken";
import express, { Response, NextFunction } from "express";
import { RequestInterface } from "../interfaces/interface";

function userAuthorization(
  req: RequestInterface,
  res: Response,
  next: NextFunction
) {
  const jwtToken = req.cookies.token || req.headers.token;
  if (!jwtToken) {
    return res.status(401).json({
      status: "Unauthorized user",
      message: "you are not Sign in",
    });
  }
  try {
    const userAuthorization = jwt.verify(
      jwtToken.toString(),
      process.env.SECRET_KEY as string
    );
    req.user = userAuthorization;
    next();
  } catch (err) {
    res.status(401).json({
      status: "Failed",
      message: "Invalid token",
    });
  }
}

export default userAuthorization;
