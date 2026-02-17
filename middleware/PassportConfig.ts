import passport from "passport";

import { PassportStrategy } from "../interfaces";

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
