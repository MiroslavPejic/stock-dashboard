const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

const BASE_URL = "https://www.alphavantage.co/query";

async function fetchAlphaVantage(params) {
  const searchParams = new URLSearchParams({
    ...params,
    apikey: API_KEY,
  });

  const response = await fetch(`${BASE_URL}?${searchParams}`);

  if (!response.ok) {
    throw new Error("Failed to connect to Alpha Vantage");
  }

  const data = await response.json();

  if (data["Error Message"]) {
    throw new Error(data["Error Message"]);
  }

  if (data["Note"]) {
    throw new Error(data["Note"]);
  }

  if (data["Information"]) {
    throw new Error(data["Information"]);
  }

  return data;
}

export async function getDailyHistory(symbol) {
  const data = await fetchAlphaVantage({
    function: "TIME_SERIES_DAILY",
    symbol,
    outputsize: "compact",
  });

  const timeSeries = data["Time Series (Daily)"];

  if (!timeSeries) {
    throw new Error("No historical data was returned");
  }

  return Object.entries(timeSeries)
    .map(([date, values]) => ({
      date,
      open: Number(values["1. open"]),
      high: Number(values["2. high"]),
      low: Number(values["3. low"]),
      close: Number(values["4. close"]),
      volume: Number(values["5. volume"]),
    }))
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );
}