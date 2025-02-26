import { Container, Text, TextStyle, Application } from "pixi.js";
import * as PIXI from "pixi.js";

export class Scoreboard {
  public container: Container;
  private score: number;
  private scoreText: Text;

  constructor(app: PIXI.Application) {
    this.container = new Container();
    this.score = 0;

    // Create a TextStyle instance instead of passing a plain object.
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fill: "#ffffff"
    });

    this.scoreText = new Text(`Score: ${this.score}`, style);
    this.scoreText.x = 20;
    this.scoreText.y = 20;
    this.container.addChild(this.scoreText);
  }

  public updateScore(amount: number): void {
    this.score += amount;
    this.scoreText.text = `Score: ${this.score}`;
  }

  public getScore(): number {
    return this.score;
  }
}