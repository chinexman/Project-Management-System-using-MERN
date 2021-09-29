import { Request, Response } from "express";

function homePage(req: Request, res: Response) {
  console.log(req.user);
  res.render("googleHomepage", { data: req.user });
}

function login(req: Request, res: Response) {
  res.render("loginPage");
}

function logout(req: Request, res: Response) {
  req.logout();
  res.redirect("/w1-googlesso/login");
}

function googleCallBackFn(req: Request, res: Response) {
  console.log(req.user);
  res.redirect("/w1-googlesso/profile");
}

export { homePage, login, logout, googleCallBackFn };
