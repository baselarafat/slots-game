import express from 'express';
import cors from 'cors';

// Define symbols and weighted probabilities.
enum SlotSymbol {
  Cherry = "Cherry",
  Lemon = "Lemon",
  Bell = "Bell",
  Watermelon = "Watermelon",
  Star = "Star",
  Seven = "Seven"
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

// Utility to get a weighted random symbol.
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

// Determine payout based on symbol.
function determinePayout(symbol: SlotSymbol): number {
  switch (symbol) {
    case SlotSymbol.Seven:
      return 100;
    case SlotSymbol.Star:
      return 50;
    case SlotSymbol.Bell:
      return 20;
    case SlotSymbol.Watermelon:
      return 15;
    case SlotSymbol.Cherry:
    case SlotSymbol.Lemon:
      return 10;
    default:
      return 0;
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint for simulating RTP.
app.get('/simulate', (req, res) => {
  const numSpins = parseInt(req.query.spins as string) || 10000;
  let totalPayout = 0;
  let wins = 0;

  for (let i = 0; i < numSpins; i++) {
    // For simplicity, simulate one symbol per spin.
    const symbol = getRandomSymbol();
    const payout = determinePayout(symbol);
    totalPayout += payout;
    if (payout > 0) wins++;
  }

  const averagePayout = totalPayout / numSpins;
  res.json({
    spins: numSpins,
    totalPayout,
    averagePayout,
    wins
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RTP Simulator running on port ${PORT}`);
});