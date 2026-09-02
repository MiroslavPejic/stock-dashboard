import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getYahooHistory } from "../../api/yahooFinance";

import {
  calculateSMA,
  calculateRSI,
} from "../../api/indicators";

import StockChart from "../../components/StockChart/StockChart";

import { useAuth } from "../../context/AuthContext";

import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../../lib/favourites";

import "./Stocks.css";


function Stocks() {

  const { user } = useAuth();

  const [symbol, setSymbol] = useState("IBM");

  const [stock, setStock] = useState(null);

  const [history, setHistory] = useState([]);

  const [indicators, setIndicators] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [favourites, setFavourites] = useState([]);

  const [favouriteLoading, setFavouriteLoading] =
    useState(false);


  /*
   * Load the user's favourites when they
   * are logged in.
   */

  useEffect(() => {

    if (!user) {
      setFavourites([]);
      return;
    }


    async function loadFavourites() {

      const {
        data,
        error,
      } = await getFavourites();


      if (error) {

        console.error(
          "Unable to load favourites:",
          error
        );

        return;
      }


      setFavourites(
        (data || []).map(
          (favourite) =>
            favourite.symbol
        )
      );

    }


    loadFavourites();

  }, [user]);


  /*
   * Search for a stock.
   */

  async function handleSearch(event) {

    event.preventDefault();


    if (!symbol.trim()) {
      return;
    }


    setLoading(true);

    setError("");

    setStock(null);

    setHistory([]);

    setIndicators(null);


    try {

      const ticker =
        symbol.trim().toUpperCase();


      // One API request only

      const historicalData =
        await getYahooHistory(ticker);


      if (
        !historicalData ||
        historicalData.length === 0
      ) {

        throw new Error(
          "Stock not found"
        );

      }


      // Most recent trading day

      const latest =
        historicalData[
          historicalData.length - 1
        ];


      // Previous trading day

      const previous =
        historicalData.length > 1
          ? historicalData[
              historicalData.length - 2
            ]
          : null;


      // Calculate daily price change

      const change = previous
        ? latest.close - previous.close
        : 0;


      const changePercent = previous
        ? (change / previous.close) * 100
        : 0;


      // Create our stock object

      const stockData = {

        symbol: ticker,

        price: latest.close,

        open: latest.open,

        high: latest.high,

        low: latest.low,

        volume: latest.volume,

        previousClose:
          previous?.close ??
          latest.close,

        change,

        changePercent,

        tradingDay: latest.date,

      };


      // Calculate technical indicators

      const latestIndicators = {

        sma20:
          calculateSMA(
            historicalData,
            20
          ),

        sma50:
          calculateSMA(
            historicalData,
            50
          ),

        sma100:
          calculateSMA(
            historicalData,
            100
          ),

        sma200:
          calculateSMA(
            historicalData,
            200
          ),

        rsi:
          calculateRSI(
            historicalData,
            14
          ),

      };


      setStock(stockData);

      setHistory(historicalData);

      setIndicators(
        latestIndicators
      );

    } catch (err) {

      console.error(err);


      setStock(null);

      setHistory([]);

      setIndicators(null);


      setError(
        err.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }

  }


  /*
   * Add/remove the current stock
   * from favourites.
   */

  async function handleFavourite() {

    if (!user || !stock) {
      return;
    }


    const ticker =
      stock.symbol.toUpperCase();


    const alreadyFavourite =
      favourites.includes(ticker);


    setFavouriteLoading(true);


    try {

      if (alreadyFavourite) {

        const {
          error,
        } = await removeFavourite(
          ticker
        );


        if (error) {

          throw error;

        }


        setFavourites(
          (current) =>
            current.filter(
              (item) =>
                item !== ticker
            )
        );

      } else {

        const {
          error,
        } = await addFavourite(
          ticker
        );


        if (error) {

          throw error;

        }


        setFavourites(
          (current) => [
            ...current,
            ticker,
          ]
        );

      }

    } catch (err) {

      console.error(
        "Favourite error:",
        err
      );

      setError(
        "Unable to update your favourites."
      );

    } finally {

      setFavouriteLoading(false);

    }

  }


  function formatNumber(value) {

    if (
      value === null ||
      value === undefined ||
      Number.isNaN(
        Number(value)
      )
    ) {

      return "—";

    }


    return Number(value).toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 2,
      }
    );

  }


  function formatPrice(value) {

    if (
      value === null ||
      value === undefined ||
      Number.isNaN(
        Number(value)
      )
    ) {

      return "—";

    }


    return `$${Number(value).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  }


  function formatChange(value) {

    if (
      value === null ||
      value === undefined ||
      Number.isNaN(
        Number(value)
      )
    ) {

      return "—";

    }


    const number = Number(value);


    return `${
      number >= 0 ? "+" : ""
    }${number.toFixed(2)}`;

  }


  function formatPercent(value) {

    if (
      value === null ||
      value === undefined ||
      Number.isNaN(
        Number(value)
      )
    ) {

      return "—";

    }


    const number = Number(value);


    return `${
      number >= 0 ? "+" : ""
    }${number.toFixed(2)}%`;

  }


  const isCurrentStockFavourite =
    stock &&
    favourites.includes(
      stock.symbol.toUpperCase()
    );


  return (
    <main className="stocks-page">
      <div className="stocks-container">
        {/* Page Header */}
        <div className="stocks-header">
          <div className="stocks-eyebrow">
            Market Analysis
          </div>
          <h1>
            Stock Analysis
          </h1>
          <p>
            Search for a company to view its
            price, market data and technical
            indicators.
          </p>
        </div>
        {/* Search */}
        <form
          className="stock-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            value={symbol}
            onChange={(event) =>
              setSymbol(
                event.target.value.toUpperCase()
              )
            }
            placeholder="Enter ticker e.g. AAPL"
            aria-label="Stock ticker"
          />
          <button
            type="submit"
            disabled={loading}
            className="search-button"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                <span>
                  Analysing...
                </span>
              </>
            ) : (
              "Analyse Stock"
            )}
          </button>
        </form>
        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        {/* Loading */}
        {loading && (
          <section className="loading-panel">
            <div className="loading-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h3>
              Analysing{" "}
              {symbol.toUpperCase()}
            </h3>
            <p>
              Retrieving historical market
              data and calculating technical
              indicators...
            </p>
          </section>
        )}
        {/* Empty state */}
        {!stock &&
          !loading &&
          !error && (
            <section className="empty-stock-state">
              <div className="empty-stock-icon">
                ↗
              </div>
              <h2>
                Search for a stock
              </h2>
              <p>
                Enter a ticker symbol above to
                view price data, historical
                performance and technical
                indicators.
              </p>
              <div className="example-tickers">
                <button
                  type="button"
                  onClick={() =>
                    setSymbol("AAPL")
                  }
                >
                  AAPL
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSymbol("MSFT")
                  }
                >
                  MSFT
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSymbol("NVDA")
                  }
                >
                  NVDA
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSymbol("GOOGL")
                  }
                >
                  GOOGL
                </button>
              </div>
            </section>
          )}
        {/* Stock Results */}
        {stock &&
          indicators && (
            <>
              {/* Stock Overview */}
              <section className="stock-overview">
                <div>
                  <div className="stock-title">
                    <span className="ticker">
                      {stock.symbol}
                    </span>
                    <span className="stock-label">
                      Equity
                    </span>
                  </div>
                  <div className="stock-price">
                    {formatPrice(
                      stock.price
                    )}
                  </div>
                  <div
                    className={`stock-change ${
                      stock.change >= 0
                        ? "positive"
                        : "negative"
                    }`}
                  >
                    <span>
                      {formatChange(
                        stock.change
                      )}
                    </span>
                    <span>
                      {formatPercent(
                        stock.changePercent
                      )}
                    </span>
                  </div>
                </div>
                {/* Favourite */}
                {user ? (
                  <button
                    type="button"
                    className={`favourite-button ${
                      isCurrentStockFavourite
                        ? "is-favourite"
                        : ""
                    }`}
                    onClick={
                      handleFavourite
                    }
                    disabled={
                      favouriteLoading
                    }
                    aria-label={
                      isCurrentStockFavourite
                        ? `Remove ${stock.symbol} from favourites`
                        : `Add ${stock.symbol} to favourites`
                    }
                    title={
                      isCurrentStockFavourite
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                  >
                    <span className="favourite-star">
                      {favouriteLoading
                        ? "..."
                        : isCurrentStockFavourite
                          ? "★"
                          : "☆"}
                    </span>
                    <span>
                      {isCurrentStockFavourite
                        ? "Favourite"
                        : "Add to favourites"}
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="favourite-login-button"
                  >
                    <span>
                      ☆
                    </span>
                    Sign in to save
                  </Link>
                )}
              </section>
              {/* Market Information */}
              <section className="market-grid">
                <div className="market-card">
                  <span>
                    Open
                  </span>
                  <strong>
                    {formatPrice(
                      stock.open
                    )}
                  </strong>
                </div>
                <div className="market-card">
                  <span>
                    Previous Close
                  </span>
                  <strong>
                    {formatPrice(
                      stock.previousClose
                    )}
                  </strong>
                </div>
                <div className="market-card">
                  <span>
                    Day High
                  </span>
                  <strong>
                    {formatPrice(
                      stock.high
                    )}
                  </strong>
                </div>
                <div className="market-card">
                  <span>
                    Day Low
                  </span>
                  <strong>
                    {formatPrice(
                      stock.low
                    )}
                  </strong>
                </div>
                <div className="market-card">
                  <span>
                    Volume
                  </span>
                  <strong>
                    {formatNumber(
                      stock.volume
                    )}
                  </strong>
                </div>
                <div className="market-card">
                  <span>
                    Latest Trading Day
                  </span>
                  <strong>
                    {stock.tradingDay}
                  </strong>
                </div>
              </section>
              {/* Technical Analysis */}
              <section className="analysis-section">
                <div className="section-heading">
                  <div>
                    <h2>
                      Technical Analysis
                    </h2>
                    <p>
                      Calculated from
                      historical daily prices.
                    </p>
                  </div>
                </div>
                <div className="indicator-grid">
                  <div className="indicator-card">
                    <span>
                      20 Day SMA
                    </span>
                    <strong>
                      {formatPrice(
                        indicators.sma20
                      )}
                    </strong>
                  </div>
                  <div className="indicator-card">
                    <span>
                      50 Day SMA
                    </span>
                    <strong>
                      {formatPrice(
                        indicators.sma50
                      )}
                    </strong>
                  </div>
                  <div className="indicator-card">
                    <span>
                      100 Day SMA
                    </span>
                    <strong>
                      {formatPrice(
                        indicators.sma100
                      )}
                    </strong>
                  </div>
                  <div className="indicator-card highlight">
                    <span>
                      200 Day SMA
                    </span>
                    <strong>
                      {formatPrice(
                        indicators.sma200
                      )}
                    </strong>
                  </div>
                  <div className="indicator-card">
                    <span>
                      RSI (14)
                    </span>
                    <strong>
                      {formatNumber(
                        indicators.rsi
                      )}
                    </strong>
                  </div>
                </div>
              </section>
              {/* Historical Data */}
              <section className="history-section">
                <div className="section-heading">
                  <div>
                    <h2>
                      Historical Data
                    </h2>
                    <p>
                      {history.length.toLocaleString()}
                      {" "}
                      trading days available.
                    </p>
                  </div>
                </div>
                <div className="chart-container">
                  <StockChart
                    data={history}
                  />
                </div>
              </section>
            </>
          )}
      </div>
    </main>
  );

}


export default Stocks;