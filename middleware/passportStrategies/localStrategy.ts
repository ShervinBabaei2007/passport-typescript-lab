import { database } from "../../models/userModel";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById } from "../../controllers/userController";
import { PassportStrategy } from "../../interfaces/index";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    // First check if email exists
    const userExists = database.find((user) => user.email === email);

    if (!userExists) {
      return done(null, false, {
        message: `Couldn't find the user with email: ${email}`,
      });
    }

    // Then check password
    if (userExists.password !== password) {
      return done(null, false, {
        message: "Incorrect password. Please try again.",
      });
    }

    // if both are correct
    return done(null, userExists);
  }
);

passport.serializeUser(function (user: any, done: (err: any, id?: unknown) => void) {
  done(null, user.id);
});

passport.deserializeUser(function (
  userId: any,
  done: (err: any, user?: Express.User | false | null) => void
) {
  const foundUser = getUserById(userId);
  if (foundUser) return done(null, foundUser);
  done(null, false);
});

const passportLocalStrategy: PassportStrategy = {
  name: "local",
  strategy: localStrategy,
};

export default passportLocalStrategy;
