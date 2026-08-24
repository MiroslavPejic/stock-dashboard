const API_URL = "http://localhost:3001";

export async function getYahooHistory(symbol) {
  const response = await fetch(
    `${API_URL}/api/stocks/${symbol}`
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.message ||
        errorData.error ||
        "Failed to retrieve stock data"
    );
  }

  const data = await response.json();

  if (!data.history || data.history.length === 0) {
    throw new Error("No historical data found");
  }

  return data.history;
}