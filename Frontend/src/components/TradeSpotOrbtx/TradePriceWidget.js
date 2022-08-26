import React from "react";

const TradePriceWidget = ({ primaryCoin, secondaryCoin, setPrimaryCoin, setSecondaryCoin, pairs, currencyData }) => {
  return (
    <>
      <div className="trade-header-info d-flex align-items-center mt-2">
        <div className="dropdown">
          <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            {primaryCoin.symbol}/{secondaryCoin.symbol}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            {pairs.map(pair =>
              <li key={pair} onClick={() => {
                let a = pair.substring(0, pair.length - 4);
                let b = pair.substring(pair.length - 4, pair.length);
                let prim = currencyData?.find((row) => row.symbol == a);
                let sec = currencyData?.find((row) => row.symbol == b);
                setPrimaryCoin(prim);
                setSecondaryCoin(sec);
                window.history.pushState("", "", '/trade-spot/' + pair);
              }}>
                <a className="dropdown-item">{pair}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TradePriceWidget;
