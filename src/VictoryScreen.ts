import * as PIXI from "pixi.js";

export default class VictoryScreen {
  public container: PIXI.Container;
  private messageText: PIXI.Text;

  constructor(app: PIXI.Application) {
    this.container = new PIXI.Container();
    // Create a semi-transparent overlay.
    const overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000, 0.7);
    overlay.drawRect(0, 0, app.screen.width, app.screen.height);
    overlay.endFill();
    this.container.addChild(overlay);

    // Create the victory message.
    this.messageText = new PIXI.Text("You Won!", { fontSize: 64, fill: "#f39c12" });
    this.messageText.anchor.set(0.5);
    this.messageText.x = app.screen.width / 2;
    this.messageText.y = app.screen.height / 2;
    this.container.addChild(this.messageText);

    // Hide the victory screen initially.
    this.container.visible = false;
  }

  public show(): void {
    this.container.visible = true;
    setTimeout(() => {
      this.container.visible = false;
    }, 2000);
  }
}