import passport from "passport";

import { PassportStrategy } from "../interfaces";
// ! declare global = "I'm about to tell TypeScript about types that exist everywhere in the app"
// ! namespace Express = "I'm specifically talking about Express's types"
// ! and then it extends the express to be able to use the interface for User
declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      password: string;
      role: "admin" | "user";
    }
  }
}

export default class PassportConfig {
  private readonly strategies: PassportStrategy[];

  constructor(strategies: PassportStrategy[]) {
    this.strategies = strategies;
    this.addStrategies();
  }

  private addStrategies(): void {
    this.strategies.forEach((passportStrategy: PassportStrategy) => {
      passport.use(passportStrategy.name, passportStrategy.strategy);
    });
  }
}
