import { Request, Response, NextFunction } from "express";
export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied!");
  }
  next();
};
