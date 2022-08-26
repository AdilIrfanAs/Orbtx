import React, { useState, useEffect } from "react";
import TradeInfo from './TradeInfo';
import { io } from "socket.io-client";

let localOrderBook = []
let futures = []
let futuresCounter = 0
let orderBookCounter = 0

const TradePage = () => {
  const [orderBookAPI, setOrderBookAPI] = useState([]);
  const [futureTradesAPI, setFutureTradesAPI] = useState([]);
  const [pairName, setPairName] = useState('');
  const [socket, setSocket] = useState(null);
  const [currentMarketPrice, setcurrentMarketPrice] = useState(0);
  const [startSocket, setStartSocket] = useState(true)

  const socketURL = "3.129.43.70:4000" // live
  // const socketURL = "http://localhost:4000"; // local

  useEffect(() => {
    if (pairName) {
      if (socket != null) {
        setStartSocket(false)
        socket.disconnect()
        setSocket(io(socketURL, { transports: ['websocket'] }))
        setStartSocket(true)
        localOrderBook = []
        futures = []
        futuresCounter = 0
        orderBookCounter = 0
        setcurrentMarketPrice(0)
        setFutureTradesAPI([])
        setOrderBookAPI([])
      }
    }
  }, [pairName])

  useEffect(() => {
    if (pairName && startSocket) {
      if (socket == null) {
        setSocket(io(socketURL, { transports: ['websocket'] }))
      }

      if (socket) {
        socket.on("connect", () => {
          console.log("Socket id is -->: ", socket.id);
        });

        socket.emit("getBinanceFutureTradesRequest", pairName);
        socket.on("getBinanceFutureTradesRequestError", (response) => {
          console.log(response)
        });
        socket.on("getBinanceFutureTradesRequestResponse" + pairName, (response) => {
          // console.log("futures trade", response)
          futuresCounter++;
          if (futuresCounter % 20 == 0) {
            futures.unshift(response)
            if (futures.length > 20)
              futures = futures.splice(0, 20)
            setFutureTradesAPI(futures)
            futuresCounter = 0
          }
        });

        socket.emit("getCurrentMarketPriceRequest", pairName)
        socket.on("getCurrentMarketPriceResponse" + pairName, (currentMarketPrice) => {
          setcurrentMarketPrice(currentMarketPrice)
        });

        socket.emit("getBinanceMarketDepthRequest", pairName)
        socket.on("getBinanceMarketDepthRequestError", (response) => {
          console.log(response)
        });

        socket.on("getBinanceMarketDepthRequest" + pairName, (response) => {
          // if (orderBookCounter % 20 == 0) {
          if (localOrderBook !== [] && localOrderBook.a?.length && localOrderBook.b?.length) {
            let data = {
              a: (response.a?.filter(row => (parseFloat(row['1']) > 0)).concat(localOrderBook?.a)).splice(0, 15),
              b: (response.b?.filter(row => (parseFloat(row['1']) > 0)).concat(localOrderBook?.b)).splice(0, 15)
            }
            localOrderBook = data
            setOrderBookAPI(data)
          } else {
            let data = {
              a: [...(response.a.filter(row => (parseFloat(row['1']) > 0)))],
              b: [...(response.b.filter(row => (parseFloat(row['1']) > 0)))]
            }
            localOrderBook = data
            setOrderBookAPI(data)
          }
          orderBookCounter = 0
          // }
          // orderBookCounter++;
        });
      }
    }
  }, [socket, pairName]);

  return (
    <>
      <TradeInfo currentMarketPrice={currentMarketPrice} futureTradesAPI={futureTradesAPI} orderBookAPI={orderBookAPI} sendPairtoParent={(pair) => setPairName(pair)} />
    </>
  )
}

export default TradePage