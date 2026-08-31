const API_URL =
  import.meta.env.VITE_STOCK_API_URL ||
  "http://localhost:3001";


function buildApiUrl(symbol) {
  const baseUrl = API_URL.replace(/\/$/, "");
  const query = new URLSearchParams({
    symbol,
  });

  return `${baseUrl}/api/stocks/${symbol}?${query}`;
}


function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}


function normalizeApiPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  /*
   * If API Gateway is configured with non-proxy integration,
   * the Lambda proxy-style object may be forwarded as JSON.
   */
  if (
    "statusCode" in payload &&
    "body" in payload
  ) {
    const nested =
      typeof payload.body === "string"
        ? tryParseJson(payload.body)
        : payload.body;

    return {
      __statusCode: payload.statusCode,
      ...nested,
    };
  }

  return payload;
}

export async function getYahooHistory(symbol) {
  const ticker = symbol.trim().toUpperCase();

  const response = await fetch(
    buildApiUrl(ticker)
  );

  const rawData = await response.json();

  const data = normalizeApiPayload(rawData);

  const effectiveStatus =
    data?.__statusCode || response.status;

  if (effectiveStatus < 200 || effectiveStatus >= 300) {

    throw new Error(
      data?.message ||
        data?.error ||
        "Failed to retrieve stock data"
    );
  }

  if (!data.history || data.history.length === 0) {
    throw new Error("No historical data found");
  }

  return data.history;
}