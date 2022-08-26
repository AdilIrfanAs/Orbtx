import React, { useEffect, useState } from "react";
import PortfolioBG from "../../assets/images/portfolio-bg.png";
import WalletSVG from "../../assets/images/portfolio-wallet.svg";
import TimerSVG from "../../assets/images/portfolio-timer.svg";
import DataTable, { createTheme } from "react-data-table-component";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from "../../redux/currencies/currencyActions";
import GetAccountData from "../shared/GetAccountData";
import { getPortfolioCurrencies } from "../../redux/cron/cronActions";
import ETH from '../../assets/images/ETH.svg';
import CNF from '../../assets/images/CoinNotFound.png';
import XRP from '../../assets/images/XRP.png';
import USDT from '../../assets/images/USDT.png';
import BTC from '../../assets/images/BTC.svg';
import LTC from '../../assets/images/LTC.svg';
import ADA from '../../assets/images/ADA.svg';
import TRX from '../../assets/images/TRX.svg';
import BCH from '../../assets/images/BCH.svg';
import DOGE from '../../assets/images/DOGE.svg';
import BNB from '../../assets/images/BNB.svg';
import AVAX from '../../assets/images/AVAX.svg';
import USDC from '../../assets/images/USDC.svg';
import LINK from '../../assets/images/LINK.svg';

const currencyFormatter = require('currency-formatter');


createTheme(
  "solarizedd",
  {
    text: {
      primary: "#fff",
      secondary: "#fff",
    },
    background: {
      default: "#0F1015",
    },
    context: {
      background: "#0F1015",
      text: "#FFFFFF",
    },
    divider: {
      default: "#fff",
    },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.08)",
      disabled: "rgba(0,0,0,.12)",
    },
  },
  "dark"
);

