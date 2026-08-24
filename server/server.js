import express from "express";
import cors from "cors";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const app = express();

const PORT = 3001;
app.use(cors());

app.use(express.json());


// Test endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Yahoo Finance server is running",
  });
});


// Stock history endpoint
app.get("/api/stocks/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    console.log(
      `Fetching Yahoo Finance data for ${symbol}`
    );

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
      return res.status(404).json({
        error: "No stock data found",
      });
    }

    const history = result.quotes
      .filter((item) => item.close !== null)
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

    res.json({
      symbol,
      history,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Unable to retrieve stock data",
      message: error.message,
    });
  }
});


app.listen(PORT, () => {
  console.log(
    `Yahoo Finance server running at http://localhost:${PORT}`
  );
});