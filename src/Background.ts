import * as PIXI from "pixi.js";

export default class Background {
  public sprite: PIXI.Sprite;

  constructor() {
    // Use the new Assets API to get the texture.
    const texture = PIXI.Assets.get("background.png");
    this.sprite = new PIXI.Sprite(texture);
    // Set dimensions to cover the app screen.
    this.sprite.width = 960;
    this.sprite.height = 536;
  }
}