import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getFavourites,
  removeFavourite,
} from "../../lib/favourites";

import { getYahooHistory } from "../../api/yahooFinance";

import "./Favourites.css";


function Favourites() {

  const { user, loading: authLoading } = useAuth();

  const [favourites, setFavourites] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /*
   * Load favourites and their latest
   * market data.
   */

  useEffect(() => {

    if (authLoading) {
      return;
    }


    if (!user) {
      setLoading(false);
      return;
    }


    const loadFavourites = async () => {

      setLoading(true);
      setError("");


      try {

        const {
          data,
          error: favouritesError,
        } = await getFavourites();


        if (favouritesError) {
          throw favouritesError;
        }


        if (!data || data.length === 0) {

          setFavourites([]);

          setLoading(false);

          return;
        }


        /*
         * Get the latest market data for
         * each favourite.
         */

        const stocks = await Promise.all(

          data.map(async (favourite) => {

            try {

              const history =
                await getYahooHistory(
                  favourite.symbol
                );


              if (
                !history ||
                history.length === 0
              ) {

                return {
                  ...favourite,
                  price: null,
                  change: null,
                  changePercent: null,
                  dataError: true,
                };

              }


              const latest =
                history[
                  history.length - 1
                ];


              const previous =
                history.length > 1
                  ? history[
                      history.length - 2
                    ]
                  : null;


              const change = previous
                ? latest.close -
                  previous.close
                : null;


              const changePercent =
                previous
                  ? (
                      change /
                      previous.close
                    ) * 100
                  : null;


              return {

                ...favourite,

                price: latest.close,

                change,

                changePercent,

                tradingDay:
                  latest.date,

              };

            } catch (err) {

              console.error(
                `Unable to load ${favourite.symbol}:`,
                err
              );


              return {

                ...favourite,

                price: null,

                change: null,

                changePercent: null,

                dataError: true,

              };

            }

          })

        );


        setFavourites(stocks);

      } catch (err) {

        console.error(err);


        setError(
          "Unable to load your favourite stocks."
        );

      } finally {

        setLoading(false);

      }

    };


    loadFavourites();

  }, [user, authLoading]);


  /*
   * Remove a favourite.
   */

  const handleRemove = async (symbol) => {

    const {
      error: removeError,
    } = await removeFavourite(symbol);


    if (removeError) {

      setError(
        "Unable to remove this stock."
      );

      return;
    }


    setFavourites((current) =>
      current.filter(
        (stock) =>
          stock.symbol !== symbol
      )
    );

  };


  /*
   * Formatting helpers.
   */

  const formatPrice = (value) => {

    if (
      value === null ||
      value === undefined
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

  };


  const formatChange = (value) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "—";

    }


    const number = Number(value);


    return `${
      number >= 0 ? "+" : ""
    }${number.toFixed(2)}`;

  };


  const formatPercent = (value) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "—";

    }


    const number = Number(value);


    return `${
      number >= 0 ? "+" : ""
    }${number.toFixed(2)}%`;

  };


  /*
   * Authentication loading.
   */

  if (authLoading) {

    return (
      <main className="favourites-page">
        <div className="favourites-loading">
          <div className="loading-spinner"></div>
          <p>
            Loading...
          </p>
        </div>
      </main>
    );

  }


  /*
   * Favourites require an account.
   */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return (

    <main className="favourites-page">

      <div className="favourites-container">

        {/* Header */}

        <div className="favourites-header">

          <div>

            <span className="page-eyebrow">
              Your watchlist
            </span>

            <h1>
              Favourite Stocks
            </h1>

            <p>
              Keep track of the companies
              you're interested in.
            </p>

          </div>


          <Link
            to="/stocks"
            className="favourites-add-button"
          >
            + Find Stocks
          </Link>

        </div>


        {/* Error */}

        {error && (

          <div className="favourites-error">
            {error}
          </div>

        )}


        {/* Loading */}

        {loading && (

          <div className="favourites-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading market data...
            </p>

          </div>

        )}


        {/* Empty state */}

        {!loading &&
          favourites.length === 0 && (

            <div className="favourites-empty">

              <div className="empty-icon">
                ★
              </div>

              <h2>
                No favourite stocks yet
              </h2>

              <p>
                Search for a stock and add it
                to your favourites to see it
                here.
              </p>

              <Link
                to="/stocks"
                className="empty-button"
              >
                Explore Stocks
              </Link>

            </div>

          )}


        {/* Favourite stocks */}

        {!loading &&
          favourites.length > 0 && (

            <div className="favourites-list">

              {favourites.map((stock) => {

                const isPositive =
                  stock.change >= 0;


                return (
                  <div
                    className="favourite-card"
                    key={stock.id}
                  >
                    <Link
                      to={`/stocks?symbol=${encodeURIComponent(
                        stock.symbol
                      )}`}
                      className="favourite-stock"
                    >
                      <div className="favourite-icon">
                        {stock.symbol.charAt(0)}
                      </div>
                      <div className="favourite-details">
                        <span className="favourite-symbol">
                          {stock.symbol}
                        </span>
                        <span className="favourite-label">
                          View stock analysis
                        </span>
                      </div>
                    </Link>
                    <div className="favourite-market-data">
                      {stock.price !== null ? (
                        <>
                          <div className="favourite-price">
                            {formatPrice(
                              stock.price
                            )}
                          </div>
                          <div
                            className={`favourite-change ${
                              isPositive
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
                        </>
                      ) : (
                        <span className="price-unavailable">
                          Data unavailable
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="remove-favourite"
                      onClick={() =>
                        handleRemove(
                          stock.symbol
                        )
                      }
                      title={`Remove ${stock.symbol}`}
                    >
                      ★
                    </button>
                  </div>
                );

              })}

            </div>

          )}

      </div>

    </main>

  );

}


export default Favourites;