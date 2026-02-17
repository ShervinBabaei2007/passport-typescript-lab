import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { database } from "../../models/userModel";

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: "http://localhost:8000/auth/github/callback",
  },
  function (accessToken: any, refreshToken: any, profile: any, done: any) {
    let user = database.find((user) => user.id === Number(profile.id)) || null;

    if (!user) {
      console.log("New GitHub user - creating...");
      user = {
        id: Number(profile.id),
        name: profile.displayName || profile.username || "GitHub User",
        email: profile.emails?.[0]?.value || "",
        password: "",
        role: "user" as const,
      };
      database.push(user);
    } else {
      console.log("Existing GitHub user found:", user.name);
    }

    done(null, user);
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;
