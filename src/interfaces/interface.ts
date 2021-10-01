import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

interface RequestInterface extends Request {
  user?: string | JwtPayload;
}

interface UserInterface {
  email: string;
  password: string;
  name: string;
  createdAt: number;
}

export { RequestInterface, UserInterface };
