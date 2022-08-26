import React from "react";
import { CryptocurrencyMarket } from "react-tradingview-embed";


const MarketTrend = () => {

  return (
    <>
      <section className="market-trend-orbtx padding50">
        <div className="container">
          <h1 className="text-white ">Market Trend</h1>
          <CryptocurrencyMarket className="mt-3" widgetProps={{
            "width": "100%",
            "height": "490",
            "defaultColumn": "moving_averages",
            "screener_type": "crypto_mkt",
            "displayCurrency": "USD",
            "locale": "en",
            "isTransparent": true,
          }} />
        </div>
      </section>
    </>
  );
};

export default MarketTrend;
