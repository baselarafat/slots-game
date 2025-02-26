import * as PIXI from "pixi.js";
import { getRandomSymbol, SlotSymbol } from "./Symbols";

export class Reel {
  public container: PIXI.Container;
  private symbols: SlotSymbol[];
  private position: number;
  private speed: number;
  public targetSymbol: SlotSymbol;
  private isSpinning: boolean;
  private symbolTexts: PIXI.Text[];

  constructor(x: number, y: number, width: number, height: number) {
    this.container = new PIXI.Container();
    this.container.x = x;
    this.container.y = y;
    this.symbols = [];
    this.symbolTexts = [];
    this.position = 0;
    this.speed = 0;
    this.isSpinning = false;
    this.targetSymbol = SlotSymbol.Cherry;

    // Pre-fill the reel with random symbols.
    for (let i = 0; i < 20; i++) {
      this.symbols.push(getRandomSymbol());
    }
    // Create text objects to display a subset of symbols.
    for (let i = 0; i < 5; i++) {
      const text = new PIXI.Text(this.symbols[i], { fontSize: 40, fill: "#ffffff" });
      text.y = i * 50;
      text.x = width / 2;
      text.anchor.set(0.5, 0);
      this.symbolTexts.push(text);
      this.container.addChild(text);
    }
    // Create a mask so only part of the reel is visible.
    const mask = new PIXI.Graphics();
    mask.beginFill(0xFFFFFF);
    mask.drawRect(0, 0, width, height);
    mask.endFill();
    this.container.mask = mask;
    this.container.addChild(mask);
  }

  public startSpin(): void {
    this.isSpinning = true;
    this.speed = 20 + Math.random() * 10;
    this.targetSymbol = getRandomSymbol();
  }

  public stopSpin(): void {
    this.isSpinning = false;
    this.position = 0;
    // Ensure that the final symbol is our target.
    this.symbols[this.symbols.length - 1] = this.targetSymbol;
    this.updateDisplay();
  }

  public update(delta: number): void {
    if (this.isSpinning) {
      this.position += this.speed * delta;
      const symbolHeight = 50;
      if (this.position >= symbolHeight) {
        this.position -= symbolHeight;
        this.symbols.shift();
        this.symbols.push(getRandomSymbol());
        this.updateDisplay();
      }
      // Update positions of the text objects.
      for (let i = 0; i < this.symbolTexts.length; i++) {
        this.symbolTexts[i].y = i * symbolHeight - this.position;
      }
    }
  }

  private updateDisplay(): void {
    for (let i = 0; i < this.symbolTexts.length; i++) {
      this.symbolTexts[i].text = this.symbols[i];
    }
  }
}