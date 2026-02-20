import express from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = (req.session as any).messages || [];
  // Clearing messages after reading them
  (req.session as any).messages = [];
  res.render("login", { messages });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("login");
});

// github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

export default router;
