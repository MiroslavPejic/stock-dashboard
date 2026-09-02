import { useEffect, useMemo, useRef, useState } from "react";

import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";

import "./StockChart.css";


const TIMEFRAMES = [
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "2Y", months: 24 },
  { label: "5Y", months: 60 },
];


const MA_OPTIONS = [
  {
    key: "sma20",
    label: "20 SMA",
    colour: {
      light: "#3b82f6",
      dark: "#63aaff",
    },
  },
  {
    key: "sma50",
    label: "50 SMA",
    colour: {
      light: "#8b5cf6",
      dark: "#b48bff",
    },
  },
  {
    key: "sma100",
    label: "100 SMA",
    colour: {
      light: "#f59e0b",
      dark: "#ffc14d",
    },
  },
  {
    key: "sma200",
    label: "200 SMA",
    colour: {
      light: "#ef4444",
      dark: "#ff7f88",
    },
  },
];


const RSI_PERIOD = 14;


function calculateRSI(data, period = RSI_PERIOD) {
  const values = Array(data.length).fill(null);

  if (data.length <= period) {
    return values;
  }

  let gains = 0;
  let losses = 0;

  for (let index = 1; index <= period; index += 1) {
    const change =
      Number(data[index].close) -
      Number(data[index - 1].close);

    gains += Math.max(change, 0);
    losses += Math.max(-change, 0);
  }

  let averageGain = gains / period;
  let averageLoss = losses / period;

  const getValue = () => {
    if (averageGain === 0 && averageLoss === 0) {
      return 50;
    }

    if (averageLoss === 0) {
      return 100;
    }

    return 100 - 100 / (1 + averageGain / averageLoss);
  };

  values[period] = getValue();

  for (let index = period + 1; index < data.length; index += 1) {
    const change =
      Number(data[index].close) -
      Number(data[index - 1].close);

    averageGain =
      (averageGain * (period - 1) + Math.max(change, 0)) /
      period;
    averageLoss =
      (averageLoss * (period - 1) + Math.max(-change, 0)) /
      period;

    values[index] = getValue();
  }

  return values;
}


function getChartTheme(mode) {
  if (mode === "dark") {
    return {
      layout: {
        background: {
          type: ColorType.Solid,
          color: "#0f1f31",
        },
        textColor: "#95acc4",
      },
      grid: {
        vertLines: {
          color: "#1c334a",
        },
        horzLines: {
          color: "#1c334a",
        },
      },
      rightPriceScale: {
        borderColor: "#274763",
      },
      timeScale: {
        borderColor: "#274763",
      },
      lineSeriesColor: "#d4e6f7",
      candleColors: {
        upColor: "#2dc79d",
        downColor: "#ff6d77",
        borderUpColor: "#2dc79d",
        borderDownColor: "#ff6d77",
        wickUpColor: "#2dc79d",
        wickDownColor: "#ff6d77",
      },
    };
  }

  return {
    layout: {
      background: {
        type: ColorType.Solid,
        color: "#ffffff",
      },
      textColor: "#64748b",
    },
    grid: {
      vertLines: {
        color: "#f1f5f9",
      },
      horzLines: {
        color: "#f1f5f9",
      },
    },
    rightPriceScale: {
      borderColor: "#e2e8f0",
    },
    timeScale: {
      borderColor: "#e2e8f0",
    },
    lineSeriesColor: "#0f172a",
    candleColors: {
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderUpColor: "#16a34a",
      borderDownColor: "#dc2626",
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    },
  };
}


