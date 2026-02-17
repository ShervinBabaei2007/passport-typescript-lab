import { Request, Response, NextFunction } from "express";
// We needs to import Request, Response, and NextFunction so TypeScript knows the types of those parameters at compile time, so it can read the code before running it first.
export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied!");
  }
  next();
};
