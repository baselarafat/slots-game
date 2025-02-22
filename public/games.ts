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
      // End the spin and simulate aligning to the target symbol.
      this.isSpinning = false;
      // For demonstration, push the target symbol into the reel.
      this.symbols.push(this.targetSymbol);
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
          if (index === this.reels.length - 1) {
            this.isSpinning = false;
            this.checkResult();
          }
        }, this.spinDuration + index * 300);
      });
    }
  
    checkResult() {
      // Check if all reels stopped on the same target symbol.
      const resultSymbols = this.reels.map(reel => reel.targetSymbol);
      const win = resultSymbols.every(s => s === resultSymbols[0]);
      const messageDiv = document.getElementById("message");
      if (messageDiv) {
        messageDiv.textContent = win ? "Jackpot! You win!" : "Try Again!";
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