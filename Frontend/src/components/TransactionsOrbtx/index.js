import React, { useEffect, useState } from "react";
import Trans from "../../assets/images/transactions-icon.svg";
import Tether from "../../assets/images/tether.svg";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getInternalOrders } from '../../redux/internalOrder/internalOrderActions';
import { getDeposits, getWithdraws } from '../../redux/externalTransactions/externalTransactionActions';
import DataTable, { createTheme } from "react-data-table-component";
import { getCurrency } from "../../redux/currencies/currencyActions";
import ETH from '../../assets/images/ETH.svg';
import CNF from '../../assets/images/CoinNotFound.png';
import USDT from '../../assets/images/USDT.png';
import BTC from '../../assets/images/BTC.svg';
import LTC from '../../assets/images/LTC.svg';
import ADA from '../../assets/images/cardano.svg';
import TRX from '../../assets/images/tron.svg';
import BCH from '../../assets/images/BCH.svg';
import DOGE from '../../assets/images/DOGE.svg';
import BNB from '../../assets/images/BNB.svg';
import AVAX from '../../assets/images/AVAX.svg';
import USDC from '../../assets/images/USDC.svg';
import LINK from '../../assets/images/chainlink.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import CopyToClipboard from "react-copy-to-clipboard";
import SC from '../../assets/images/successfully-copied.svg';

