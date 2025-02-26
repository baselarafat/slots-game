import * as PIXI from "pixi.js";

export default class Loader {
  private app: PIXI.Application;
  
  constructor(app: PIXI.Application) {
    this.app = app;
  }

  public async loadAssets(): Promise<void> {
    // Initialize Assets with a basePath (adjust if needed)
    await PIXI.Assets.init({ basePath: "assets" });
    // Load the required assets. In v8 you pass the file names (relative to basePath).
    await PIXI.Assets.load([
      "background.png",
      "play_button.png",
      "spin_sound.mp3",
      "win_sound.mp3"
    ]);
  }
}