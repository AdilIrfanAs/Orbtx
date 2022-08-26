import React from "react";
import { Table } from "react-bootstrap";


const Market = (marketChangeAPI) => {

  return (
    <>
      <div className="order-book-market-wrapper trade-sport-market">
        <h5 style={{ paddingBottom: "10px", paddingTop: "10px", background: "rgba(18, 138, 116, 1)", textAlign: "center", fontSize: "16px" }} className="text-white">Market</h5>
        <Table responsive className="trade-table trade-spot-table">
          <thead>
            <tr>
              <th>Pair</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {marketChangeAPI['marketChangeAPI'] && marketChangeAPI['marketChangeAPI'].length ?
              marketChangeAPI['marketChangeAPI'].map((market) => (
                <tr>
                  <td>{market.symbol}</td>
                  <td>{parseFloat(market.volume).toPrecision()}</td>
                  <td>{parseFloat(market.change) < 0 ? <span className="text-red">{parseFloat(market.change).toFixed(2)}</span> : <><span className="text-green">{parseFloat(market.change).toFixed(2)}</span></>}</td>
                </tr>
              ))
              :
              <tr>
                <td colSpan='3'>"No Data found"</td>
              </tr>
            }
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Market;