const Index = () => {

  createTheme(
    "solarizedd",
    {
      text: {
        primary: "#fff",
        secondary: "#fff",
      },
      background: {
        default: "#0c0d14",
      },
      context: {
        background: "#0c0d14",
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

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?._id);
  const orders = useSelector((state) => state.internalOrders?.orders?.userOrders);
  const withdraws = useSelector((state) => state.externalTransactions?.withdraws?.withdraws);
  const deposits = useSelector((state) => state.externalTransactions?.deposits?.deposits);
  const currencies = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const [transactions, setTransactions] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [displayMessage, setDisplayMessage] = useState(false);

  useEffect(() => {
    dispatch(getCurrency());
    if (userId) {
      dispatch(getInternalOrders(userId));
      dispatch(getDeposits(userId))
      dispatch(getWithdraws(userId))
    }
  }, [userId])

  useEffect(() => {
    if (orders && withdraws && deposits) {
      const combineData = [...orders, ...withdraws, ...deposits];
      setTransactions(combineData)
    }
  }, [orders, withdraws, deposits])

  useEffect(() => {
    if (transactions && transactions.length) {
      let dataArr = [];
      transactions.filter(row => row.isResolved).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }).map(row => {
        if (row.txHash) {
          let thisCoin = currencies.find(co => co.symbol == row.currency)
          if (thisCoin) {
            if (row.transactionType == 0) // Check if withdraw or deposit
              dataArr.push({
                symbol: row?.currency, coin: thisCoin?.name, color: thisCoin?.color, amount: row?.amount, sign: '+', type: 1, category: 'Deposit',
                txHash: row.txHash, fromAddress: row.fromAddress, toAddress: row.toAddress, date: row.createdAt
              })
            else
              dataArr.push({
                symbol: row?.currency, coin: thisCoin?.name, color: thisCoin?.color, amount: row?.amount, sign: '-', type: 1, category: 'Withdraw',
                txHash: row.txHash, fromAddress: row.fromAddress, toAddress: row.toAddress, date: row.createdAt
              })
          }
        }
        else {
          dataArr.push({
            symbol: row.toCurrency.symbol, coin: row.toCurrency.name, color: row.toCurrency?.color, amount: row.convertedAmount, sign: '+', type: 2, category: 'Conversion',
            otherCoin: row.fromCurrency.name, otherAmount: row.fromAmount, rate: row.conversionRate, date: row.createdAt
          })
          dataArr.push({
            symbol: row.fromCurrency.symbol, coin: row.fromCurrency.name, color: row.fromCurrency?.color, amount: row.fromAmount, sign: '-', type: 2, category: 'Conversion',
            otherCoin: row.toCurrency.name, otherAmount: row.convertedAmount, rate: row.conversionRate, date: row.createdAt
          })
        }
      })
      if (currencyFilter == "" && typeFilter == "")
        setDisplayData(dataArr)
      else
        setDisplayData(currencyFilter !== "" ? (typeFilter !== "" ? dataArr.filter(c => c.symbol == currencyFilter).filter(c => c.category == typeFilter) : dataArr.filter(c => c.symbol == currencyFilter)) : typeFilter !== "" ? dataArr.filter(c => c.category == typeFilter) : dataArr)
    }
  }, [transactions, currencyFilter, typeFilter])

  const getCoinImg = (name) => {
    if (name == 'ETH')
      return ETH
    if (name == 'BTC')
      return BTC
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

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const copyTxtHash = async () => {
    setDisplayMessage(true)
    await delay(5000);
    setDisplayMessage(false)
  }

  const columns = [
    {
      selector: (row) => {
        return (
          <>
            <Accordion>
              <Accordion.Item className="transcations-accord-item mb-2" eventKey="1">
                <Accordion.Header>
                  <div className="transcations-accord-content">
                    <div className="content">
                      <div>
                        <img src={getCoinImg(row.symbol)} alt="" className="img-fluid" />
                      </div>
                      <div className="ms-2">
                        <h5 className="text-white">{row.coin}</h5>
                        <p className="m-0 text-white-light text-start">{row.symbol}</p>
                      </div>
                    </div>

                    <div className="text-white dd-icon d-flex align-items-center">
                      <h5 className="m-0" style={{ color: row?.color }}>{row.sign} {parseFloat(row.amount).toFixed(2)} {row.symbol}</h5>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  {row.type == 1 ?
                    <div className="accordion-content">
                      <p className="mb-0" style={{ color: row?.color }}>{row?.category}</p>
                      <div className="accordion-content-activity">
                        <div className="activity">
                          <p className="text-white-light">Date</p>
                          <p className="mb-0">{row?.date.replace('T', ' ').replace('Z', ' ')}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light">Transaction ID</p>
                          <p className="mb-0" style={{ color: row?.color }}>{row?.txHash}
                            <CopyToClipboard text={row?.txHash} >
                              <FontAwesomeIcon className="text-white ms-3" icon={faCopy} onClick={() => copyTxtHash()} />
                            </CopyToClipboard>
                          </p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light">Amount</p>
                          <p className="text-light mb-0">{row.sign} {parseFloat(row.amount).toFixed(2)} {row.symbol}</p>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="accordion-content">
                      <p className="mb-0" style={{ color: row?.color }}>{row?.category}</p>
                      <div className="accordion-content-activity">
                        <div className="activity">
                          <p className="text-white-light">Date</p>
                          <p className="mb-0">{row?.date.replace('T', ' ').replace('Z', ' ')}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light">Amount</p>
                          <p className="text-light mb-0">{row.sign} {parseFloat(row.amount).toFixed(2)} {row.symbol}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light"> From </p>
                          <p className="text-light mb-0">{row.sign == '-' ? row.coin : row.otherCoin}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light"> To </p>
                          <p className="text-light mb-0">{row.sign == '-' ? row.otherCoin : row.coin}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light"> Conversion Rate </p>
                          <p className="text-light mb-0">{row.rate}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light"> Total </p>
                          <p className="text-light mb-0">{row.otherCoin}: {row.sign == '-' ? '+' : '-'} {row.otherAmount}</p>
                        </div>
                      </div>
                    </div>
                  }
                  {displayMessage ? <p className="successfully-copied"><img src={SC} alt="" className="img-fluid" /> Successfully Copied!</p> : ""}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
        );
      },
    }
  ];

  return (
    <>
      <section className="header-padding">
        <div className="transactions-page padding50">
          <div className="container-fluid">
            <div className="d-flex align-items-center transactions-heading-div">
              <h1 className="text-white transactions-heading">Transactions</h1>
              <img src={Trans} alt="" className="img-fluid transactions-icon" />
            </div>
            <div className="transactions-btns">
              <button type="button" className="btn">
                TYPE
              </button>
              <button type="button" className="btn">
                PAIR
              </button>
              <button type="button" className="btn">
                NOTE
              </button>
              <button type="button" className="btn">
                STATUS
              </button>
              <button type="button" style={{ border: "0" }} className="btn">
                AMOUNT
              </button>
            </div>
            <div className="all-assets-types mb-4">
              <div className="dropdown all-assets-dd">
                <button
                  className="btn text-white dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  All assets
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a className="dropdown-item" onClick={() => setCurrencyFilter("")}>All</a>
                  </li>
                  {currencies && currencies.map((currency) => {
                    return (
                      <li>
                        <a className="dropdown-item" onClick={() => setCurrencyFilter(currency.symbol)}>
                          {<img src={getCoinImg(currency.symbol)} alt="" className="img-fluid pe-1" height={25} width={25} />}{currency?.name}
                        </a>
                      </li>
                    )
                  })}

                </ul>
              </div>
              <div className="dropdown all-types-dd ms-2">
                <button
                  className="btn text-white dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  All Types
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a className="dropdown-item" onClick={() => setTypeFilter('')}>All</a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={() => setTypeFilter('Deposit')}>Deposits</a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={() => setTypeFilter('Withdraw')}>Withdraws</a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={() => setTypeFilter('Conversion')}>Conversions</a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <DataTable
                columns={columns}
                data={displayData}
                pagination
                className="transactions-datatable"
                persistTableHead
                theme="solarizedd"
              />
            </div>
          </div>
          <div className="batton connect-device batton-opacity"></div>
        </div>
      </section>
    </>
  );
};

export default Index;