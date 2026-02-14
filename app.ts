import "dotenv/config";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import path from "path";
import passportMiddleware from "./middleware/passportMiddleware";

const port = process.env.port || 8000;

const app = express();

// in-memory session store
const sessionStore = new session.MemoryStore();
export { sessionStore };

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log((req.session as any).passport);
  next();
});

import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";
import adminRoute from "./routes/adminRoute";

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/admin", adminRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