function StockChart({ data }) {
  const chartContainerRef = useRef(null);

  const chartRef = useRef(null);

  const priceSeriesRef = useRef(null);

  const maSeriesRefs = useRef([]);

  const rsiSeriesRef = useRef(null);


  const [timeframe, setTimeframe] = useState("1Y");

  const [chartType, setChartType] = useState("candles");

  const [visibleMAs, setVisibleMAs] = useState({
    sma20: true,
    sma50: true,
    sma100: true,
    sma200: true,
  });

  const [showRSI, setShowRSI] = useState(false);

  const [themeMode, setThemeMode] = useState(
    () =>
      document.documentElement.getAttribute(
        "data-theme"
      ) === "dark"
        ? "dark"
        : "light"
  );

  const chartTheme = useMemo(
    () => getChartTheme(themeMode),
    [themeMode]
  );


  /*
   * Calculate moving averages using the
   * complete dataset.
   */

  const chartDataWithIndicators = useMemo(() => {

    const rsiValues = calculateRSI(data);

    return data.map((item, index) => ({

      ...item,

      sma20:
        index >= 19
          ? data
              .slice(index - 19, index + 1)
              .reduce(
                (sum, value) =>
                  sum + Number(value.close),
                0
              ) / 20
          : null,

      sma50:
        index >= 49
          ? data
              .slice(index - 49, index + 1)
              .reduce(
                (sum, value) =>
                  sum + Number(value.close),
                0
              ) / 50
          : null,

      sma100:
        index >= 99
          ? data
              .slice(index - 99, index + 1)
              .reduce(
                (sum, value) =>
                  sum + Number(value.close),
                0
              ) / 100
          : null,

      sma200:
        index >= 199
          ? data
              .slice(index - 199, index + 1)
              .reduce(
                (sum, value) =>
                  sum + Number(value.close),
                0
              ) / 200
          : null,

      rsi: rsiValues[index],

    }));

  }, [data]);


  /*
   * Filter according to selected timeframe.
   */

  const filteredData = useMemo(() => {

    if (!chartDataWithIndicators.length) {
      return [];
    }


    const latestDate = new Date(
      `${chartDataWithIndicators.at(-1).date}T00:00:00`
    );


    const selectedTimeframe =
      TIMEFRAMES.find(
        (item) => item.label === timeframe
      );


    if (!selectedTimeframe) {
      return chartDataWithIndicators;
    }


    const cutoffDate = new Date(latestDate);


    cutoffDate.setMonth(
      cutoffDate.getMonth() -
        selectedTimeframe.months
    );


    return chartDataWithIndicators.filter(
      (item) =>
        new Date(`${item.date}T00:00:00`) >=
        cutoffDate
    );

  }, [
    chartDataWithIndicators,
    timeframe,
  ]);


  useEffect(() => {

    const rootElement =
      document.documentElement;

    const observer = new MutationObserver(
      () => {
        setThemeMode(
          rootElement.getAttribute(
            "data-theme"
          ) === "dark"
            ? "dark"
            : "light"
        );
      }
    );


    observer.observe(rootElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });


    return () => {
      observer.disconnect();
    };

  }, []);


  /*
   * Create the chart once.
   */

  useEffect(() => {

    if (!chartContainerRef.current) {
      return;
    }


    const initialTheme = getChartTheme(
      document.documentElement.getAttribute(
        "data-theme"
      ) === "dark"
        ? "dark"
        : "light"
    );


    const chart = createChart(
      chartContainerRef.current,
      {
        layout: initialTheme.layout,

        grid: initialTheme.grid,

        crosshair: {
          mode: CrosshairMode.Normal,
        },

        rightPriceScale: {
          borderColor:
            initialTheme.rightPriceScale.borderColor,

          scaleMargins: {
            top: 0.08,
            bottom: 0.08,
          },
        },

        timeScale: {
          borderColor:
            initialTheme.timeScale.borderColor,

          rightOffset: 5,

          barSpacing: 8,

          timeVisible: false,

          secondsVisible: false,
        },

        handleScroll: true,

        handleScale: true,
      }
    );


    chartRef.current = chart;


    const resizeObserver =
      new ResizeObserver((entries) => {

        if (!entries.length) {
          return;
        }


        const {
          width,
          height,
        } = entries[0].contentRect;


        chart.applyOptions({
          width,
          height,
        });

      });


    resizeObserver.observe(
      chartContainerRef.current
    );


    /*
     * Cleanup when component is destroyed.
     */

    return () => {

      resizeObserver.disconnect();

      chart.remove();

      chartRef.current = null;

    };

  }, []);


  useEffect(() => {

    const chart = chartRef.current;

    if (!chart) {
      return;
    }


    chart.applyOptions({
      layout: chartTheme.layout,
      grid: chartTheme.grid,
      rightPriceScale: {
        borderColor:
          chartTheme.rightPriceScale.borderColor,
      },
      timeScale: {
        borderColor:
          chartTheme.timeScale.borderColor,
      },
    });

  }, [chartTheme]);


  /*
   * Create price series.
   */

  useEffect(() => {

    const chart = chartRef.current;

    if (!chart) {
      return;
    }


    /*
     * Remove previous price series.
     */

    if (priceSeriesRef.current) {

      try {
        chart.removeSeries(
          priceSeriesRef.current
        );
      } catch (error) {
        console.warn(
          "Unable to remove previous price series",
          error
        );
      }

      priceSeriesRef.current = null;
    }


    /*
     * Candlestick chart.
     */

    if (chartType === "candles") {

      const series = chart.addSeries(
        CandlestickSeries,
        chartTheme.candleColors
      );


      const candleData =
        filteredData
          .filter(
            (item) =>
              item.open !== undefined &&
              item.high !== undefined &&
              item.low !== undefined &&
              item.close !== undefined
          )
          .map((item) => ({
            time: item.date,

            open: Number(item.open),

            high: Number(item.high),

            low: Number(item.low),

            close: Number(item.close),
          }));


      series.setData(candleData);


      priceSeriesRef.current = series;
    }


    /*
     * Line chart.
     */

    else {

      const series = chart.addSeries(
        LineSeries,
        {
          color: chartTheme.lineSeriesColor,

          lineWidth: 3,

          crosshairMarkerVisible: true,

          priceLineVisible: false,

          lastValueVisible: true,
        }
      );


      const lineData =
        filteredData.map((item) => ({
          time: item.date,

          value: Number(item.close),
        }));


      series.setData(lineData);


      priceSeriesRef.current = series;
    }


    /*
     * Fit the chart to the data.
     */

    chart.timeScale().fitContent();


  }, [
    filteredData,
    chartType,
    chartTheme,
  ]);


  /*
   * Create moving average lines.
   */

  useEffect(() => {

    const chart = chartRef.current;

    if (!chart) {
      return;
    }


    /*
     * Remove existing MA series.
     */

    maSeriesRefs.current.forEach(
      (series) => {

        try {

          chart.removeSeries(series);

        } catch (error) {

          console.warn(
            "Unable to remove MA series",
            error
          );

        }

      }
    );


    maSeriesRefs.current = [];


    /*
     * Create selected MA lines.
     */

    MA_OPTIONS.forEach((ma) => {

      if (!visibleMAs[ma.key]) {
        return;
      }


      const series = chart.addSeries(
        LineSeries,
        {
          color:
            ma.colour[
              themeMode === "dark"
                ? "dark"
                : "light"
            ],

          lineWidth:
            ma.key === "sma200"
              ? 2
              : 1,

          crosshairMarkerVisible: false,

          priceLineVisible: false,

          lastValueVisible: false,
        }
      );


      const maData =
        filteredData
          .filter(
            (item) =>
              item[ma.key] !== null &&
              item[ma.key] !== undefined
          )
          .map((item) => ({
            time: item.date,

            value: Number(
              item[ma.key]
            ),
          }));


      series.setData(maData);


      maSeriesRefs.current.push(
        series
      );

    });


    chart.timeScale().fitContent();


  }, [
    filteredData,
    visibleMAs,
    themeMode,
  ]);


  /*
   * Create the RSI in a separate lower pane.
   */

  useEffect(() => {

    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    if (rsiSeriesRef.current) {
      try {
        chart.removeSeries(rsiSeriesRef.current);
      } catch (error) {
        console.warn(
          "Unable to remove previous RSI series",
          error
        );
      }

      rsiSeriesRef.current = null;
    }

    if (!showRSI) {
      return;
    }

    const series = chart.addSeries(
      LineSeries,
      {
        color:
          themeMode === "dark"
            ? "#a78bfa"
            : "#6d28d9",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        title: `RSI (${RSI_PERIOD})`,
        priceFormat: {
          type: "price",
          precision: 0,
          minMove: 1,
        },
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: 0,
            maxValue: 100,
          },
        }),
      },
      1
    );

    series.setData(
      filteredData
        .filter((item) => item.rsi !== null)
        .map((item) => ({
          time: item.date,
          value: item.rsi,
        }))
    );

    series.createPriceLine({
      price: 70,
      color: themeMode === "dark" ? "#7f1d1d" : "#fecaca",
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "Overbought",
    });

    series.createPriceLine({
      price: 30,
      color: themeMode === "dark" ? "#14532d" : "#bbf7d0",
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "Oversold",
    });

    chart.panes()[1]?.setHeight(140);
    rsiSeriesRef.current = series;

    chart.timeScale().fitContent();

  }, [
    filteredData,
    showRSI,
    themeMode,
  ]);


  /*
   * Toggle moving average.
   */

  const toggleMA = (key) => {

    setVisibleMAs((current) => ({
      ...current,

      [key]: !current[key],
    }));

  };


  if (!data || data.length === 0) {
    return null;
  }


  return (
    <div className="stock-chart">
      {/* =========================
          Header
          ========================= */}
      <div className="chart-header">
        <div className="chart-title">
          <h3>
            Price History
          </h3>
          <p>
            Price and moving averages
          </p>
        </div>
        <div className="chart-timeframes">
          {TIMEFRAMES.map((option) => (
            <button
              key={option.label}
              type="button"
              className={
                timeframe === option.label
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTimeframe(
                  option.label
                )
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {/* =========================
          Controls
          ========================= */}
      <div className="chart-controls">
        {/* Chart type */}
        <div className="chart-control-group">
          <span className="chart-control-label">
            Chart
          </span>
          <div className="chart-toggle">
            <button
              type="button"
              className={
                chartType === "line"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setChartType("line")
              }
            >
              Line
            </button>
            <button
              type="button"
              className={
                chartType === "candles"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setChartType("candles")
              }
            >
              Candles
            </button>
          </div>
        </div>
        {/* Moving averages */}
        <div className="chart-control-group">
          <span className="chart-control-label">
            Moving averages
          </span>
          <div className="ma-toggle-group">
            {MA_OPTIONS.map((ma) => (
              <button
                key={ma.key}
                type="button"
                className={
                  visibleMAs[ma.key]
                    ? "ma-button active"
                    : "ma-button"
                }
                onClick={() =>
                  toggleMA(ma.key)
                }
              >
                <span
                  className="ma-colour-dot"
                  style={{
                    backgroundColor:
                      ma.colour[
                        themeMode === "dark"
                          ? "dark"
                          : "light"
                      ],
                  }}
                />
                {ma.label}
              </button>
            ))}
          </div>
        </div>
        <div className="chart-control-group">
          <span className="chart-control-label">
            Indicators
          </span>
          <div className="ma-toggle-group">
            <button
              type="button"
              className={
                showRSI
                  ? "ma-button active"
                  : "ma-button"
              }
              onClick={() => setShowRSI((current) => !current)}
              aria-pressed={showRSI}
            >
              RSI (14)
            </button>
          </div>
        </div>
      </div>
      {/* =========================
          Chart
          ========================= */}
      <div
        ref={chartContainerRef}
        className="chart-wrapper"
      />
    </div>
  );
}


export default StockChart;
