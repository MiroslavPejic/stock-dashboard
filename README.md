# Stock Dashboard

A React-based stock market dashboard built for learning and
experimenting with stock data, technical indicators and financial
charts.

The application currently uses **Yahoo Finance** for market data and a
**Node/Express backend** to retrieve the data safely before passing it
to the React frontend.

## Features

-   React frontend
-   Multi-page application
    -   Home
    -   Stocks
    -   About
-   Navigation bar and footer
-   Stock search
-   Yahoo Finance market data
-   Historical stock prices
-   Interactive price charts
-   Line chart mode
-   Candlestick chart mode
-   Timeframe selection:
    -   1 Month
    -   3 Months
    -   6 Months
    -   1 Year
    -   2 Years
    -   5 Years
-   Simple moving averages:
    -   20 SMA
    -   50 SMA
    -   100 SMA
    -   200 SMA
-   Ability to show/hide individual moving averages
-   Responsive styling
-   Loading indicators for stock searches

------------------------------------------------------------------------

# Technology Stack

## Frontend

### React

The user interface is built with React.

React is responsible for:

-   Pages
-   Components
-   Navigation
-   Stock search
-   Chart controls
-   Displaying stock data

### Vite

Vite is used as the development server and build tool for the React
application.

## Backend

### Node.js

Node.js runs the backend server that retrieves stock information.

### Express

Express provides the API endpoints used by the React application.

The backend currently runs on:

``` text
http://localhost:3001
```

## Stock Data

### Yahoo Finance

The application uses the `yahoo-finance2` npm package to retrieve stock
information from Yahoo Finance.

This means the application does not currently require an Alpha Vantage
API key.

The project originally experimented with Alpha Vantage, but Yahoo
Finance is now being used for the stock data.

## Charts

### Lightweight Charts

The stock charts use TradingView's `lightweight-charts` library.

This provides:

-   Candlestick charts
-   Line charts
-   Interactive scrolling
-   Chart zooming
-   Crosshair
-   Price scales
-   Time scales

------------------------------------------------------------------------

# Project Structure

The project currently follows a structure similar to:

``` text
stock-dashboard/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── StockChart.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── Stocks.jsx
│   │   ├── Stocks.css
│   │   ├── About.jsx
│   │   └── About.css
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── server/
│   └── server.js
│
├── package.json
├── package-lock.json
└── README.md
```

The exact component filenames may vary slightly depending on changes
made during development.

------------------------------------------------------------------------

# Requirements

Before running the application, make sure you have:

-   Node.js installed
-   npm installed

You can check your versions with:

``` bash
node -v
npm -v
```

The project has been developed using modern Node.js and ES modules.

------------------------------------------------------------------------

# Installing the Project

Clone or copy the project to your computer.

Then navigate into the project directory:

``` bash
cd stock-dashboard
```

Install the dependencies:

``` bash
npm install
```

This installs the packages defined in `package.json`, including the
frontend and backend dependencies.

------------------------------------------------------------------------

# Starting the Application

The application has two parts:

1.  React frontend
2.  Node/Express backend

Both need to be running.

## 1. Start the Backend

Open a terminal and navigate to the project directory.

Run:

``` bash
node server/server.js
```

The backend should start on:

``` text
http://localhost:3001
```

You can test the API with:

``` bash
curl http://localhost:3001/api/stocks/AAPL
```

If the request is successful, you should receive stock data for Apple.

------------------------------------------------------------------------

## 2. Start the React Frontend

Open a second terminal window.

Navigate to the project directory:

``` bash
cd stock-dashboard
```

Then run:

``` bash
npm run dev
```

Vite will normally provide a local address similar to:

``` text
http://localhost:5173
```

Open that address in your browser.

------------------------------------------------------------------------

# Running the Application

Once both servers are running:

``` text
Terminal 1
────────────────────────────

node server/server.js

Backend
http://localhost:3001


Terminal 2
────────────────────────────

npm run dev

Frontend
http://localhost:5173
```

The browser loads the React application from the frontend server.

When you search for a stock, React communicates with the Express
backend.

The backend then retrieves the stock information from Yahoo Finance and
returns it to React.

The basic flow is:

``` text
Browser
   │
   │ Stock search
   ▼
React Application
   │
   │ HTTP request
   ▼
Express Backend
   │
   │ Yahoo Finance request
   ▼
Yahoo Finance
   │
   │ Stock data
   ▼
Express Backend
   │
   ▼
React
   │
   ▼
Chart / Stock Information
```

------------------------------------------------------------------------

# Stock API

The backend exposes a stock endpoint similar to:

