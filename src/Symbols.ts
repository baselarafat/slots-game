export enum SlotSymbol {
    Cherry = "🍒",
    Lemon = "🍋",
    Bell = "🔔",
    Watermelon = "🍉",
    Star = "⭐",
    Seven = "7️⃣"
  }
  
  export interface SymbolProbability {
    symbol: SlotSymbol;
    probability: number;
  }
  
  export const symbolProbabilities: SymbolProbability[] = [
    { symbol: SlotSymbol.Cherry, probability: 0.30 },
    { symbol: SlotSymbol.Lemon, probability: 0.30 },
    { symbol: SlotSymbol.Bell, probability: 0.15 },
    { symbol: SlotSymbol.Watermelon, probability: 0.10 },
    { symbol: SlotSymbol.Star, probability: 0.10 },
    { symbol: SlotSymbol.Seven, probability: 0.05 }
  ];
  
  export function getRandomSymbol(): SlotSymbol {
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
  
  export function calculatePayout(symbols: SlotSymbol[]): number {
    const [s1, s2, s3] = symbols;
    // Three of a kind
    if (s1 === s2 && s2 === s3) {
      switch (s1) {
        case SlotSymbol.Seven:      return 100;
        case SlotSymbol.Star:       return 50;
        case SlotSymbol.Bell:       return 20;
        case SlotSymbol.Watermelon: return 15;
        default:                    return 10; // Cherry or Lemon
      }
    }
    // Two of a kind
    if (s1 === s2 || s2 === s3 || s1 === s3) {
      return 5;
    }
    // No match
    return 0;
  }