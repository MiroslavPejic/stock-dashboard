export function calculateSMA(data, period) {
  if (data.length < period) {
    return null;
  }

  const recentData = data.slice(-period);

  const total = recentData.reduce(
    (sum, item) => sum + item.close,
    0
  );

  return total / period;
}

export function calculateRSI(data, period = 14) {
  if (data.length <= period) {
    return null;
  }

  const prices = data.map((item) => item.close);

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];

    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  let averageGain = gains / period;
  let averageLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];

    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    averageGain =
      (averageGain * (period - 1) + gain) / period;

    averageLoss =
      (averageLoss * (period - 1) + loss) / period;
  }

  if (averageLoss === 0) {
    return 100;
  }

  const relativeStrength = averageGain / averageLoss;

  return 100 - 100 / (1 + relativeStrength);
}