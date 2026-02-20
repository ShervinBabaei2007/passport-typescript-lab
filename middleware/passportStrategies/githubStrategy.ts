import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { database, User } from "../../models/userModel";

console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: "http://localhost:8000/auth/github/callback",
  },
  function (accessToken: any, refreshToken: any, profile: any, done: any) {
    const foundUser = database.find((user) => user.id === profile.id);
    if (foundUser) {
      done(null, foundUser);
    } else {
      const user: User = {
        id: parseInt(profile.id),
        name: profile.displayName || profile.username || "GitHub User",
        email: profile.emails?.[0]?.value || "",
        password: "",
        role: "user",
      };
      database.push(user);
      return done(null, user);
    }
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;
