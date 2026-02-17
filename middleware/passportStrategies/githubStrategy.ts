import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: "http://localhost:8000/auth/github/callback",
  },
  function (accessToken: any, refreshToken: any, profile: any, done: any) {
    // creates object for user from Github and authenticates it
    const user = {
      id: parseInt(profile.id),
      name: profile.displayName || profile.username || "GitHub User",
      email: profile.emails?.[0]?.value || "",
      password: "",
      role: "user" as const,
    };
    return done(null, user);
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;
