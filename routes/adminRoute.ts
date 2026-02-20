import express from "express";
import { ensureAuthenticated } from "../middleware/checkAuth";
import { ensureAdmin } from "../middleware/checkRoles";
// import { sessionStore } from "../app";

const router = express.Router();

// Admin dashboard - shows all active sessions
router.get("/", ensureAuthenticated, ensureAdmin, (req, res) => {
  const sessions = (req.sessionStore as any).sessions || {};

  const sessionList = Object.keys(sessions).map((sessionId) => {
    const sessionData = sessions[sessionId];
    const userId = sessionData?.passport?.user;

    return {
      sessionId,
      userId,
      sessionData,
    };
  });

  res.render("admin", {
    user: req.user,
    sessions: sessionList,
  });
});

// Revoke a specific session
router.post("/revoke/:sessionId", ensureAuthenticated, ensureAdmin, (req, res) => {
  const sessionId = req.params.sessionId;

  req.sessionStore.destroy(sessionId, (err: any) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ success: false, message: "Error revoking session" });
    }

    console.log(`Session ${sessionId} has been revoked by admin ${req.user?.email}`);
    res.redirect("/admin");
  });
});

export default router;
