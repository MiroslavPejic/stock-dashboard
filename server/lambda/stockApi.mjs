let yahooFinanceClient;

async function getYahooFinanceClient() {
  if (yahooFinanceClient) {
    return yahooFinanceClient;
  }

  const module = await import("yahoo-finance2");
  const YahooFinance = module.default;

  yahooFinanceClient = new YahooFinance();

  return yahooFinanceClient;
}

const JSON_HEADERS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,OPTIONS",
  "access-control-allow-headers": "content-type,authorization",
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  };
}

function normalizeSymbol(event) {
  const pathParameters = event?.pathParameters;

  if (pathParameters && typeof pathParameters === "object") {
    const values = Object.values(pathParameters);

    for (const value of values) {
      if (typeof value !== "string") {
        continue;
      }

      const candidate = value
        .split("/")
        .filter(Boolean)
        .pop();

      if (candidate) {
        return decodeURIComponent(candidate)
          .trim()
          .toUpperCase();
      }
    }
  }

  const querySymbol = event?.queryStringParameters?.symbol;

  if (querySymbol) {
    return querySymbol.trim().toUpperCase();
  }

  const rawQueryString = event?.rawQueryString || "";

  if (rawQueryString) {
    const searchParams = new URLSearchParams(rawQueryString);
    const fromRawQuery = searchParams.get("symbol");

    if (fromRawQuery) {
      return fromRawQuery.trim().toUpperCase();
    }
  }

  /*
   * Some API Gateway integrations do not populate
   * pathParameters, but still include the raw URL path.
   */
  const rawPath =
    event?.rawPath ||
    event?.path ||
    event?.requestContext?.http?.path ||
    event?.requestContext?.path ||
    "";

  if (rawPath) {
    const segments = rawPath
      .split("/")
      .filter(Boolean);

    const lastSegment =
      segments[segments.length - 1];

    if (
      lastSegment &&
      lastSegment.toLowerCase() !== "stocks" &&
      lastSegment.toLowerCase() !== "api"
    ) {
      return decodeURIComponent(lastSegment)
        .trim()
        .toUpperCase();
    }
  }

  return "";
}

function mapHistory(quotes = []) {
  return quotes
    .filter((item) => item?.close !== null)
    .map((item) => ({
      date: new Date(item.date)
        .toISOString()
        .split("T")[0],
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
}

export async function handler(event) {
  if (event?.requestContext?.http?.method === "OPTIONS") {
    return response(200, {
      status: "ok",
    });
  }

  try {
    const yahooFinance =
      await getYahooFinanceClient();

    const symbol = normalizeSymbol(event);

    if (!symbol) {
      return response(400, {
        error: "Stock symbol is required",
      });
    }

    const queryOptions = {
      period1: "2020-01-01",
      period2: new Date(),
      interval: "1d",
    };

    const result = await yahooFinance.chart(
      symbol,
      queryOptions
    );

    if (!result || !result.quotes) {
      return response(404, {
        error: "No stock data found",
      });
    }

    const history = mapHistory(result.quotes);

    return response(200, {
      symbol,
      history,
    });
  } catch (error) {
    console.error(error);

    return response(500, {
      error: "Unable to retrieve stock data",
      message:
        error?.message ||
        "Unexpected server error",
    });
  }
}
