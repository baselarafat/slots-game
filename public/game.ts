// Define symbols and weighted probabilities.
enum SlotSymbol {
  Cherry = "🍒",
  Lemon = "🍋",
  Bell = "🔔",
  Watermelon = "🍉",
  Star = "⭐",
  Seven = "7️⃣"
}

interface SymbolProbability {
  symbol: SlotSymbol;
  probability: number;
}

const symbolProbabilities: SymbolProbability[] = [
  { symbol: SlotSymbol.Cherry, probability: 0.30 },
  { symbol: SlotSymbol.Lemon, probability: 0.30 },
  { symbol: SlotSymbol.Bell, probability: 0.15 },
  { symbol: SlotSymbol.Watermelon, probability: 0.10 },
  { symbol: SlotSymbol.Star, probability: 0.10 },
  { symbol: SlotSymbol.Seven, probability: 0.05 }
];

// Utility function to get a weighted random symbol.
function getRandomSymbol(): SlotSymbol {
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  for (const item of symbolProbabilities) {
    cumulativeProbability += item.probability;
    if (randomValue <= cumulativeProbability) {
      return item.symbol;
    }
  }
  return symbolProbabilities[symbolProbabilities.length - 1].symbol;
}

// A helper function to calculate payout based on reel results.
function calculatePayout(symbols: SlotSymbol[]): number {
  // Example logic:
  // - 3 matching symbols => bigger payout depending on symbol
  // - 2 matching symbols => partial payout
  // - otherwise => 0
  const [s1, s2, s3] = symbols;

  // Check for 3 of a kind
  if (s1 === s2 && s2 === s3) {
    switch (s1) {
      case SlotSymbol.Seven:      return 100;
      case SlotSymbol.Star:       return 50;
      case SlotSymbol.Bell:       return 20;
      case SlotSymbol.Watermelon: return 15;
      default:                    return 10; // Cherry or Lemon
    }
  }

  // Check for 2 of a kind
  if (s1 === s2 || s2 === s3 || s1 === s3) {
    return 5; // Partial payout for any pair
  }

  // No matches
  return 0;
}

// Class representing a single reel.
class Reel {
  symbols: SlotSymbol[];
  position: number; // Vertical offset for animation.
  speed: number;    // Speed of spinning in pixels per frame.
  targetSymbol: SlotSymbol;
  isSpinning: boolean;

  constructor() {
    this.symbols = [];
    // Pre-fill the reel with random symbols.
    for (let i = 0; i < 20; i++) {
      this.symbols.push(getRandomSymbol());
    }
    this.position = 0;
    this.speed = 0;
    this.targetSymbol = SlotSymbol.Cherry;
    this.isSpinning = false;
  }

  startSpin() {
    this.isSpinning = true;
    this.speed = 20 + Math.random() * 10; // Randomized spin speed.
    this.targetSymbol = getRandomSymbol();
  }

  stopSpin() {
    this.isSpinning = false;
    // Snap the reel to a boundary so symbols align.
    this.position = 0;
    // Replace the last symbol with our targetSymbol so it shows up when we stop.
    this.symbols[this.symbols.length - 1] = this.targetSymbol;
  }

  update() {
    if (this.isSpinning) {
      this.position += this.speed;
      const symbolHeight = 50; // Height in pixels for each symbol.
      if (this.position >= symbolHeight) {
        this.position -= symbolHeight;
        // Cycle the symbols by removing the first and adding a new one.
        this.symbols.shift();
        this.symbols.push(getRandomSymbol());
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const symbolHeight = 50;
    // Draw visible symbols.
    for (let i = 0; i < this.symbols.length; i++) {
      const symbolY = y + (i * symbolHeight) - this.position;
      if (symbolY > y - symbolHeight && symbolY < y + height + symbolHeight) {
        ctx.fillText(this.symbols[i], x + width / 2, symbolY + symbolHeight / 2);
      }
    }
    ctx.restore();
  }
}

// Main SlotMachine class manages reels, animation, and game logic.
class SlotMachine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  reels: Reel[];
  isSpinning: boolean;
  spinDuration: number; // Base duration for spinning in milliseconds.
  totalScore: number;   // Keep track of accumulated winnings.

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas not supported");
    }
    this.ctx = context;

    // Create three reels.
    this.reels = [new Reel(), new Reel(), new Reel()];
    this.isSpinning = false;
    this.spinDuration = 2000;
    this.totalScore = 0;

    // Bind and start the animation loop.
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  spin() {
    if (this.isSpinning) return; // Prevent concurrent spins.
    this.isSpinning = true;

    // Start each reel with a slight delay.
    this.reels.forEach((reel, index) => {
      setTimeout(() => reel.startSpin(), index * 200);
    });

    // Stop reels sequentially.
    this.reels.forEach((reel, index) => {
      setTimeout(() => {
        reel.stopSpin();
        // Once the last reel stops, evaluate the result.
        if (index === this.reels.length - 1) {
          this.isSpinning = false;
          this.checkResult();
        }
      }, this.spinDuration + index * 300);
    });
  }

  checkResult() {
    // Collect the targetSymbol from each reel.
    const resultSymbols = this.reels.map(reel => reel.targetSymbol);
    // Calculate payout for the combination.
    const payout = calculatePayout(resultSymbols);
    // Add to total score.
    this.totalScore += payout;

    // Update the UI message.
    const messageDiv = document.getElementById("message");
    if (messageDiv) {
      if (payout > 0) {
        messageDiv.textContent = `You won ${payout} credits! Total Score: ${this.totalScore}`;
      } else {
        messageDiv.textContent = `No win this time. Total Score: ${this.totalScore}`;
      }
    }
  }

  animate() {
    // Clear and redraw the canvas on each animation frame.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const reelWidth = this.canvas.width / this.reels.length;
    const reelHeight = this.canvas.height;

    this.reels.forEach((reel, index) => {
      reel.update();
      reel.draw(this.ctx, index * reelWidth, 0, reelWidth, reelHeight);
    });

    requestAnimationFrame(this.animate);
  }
}

// Initialize the game after the DOM loads.
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("slotCanvas") as HTMLCanvasElement;
  const slotMachine = new SlotMachine(canvas);

  const spinButton = document.getElementById("spinButton") as HTMLButtonElement;
  spinButton.addEventListener("click", () => {
    slotMachine.spin();
  });
});