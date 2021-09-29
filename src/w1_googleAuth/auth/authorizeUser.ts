import { Request, Response, NextFunction } from "express";

// authCheck middleware function
function authorizeUser(req: Request, res: Response, next: NextFunction) {
  console.log("Authorize User: ", req.user);
  if (!req.user) {
    return res.redirect("/w1-googlesso/login");
  }
  next();
}

export default authorizeUser;
