import * as PIXI from "pixi.js";

export default class PlayButton {
  public sprite: PIXI.Sprite;
  private callback: () => void;

  constructor(app: PIXI.Application, callback: () => void) {
    // Get texture from Assets.
    const texture = PIXI.Assets.get("play_button.png");
    this.sprite = new PIXI.Sprite(texture);
    // Position the button.
    this.sprite.x = app.screen.width - this.sprite.width - 20;
    this.sprite.y = app.screen.height - this.sprite.height - 20;
    // Enable interactivity and set the cursor to pointer.
    this.sprite.interactive = true;
    this.sprite.cursor = "pointer";
    this.callback = callback;
    this.sprite.on("pointerdown", this.onClick.bind(this));
  }

  private onClick(): void {
    if (this.callback) {
      this.callback();
    }
  }

  public setDisabled(): void {
    this.sprite.alpha = 0.5;
    this.sprite.interactive = false;
    this.sprite.cursor = "default";
  }

  public setEnabled(): void {
    this.sprite.alpha = 1;
    this.sprite.interactive = true;
    this.sprite.cursor = "pointer";
  }
}