const Index = () => {
  const coins = 'ETH,LINK,AVAX,DOGE,BCH,LTC,TRX,BNB,ADA,USDC,BTC,USDT'
  const [coinData, setCoinData] = useState([])
  const [loader, setLoader] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0)

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?._id);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const portfolioCurrencies = useSelector((state) => state.portfolioCurrencies?.portfolioCurrencies);

  useEffect(() => {
    if (amounts && currencyData) {
      var url = `https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=${coins}&api_key=6f8e04fc1a0c524747940ce7332edd14bfbacac3ef0d10c5c9dcbe34c8ef9913`
      axios.get(url)
        .then(res => {
          let resData = res.data;
          let total = 0
          currencyData.forEach(currency => {
            let sum = parseFloat(parseFloat(resData[currency.symbol]) * parseFloat(amounts?.find(row => row.currencyId == currency._id)?.amount))
            if (!isNaN(sum))
              total += sum
          });
          setTotalAmount(total.toFixed(4))
        })
        .catch(err => console.log("err: ", err))
    }
  }, [amounts, currencyData])

  useEffect(() => {
    dispatch(getCurrency());
    if (coinData) {
      setLoader(false)
    }
  }, [coinData])

  useEffect(() => {
    dispatch(getPortfolioCurrencies());
  }, [])

  const getCoinImg = (name) => {
    if (name == 'ETH')
      return ETH
    if (name == 'BTC')
      return BTC
    if (name == 'XRP')
      return XRP
    if (name == 'USDT')
      return USDT
    if (name == 'LTC')
      return LTC
    if (name == 'DOGE')
      return DOGE
    if (name == 'ADA')
      return ADA
    if (name == 'TRX')
      return TRX
    if (name == 'BCH')
      return BCH
    if (name == 'BNB')
      return BNB
    if (name == 'AVAX')
      return AVAX
    if (name == 'USDC')
      return USDC
    if (name == 'LINK')
      return LINK
    return CNF
  }

  const depositColumns = [
    {
      name: "ASSET NAME",
      selector: (row) => row?.name,
      cell: (row) => {
        return (
          <Link className="portfilio-link" to={'/activity/' + row?.symbol}>
            <div className="portfolio-coin d-flex align-items-center">
              <img src={getCoinImg(row?.symbol)} alt="btc" className="img-fluid me-2 coin-img p-2" />
              <div>
                <p className="name m-0">{row?.name}</p>
                <p className="symbol m-0 text-white-light">{row?.symbol}</p>
              </div>
            </div>
          </Link>
        );
      },
      sortable: true,
    },
    {
      name: "PRICE",
      selector: (row) => row?.price,
      cell: (row) => {
        return (
          <Link className="portfilio-link" to={'/activity/' + row?.symbol}>
            {"$ " + row?.price}
          </Link>
        );
      },
      sortable: true,
    },
    {
      name: "24H CHANGE",
      selector: (row) => row['1d']?.price_change ? row['1d']?.price_change : "0",
      cell: (row) => {
        return (
          <Link className={row['1d']?.price_change < 0 ? "text-danger" : "text-success"} to={'/activity/' + row?.symbol}>
            {"$ " + (row['1d']?.price_change ? row['1d']?.price_change : "0")}
          </Link>
        );
      },
      sortable: true,
    },
    {
      name: "30 DAY TREND",
      selector: (row) => row['30d']?.price_change ? row['30d']?.price_change : '0',
      cell: (row) => {
        return (
          <Link className={row['30d']?.price_change < 0 ? "text-danger" : "text-success"} to={'/activity/' + row?.symbol}>
            {"$ " + (row['30d']?.price_change ? row['30d']?.price_change : '0')}
          </Link>
        );
      },
      sortable: true,
    },
    {
      name: "BALANCE",
      selector: (row) => row?.market_cap ? row?.market_cap : "0",
      cell: (row) => {
        return (
          <Link className="portfilio-link" to={'/activity/' + row?.symbol}>
            {"$ " + (row?.market_cap ? row?.market_cap : "0")}
          </Link>
        );
      },
      sortable: true,
    },
    {
      name: "VALUE",
      selector: (row) => row['1d']?.volume ? row['1d']?.volume : '0',
      cell: (row) => {
        return (
          <Link className="portfilio-link" to={'/activity/' + row?.symbol}>
            {"$ " + (row['1d']?.volume ? row['1d']?.volume : '0')}
          </Link>
        );
      },
      sortable: true,
    },
    {
      name: "PORTFOLIO %",
      selector: (row) => row['1d']?.volume_change_pct ? row['1d']?.volume_change_pct : '0',
      cell: (row) => {
        return (
          <Link className={row['1d']?.volume_change_pct < 0 ? "text-danger" : "text-success"} to={'/activity/' + row?.symbol}>
            {(row['1d']?.volume_change_pct ? row['1d']?.volume_change_pct : '0') + " %"}
          </Link>
        );
      },
      sortable: true,
    },
  ];

  const calculateMax = (array) => {
    var max = -2345678654;
    array.forEach(function (item, index) {
      if (parseFloat(item) > max)
        max = parseFloat(item);
    });
    return max;
  }

  const calculateMin = (array) => {
    var min = 123456789098654322113450;
    array.forEach(function (item, index) {
      if (parseFloat(item) < min)
        min = parseFloat(item);
    });
    return min;
  }

  return (
    <>
      {userId ? <GetAccountData /> : null}
      <section className="header-padding">
        <div className="portfolio-page">
          <div className="img-content">
            <div className="portfolio-img">
              <img src={PortfolioBG} alt="" className="img-fluid" />
            </div>
            {totalAmount > 0 ?
              <div className="portfolio-price-box-container">
                <div className="portfolio-price-box">
                  {/* <h1>{parseFloat(totalAmount).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}$</h1> */}
                  <h1>{currencyFormatter.format(parseFloat(totalAmount).toFixed(2), { code: 'USD' })}</h1>
                </div>
              </div>
              :
              <div className="portfolio-content ps-2 pe-2">
                <h2 className="m-0">
                  Welcome to <span style={{ color: "#128A74" }}> COMPANY!</span>
                </h2>
                <div className="portlofio-options">
                  <div className="option">
                    <img src={WalletSVG} alt="" className="img-fluid mb-3" />
                    <p className="mb-2 text-white">
                      Securely manage over 100 cryptocurrencies. Your funds are
                      always under your control.
                    </p>
                    <Link to="/activity/ETH">
                      <button type="button" className="btn">
                        Make Your First Deposit
                      </button>
                    </Link>
                  </div>
                  <div className="option">
                    <img src={TimerSVG} alt="" className="img-fluid mb-3" />
                    <p className="mb-2 text-white">
                      Quickly restore access to your wallet with your secret
                      12-word recovery phrase.
                    </p>
                    <Link to="/backup">
                      <button type="button" className="btn">
                        Restore from Backup
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            }
          </div>
          {/* </div> */}
          <div className="mb-4" style={{ backgroundColor: "#0F1015" }}>
            <div className="portfolio-details">
              <div className="detail">
                <h5 className="mb-2 text-white">24H Change</h5>
                <h3>${Math.max(...portfolioCurrencies.map(o => parseFloat(o['1d']?.price_change ? o['1d']?.price_change : 0))).toFixed(2)} </h3>
              </div>
              <div className="detail">
                <h5 className="mb-2 text-white">Highest Balance</h5>
                <h3>${Math.max(...portfolioCurrencies.map(o => parseFloat(o.market_cap ? o.market_cap : 0))).toFixed(2)}</h3>
              </div>
              <div className="detail">
                <h5 className="mb-2 text-white">Portfolio Age</h5>
                <h3>1 Day</h3>
              </div>
              <div className="detail">
                <h5 className="mb-2 text-white">Best 24H Asset</h5>
                <h3>{calculateMax(portfolioCurrencies.map(o => parseFloat(o['1d']?.price_change)))}</h3>
              </div>
              <div className="detail">
                <h5 className="mb-2 text-white">Worst 24H Asset</h5>
                <h3>{calculateMin(portfolioCurrencies.map(o => parseFloat(o['1d']?.price_change)))}</h3>
              </div>
            </div>
          </div>
          <div className="portfolio-datatable">
            <DataTable
              columns={depositColumns}
              data={portfolioCurrencies}
              pagination
              subHeader
              fixedHeader
              persistTableHead
              theme="solarizedd"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