``` text
GET /api/stocks/:symbol
```

For example:

``` text
/api/stocks/AAPL
```

or:

``` text
/api/stocks/MSFT
```

The symbol is passed to Yahoo Finance and the returned data is sent back
to the React application.

------------------------------------------------------------------------

# Charts

The stock chart supports two chart types.

## Line Chart

The line chart displays the closing price.

It is useful for quickly viewing the overall price trend.

## Candlestick Chart

The candlestick chart displays:

-   Open
-   High
-   Low
-   Close

Each candle represents a trading period.

Candlesticks make it easier to analyse price movement within each
trading day.

------------------------------------------------------------------------

# Timeframes

The chart supports:

``` text
1M
3M
6M
1Y
2Y
5Y
```

Changing the timeframe does not require another request to the backend.

Instead, the application filters the historical data that has already
been loaded.

This makes changing timeframe fast and avoids unnecessary requests to
Yahoo Finance.

------------------------------------------------------------------------

# Moving Averages

The application calculates simple moving averages on the frontend.

Currently available:

``` text
20 SMA
50 SMA
100 SMA
200 SMA
```

The moving averages are calculated using the complete historical dataset
before the selected timeframe is applied.

For example, when viewing the 6-month chart, the 200 SMA is still
calculated using 200 trading days of data rather than only the six
months being displayed.

Each moving average can also be independently shown or hidden.

------------------------------------------------------------------------

# Important Note About Yahoo Finance Data

Yahoo Finance is being accessed through the `yahoo-finance2` npm
package.

The project is primarily intended as a learning project.

For a production application, you should consider:

-   API reliability
-   Rate limits
-   Caching
-   Error handling
-   Authentication
-   Data licensing
-   Market-data licensing requirements
-   Server-side caching
-   Monitoring

You should also avoid relying on a third-party market-data service
without checking its current terms and permitted usage.

------------------------------------------------------------------------

# Development

The project is intended to be developed incrementally.

Some useful commands are:

### Install dependencies

``` bash
npm install
```

### Start the React development server

``` bash
npm run dev
```

### Start the backend

``` bash
node server/server.js
```

### Check the backend manually

``` bash
curl http://localhost:3001/api/stocks/AAPL
```

------------------------------------------------------------------------

# Troubleshooting

## `require is not defined in ES module scope`

The project uses ES modules because `package.json` contains:

``` json
"type": "module"
```

Therefore backend files should use:

``` js
import ...
```

rather than:

``` js
require(...)
```

------------------------------------------------------------------------

## Yahoo Finance error

If Yahoo Finance returns an error, check:

1.  The backend is running.
2.  The stock ticker is valid.
3.  Your internet connection is working.
4.  Yahoo Finance is currently responding.
5.  The `yahoo-finance2` package is installed.

Try:

``` bash
curl http://localhost:3001/api/stocks/AAPL
```

------------------------------------------------------------------------

## Candlestick chart is blank

Candlesticks require OHLC data.

The backend needs to provide:

``` text
open
high
low
close
date
```

If only `close` is returned, the line chart can still work but the
candlestick chart cannot be constructed correctly.

------------------------------------------------------------------------

## `chart.addCandlestickSeries is not a function`

Newer versions of `lightweight-charts` use:

``` js
chart.addSeries(CandlestickSeries, options)
```

rather than the older:

``` js
chart.addCandlestickSeries(options)
```

The current implementation uses the newer API.

------------------------------------------------------------------------

# Future Ideas

This project is intentionally being built incrementally.

Potential future features include:

-   RSI
-   MACD
-   Bollinger Bands
-   Volume
-   Volume moving average
-   Dividend information
-   Company information
-   Market capitalisation
-   P/E ratio
-   52-week high/low
-   Percentage change
-   Watchlists
-   Multiple stocks
-   Stock comparison
-   Dark mode
-   Improved mobile layout
-   Saved favourite stocks
-   More advanced technical indicators
-   Portfolio tracking

------------------------------------------------------------------------

# Learning Goals

The project is also intended as a practical way to learn:

-   React
-   React components
-   React state
-   React hooks
-   `useEffect`
-   `useMemo`
-   API requests
-   Express
-   Node.js
-   REST APIs
-   Financial data
-   Technical analysis
-   Charting libraries
-   Responsive CSS
-   Frontend/backend communication

The application can therefore be treated as a learning project rather
than simply a finished stock application.

------------------------------------------------------------------------

# License

This project is a personal learning project.

Check the relevant terms and licences for all third-party libraries and
market-data providers before using the application commercially.
