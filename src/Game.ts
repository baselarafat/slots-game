import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import Loader from "./Loader";
import Background from "./Background";
import PlayButton from "./PlayButton";
import ReelsContainer from "./ReelsContainer";
import { Scoreboard } from "./Scoreboard";
import VictoryScreen from "./VictoryScreen";
import { calculatePayout } from "./Symbols";

export default class Game {
  public app: PIXI.Application;
  private loader: Loader;
  private playButton!: PlayButton;
  private reelsContainer!: ReelsContainer;
  private scoreboard!: Scoreboard;
  private victoryScreen!: VictoryScreen;

  constructor() {
    // Create the PIXI application.
    this.app = new PIXI.Application({
      width: 960,
      height: 536,
      backgroundColor: 0x222222,
    });
    document.body.appendChild(this.app.view);
    this.loader = new Loader(this.app);
  }

  public async init(): Promise<void> {
    // Load all assets via your Loader.
    await this.loader.loadAssets();

    // Add sound assets using the recommended API.
    sound.add("spin", "spin_sound.mp3");
    sound.add("win", "win_sound.mp3");

    this.createScene();
    this.createPlayButton();
    this.createReels();
    this.createScoreboard();
    this.createVictoryScreen();
  }

  private createScene(): void {
    const bg = new Background();
    this.app.stage.addChild(bg.sprite);
  }

  private createPlayButton(): void {
    this.playButton = new PlayButton(this.app, this.handleStart.bind(this));
    this.app.stage.addChild(this.playButton.sprite);
  }

  private createReels(): void {
    this.reelsContainer = new ReelsContainer(this.app);
    this.reelsContainer.container.x = 0;
    this.reelsContainer.container.y = 100;
    this.app.stage.addChild(this.reelsContainer.container);
  }

  private createScoreboard(): void {
    this.scoreboard = new Scoreboard(this.app);
    this.app.stage.addChild(this.scoreboard.container);
  }

  private createVictoryScreen(): void {
    this.victoryScreen = new VictoryScreen(this.app);
    this.app.stage.addChild(this.victoryScreen.container);
  }

  private handleStart(): void {
    this.playButton.setDisabled();
    sound.play("spin");

    this.reelsContainer.spin().then(() => {
      const resultSymbols = this.reelsContainer.getResultSymbols();
      const payout = calculatePayout(resultSymbols);
      if (payout > 0) {
        sound.play("win");
        this.victoryScreen.show();
      }
      this.scoreboard.updateScore(payout);
      this.playButton.setEnabled();
    });
  }
}