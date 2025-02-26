// Define symbols and weighted probabilities.
var SlotSymbol;
(function (SlotSymbol) {
    SlotSymbol["Cherry"] = "\uD83C\uDF52";
    SlotSymbol["Lemon"] = "\uD83C\uDF4B";
    SlotSymbol["Bell"] = "\uD83D\uDD14";
    SlotSymbol["Watermelon"] = "\uD83C\uDF49";
    SlotSymbol["Star"] = "\u2B50";
    SlotSymbol["Seven"] = "7\uFE0F\u20E3";
})(SlotSymbol || (SlotSymbol = {}));
var symbolProbabilities = [
    { symbol: SlotSymbol.Cherry, probability: 0.30 },
    { symbol: SlotSymbol.Lemon, probability: 0.30 },
    { symbol: SlotSymbol.Bell, probability: 0.15 },
    { symbol: SlotSymbol.Watermelon, probability: 0.10 },
    { symbol: SlotSymbol.Star, probability: 0.10 },
    { symbol: SlotSymbol.Seven, probability: 0.05 }
];
// Utility function to get a weighted random symbol.
function getRandomSymbol() {
    var randomValue = Math.random();
    var cumulativeProbability = 0;
    for (var _i = 0, symbolProbabilities_1 = symbolProbabilities; _i < symbolProbabilities_1.length; _i++) {
        var item = symbolProbabilities_1[_i];
        cumulativeProbability += item.probability;
        if (randomValue <= cumulativeProbability) {
            return item.symbol;
        }
    }
    return symbolProbabilities[symbolProbabilities.length - 1].symbol;
}
// A helper function to calculate payout based on reel results.
function calculatePayout(symbols) {
    // Example logic:
    // - 3 matching symbols => bigger payout depending on symbol
    // - 2 matching symbols => partial payout
    // - otherwise => 0
    var s1 = symbols[0], s2 = symbols[1], s3 = symbols[2];
    // Check for 3 of a kind
    if (s1 === s2 && s2 === s3) {
        switch (s1) {
            case SlotSymbol.Seven: return 100;
            case SlotSymbol.Star: return 50;
            case SlotSymbol.Bell: return 20;
            case SlotSymbol.Watermelon: return 15;
            default: return 10; // Cherry or Lemon
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
var Reel = /** @class */ (function () {
    function Reel() {
        this.symbols = [];
        // Pre-fill the reel with random symbols.
        for (var i = 0; i < 20; i++) {
            this.symbols.push(getRandomSymbol());
        }
        this.position = 0;
        this.speed = 0;
        this.targetSymbol = SlotSymbol.Cherry;
        this.isSpinning = false;
    }
    Reel.prototype.startSpin = function () {
        this.isSpinning = true;
        this.speed = 20 + Math.random() * 10; // Randomized spin speed.
        this.targetSymbol = getRandomSymbol();
    };
    Reel.prototype.stopSpin = function () {
        this.isSpinning = false;
        // Snap the reel to a boundary so symbols align.
        this.position = 0;
        // Replace the last symbol with our targetSymbol so it shows up when we stop.
        this.symbols[this.symbols.length - 1] = this.targetSymbol;
    };
    Reel.prototype.update = function () {
        if (this.isSpinning) {
            this.position += this.speed;
            var symbolHeight = 50; // Height in pixels for each symbol.
            if (this.position >= symbolHeight) {
                this.position -= symbolHeight;
                // Cycle the symbols by removing the first and adding a new one.
                this.symbols.shift();
                this.symbols.push(getRandomSymbol());
            }
        }
    };
    Reel.prototype.draw = function (ctx, x, y, width, height) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var symbolHeight = 50;
        // Draw visible symbols.
        for (var i = 0; i < this.symbols.length; i++) {
            var symbolY = y + (i * symbolHeight) - this.position;
            if (symbolY > y - symbolHeight && symbolY < y + height + symbolHeight) {
                ctx.fillText(this.symbols[i], x + width / 2, symbolY + symbolHeight / 2);
            }
        }
        ctx.restore();
    };
    return Reel;
}());
// Main SlotMachine class manages reels, animation, and game logic.
var SlotMachine = /** @class */ (function () {
    function SlotMachine(canvas) {
        this.canvas = canvas;
        var context = canvas.getContext("2d");
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
    SlotMachine.prototype.spin = function () {
        var _this = this;
        if (this.isSpinning)
            return; // Prevent concurrent spins.
        this.isSpinning = true;
        // Start each reel with a slight delay.
        this.reels.forEach(function (reel, index) {
            setTimeout(function () { return reel.startSpin(); }, index * 200);
        });
        // Stop reels sequentially.
        this.reels.forEach(function (reel, index) {
            setTimeout(function () {
                reel.stopSpin();
                // Once the last reel stops, evaluate the result.
                if (index === _this.reels.length - 1) {
                    _this.isSpinning = false;
                    _this.checkResult();
                }
            }, _this.spinDuration + index * 300);
        });
    };
    SlotMachine.prototype.checkResult = function () {
        // Collect the targetSymbol from each reel.
        var resultSymbols = this.reels.map(function (reel) { return reel.targetSymbol; });
        // Calculate payout for the combination.
        var payout = calculatePayout(resultSymbols);
        // Add to total score.
        this.totalScore += payout;
        // Update the UI message.
        var messageDiv = document.getElementById("message");
        if (messageDiv) {
            if (payout > 0) {
                messageDiv.textContent = "You won ".concat(payout, " credits! Total Score: ").concat(this.totalScore);
            }
            else {
                messageDiv.textContent = "No win this time. Total Score: ".concat(this.totalScore);
            }
        }
    };
    SlotMachine.prototype.animate = function () {
        var _this = this;
        // Clear and redraw the canvas on each animation frame.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var reelWidth = this.canvas.width / this.reels.length;
        var reelHeight = this.canvas.height;
        this.reels.forEach(function (reel, index) {
            reel.update();
            reel.draw(_this.ctx, index * reelWidth, 0, reelWidth, reelHeight);
        });
        requestAnimationFrame(this.animate);
    };
    return SlotMachine;
}());
// Initialize the game after the DOM loads.
document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("slotCanvas");
    var slotMachine = new SlotMachine(canvas);
    var spinButton = document.getElementById("spinButton");
    spinButton.addEventListener("click", function () {
        slotMachine.spin();
    });
});
