import * as PIXI from "pixi.js";
import { Reel } from "./Reel";

export default class ReelsContainer {
  public container: PIXI.Container;
  private reels: Reel[];
  private reelWidth: number;
  private reelHeight: number;

  constructor(app: PIXI.Application) {
    this.container = new PIXI.Container();
    this.reels = [];
    this.reelWidth = app.screen.width / 3;
    this.reelHeight = 400;

    // Create three reels.
    for (let i = 0; i < 3; i++) {
      const reel = new Reel(i * this.reelWidth, 0, this.reelWidth, this.reelHeight);
      this.reels.push(reel);
      this.container.addChild(reel.container);
      // Register each reel's update with the app ticker.
      app.ticker.add((delta) => reel.update(delta));
    }
  }

  public spin(): Promise<void> {
    return new Promise((resolve) => {
      // Start spinning with staggered delays.
      this.reels.forEach((reel, index) => {
        setTimeout(() => reel.startSpin(), index * 200);
      });
      // Stop reels sequentially.
      this.reels.forEach((reel, index) => {
        setTimeout(() => {
          reel.stopSpin();
          if (index === this.reels.length - 1) {
            resolve();
          }
        }, 2000 + index * 300);
      });
    });
  }

  public getResultSymbols(): string[] {
    return this.reels.map(reel => reel.targetSymbol);
  }
}