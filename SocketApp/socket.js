const express = require("express");
const socket = require("socket.io");
const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  useServerTime: false,
  recvWindow: 2000,
});


// App setup
const PORT = 4000;
const URL = "3.129.43.70"
// const URL = "localhost"
const app = express();

const server = app.listen(PORT, function () {
  console.log(`${URL}:${PORT}`);
});
const coins = ['ETHUSDT', 'LINKUSDT', 'AVAXUSDT', 'DOGEUSDT', 'BCHUSDT', 'LTCUSDT', 'TRXUSDT', 'BNBUSDT', 'ADAUSDT', 'BTCUSDT'];

// Socket setup
const io = socket(server);
io.on("connection", function (socket) {

  console.log("Socket Connected");

  socket.on("getBinanceMarketDepthRequest", function (pairName) {
    binance.websockets.depth(pairName, (depth) => {
      io.emit("getBinanceMarketDepthRequest" + pairName, depth);
    });
  });

  socket.on("getCurrentMarketPriceRequest", function (pairName) {
    binance.futuresMarkPriceStream((responseArray) => {
      let data = responseArray?.filter(responseArrayIndex => coins.includes(responseArrayIndex.symbol))?.map(elem => {
        return {
          "symbol": elem.symbol,
          "markPrice": elem.markPrice
        }
      })
      io.emit("getCurrentMarketPriceResponse" + pairName, data);
    });
  });

  socket.on("getBinanceFutureTradesRequest", function (pairName) {
    binance.websockets.trades(pairName, (trades) => {
      io.emit("getBinanceFutureTradesRequestResponse" + pairName, trades);
    });
  });

  socket.on("getBinanceMarketChangeRequest", function (pairArray) {
    binance.websockets.prevDay(pairArray, (error, response) => {
      if (response && response.symbol && response.volume && response.percentChange) {
        let data = { symbol: response.symbol, volume: response.volume, change: (response.percentChange + "%") }
        io.emit("getBinanceMarketChangeRequestResponse", data);
      } else {
        io.emit("getBinanceMarketChangeRequestError", { stauts: false, msg: "failed to get data from getBinanceMarketChangeRequest" });
      }
    });
  });
});

io.on("disconnect", function (socket) {

  console.log("Disconnected Socket Id: ", socket)
  //   binance.websockets.depth(pairName, (depth) => {
  //     // 1- Add connectedFlat on.Connection and on.disconnected in DB
  //     // 2- Get User orders from DB on the bases of user ID. (Pending and Processing Orders only)
  //     // 3- Sort Socket Data and get Highest Selling rate and Lowest Buying rate
  //     // 4- Compare values with Binance Socket. if it's done, hit the backend function accordingly
  //     // 5- Match ==== Liquidity Price, TPSL, Trailing Stop
  //     // 6- Remove that order from the array of all records.
  //   });
});
