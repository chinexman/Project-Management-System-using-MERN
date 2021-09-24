import { Router, Request, Response } from "express";
const router = Router();

router.get("/", function (req: Request, res: Response) {
  res.send("Respond with a resource");
});

export default router;
