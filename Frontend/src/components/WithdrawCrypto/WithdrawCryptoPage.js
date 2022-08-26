import Overview from "./Overview";
import RecentDeposit from "./RecentDeposit";
import UserWalletAddress from "./UserWalletAddress";
import { React, useEffect, useState } from 'react';
import ETH from '../../assets/images/ETH.svg';
import CNF from '../../assets/images/CoinNotFound.png';
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
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from '../../redux/currencies/currencyActions';
import { getNetwork } from '../../redux/networks/networkActions';
import { getWallets } from '../../redux/addresses/externalWalletActions';
import { getWithdrawFee, resetWithdrawFee } from '../../redux/withdrawFee/withdrawFeeActions';
import { clearWithdraw, submitWithdraw } from '../../redux/externalTransactions/externalTransactionActions';
import GetAccountData from '../shared/GetAccountData';
import { getAccount } from '../../redux/account/accountActions';
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import AddAddress from "./AddAddress";

const WithdrawCryptoPage = () => {

  const { symbol } = useParams();
  const [show, setShow] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseAddr = () => setShowAddAddress(false);
  const handleShowAddr = () => setShowAddAddress(true);

  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [withdrawTo, setWithdrawTo] = useState(1); // 1: Address book , 2: New address
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [haveCoins, setHaveCoins] = useState(0);
  const [withdrawCoins, setWithdrawCoins] = useState(0);
  const [loader, setLoader] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);

  const dispatch = useDispatch();
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const externalWallets = useSelector((state) => state.externalWallets?.externalWallets);
  const networks = useSelector((state) => state.networks?.networks);
  const userId = useSelector((state) => state.user?.user?._id);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const withdrawFee = useSelector((state) => state.withdrawFee?.withdrawFee);
  const withdrawn = useSelector((state) => state.externalTransactions?.withdrawn);
  const error = useSelector((state) => state.externalTransactions?.error);
  const withdrawMsg = useSelector((state) => state.externalTransactions?.transaction?.message);

  useEffect(() => {
    dispatch(getCurrency());
    dispatch(getNetwork());
    if (userId)
      dispatch(getWallets(userId));
  }, [userId]);

  useEffect(() => {
    if (error) {
      setLoader(false)
      dispatch(clearWithdraw());
    }
    else if (withdrawn) {
      setLoader(false)
      Swal.fire({
        title: 'Success',
        text: withdrawMsg,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
      }).then((result) => {
        dispatch(getAccount(userId));
        dispatch(clearWithdraw());
        setSelectedCurrency([])
        handleSelectedCoin(null)
      })
    }
  }, [withdrawn, error])

  useEffect(() => {
    if (currencyData) {
      let found = currencyData?.find(currency => currency.symbol == symbol)
      handleSelectedCoin(found);
    }
  }, [currencyData])

  const handleWithdraw = () => {
    if (parseFloat(withdrawCoins) < parseFloat(withdrawFee?.min) || parseFloat(haveCoins) <= 0) {
      Swal.fire({
        // title: 'Success',
        text: "Cannot Withdraw 0 Amount",
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      })
    } else {
      let data = {
        userId: userId,
        networkId: selectedNetwork?._id,
        currencyId: selectedCurrency?._id,
        sendToAddress: selectedAddress?.address,
        deducted: (parseFloat(withdrawCoins) + parseFloat(withdrawFee?.fee)).toPrecision(8),
        coins: withdrawCoins.toString(),
        gas: withdrawFee?.actualFee
      }
      console.log("data: ", data);
      dispatch(submitWithdraw(data));
      setLoader(true);
    }
  };

  const getWithdrawInfo = (network) => {
    setShowWithdraw(true)
    let data = {
      networkId: network._id,
      currencyId: selectedCurrency?._id
    }
    dispatch(getWithdrawFee(data));
  }

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

  const handleSelectedCoin = (coin) => {
    setSelectedCurrency(coin);
    if (coin)
      setHaveCoins(amounts?.find(row => row.currencyId == coin._id).amount);
    setSelectedNetwork([]);
    setSelectedAddress([]);
    setShowWithdraw(false);
    setWithdrawCoins(0)
    clearWithdrawFee();
  }

  const clearWithdrawFee = () => {
    dispatch(resetWithdrawFee());
  }

  const handleWithdrawLimit = () => {
    var validNumber = new RegExp(/^\d*\.?\d*$/);

    if (!withdrawCoins.toString().match(validNumber) || parseFloat(withdrawCoins) > parseFloat((parseFloat(haveCoins) - withdrawFee?.fee >= 0 ? parseFloat(haveCoins) - withdrawFee?.fee : 0) < withdrawFee?.max ? (parseFloat(haveCoins) - withdrawFee?.fee >= 0 ? parseFloat(haveCoins) - withdrawFee?.fee : 0) : withdrawFee?.max) || parseFloat(withdrawCoins) < parseFloat(withdrawFee?.min)) {
      setWithdrawCoins(0)
      Swal.fire({
        // title: 'Success',
        text: "Invalid number entered. Please enter a valid number",
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      })
    }
  }

  return (
    loader ? <FullPageLoader /> :
      <>
        {/* <Overview />
        <RecentDeposit /> */}

        <section className="header-padding withdrawal-page">
          <GetAccountData />

          <div className="container-fluid custom-box padding50">
            <div className="d-flex justify-content-center align-items-center flex-md-row flex-column">
              <div className="d-flex align-items-center mb-lg-0 mb-3">
                <i className="fa fa-angle-left me-lg-4 me-3 left-angle"></i>
                <h3 className="mb-0 text-light">WITHDRAWAL</h3>
              </div>
            </div>
            <div className="row pt-4">
              <div className="col-md-8">
                <div className="deposit-col">
                  <div className="deposit-coin">
                    <h2>Coin</h2>
                    <div className="dropdown deposit-dropdown">
                      <button
                        className="btn dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="d-flex justify-content-between">
                          <p className="coin-name">{selectedCurrency?.symbol ? selectedCurrency?.symbol : symbol}</p>
                          <div className="coin-details d-flex align-items-center">
                            <p className="detail">({selectedCurrency?.name ? selectedCurrency?.name : 'Select'})</p>
                            <p className="dd-arrow"></p>
                          </div>
                        </div>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        {currencyData && currencyData.length > 0 && currencyData.length ?
                          currencyData && currencyData.length > 0 && currencyData.map((currency) => (
                            <li key={currency._id} onClick={() => handleSelectedCoin(currency)}>
                              <a className="dropdown-item" onClick={() => { handleSelectedCoin(currency) }}>
                                <img src={getCoinImg(currency?.symbol)} alt="" className="img-fluid coin-img pe-1" />
                                {currency.name}
                              </a>
                            </li>
                          ))
                          : <p className='text-light'> No Currencies found! </p>
                        }
                      </ul>
                    </div>

                    <div className="chain-type">
                      <h2>Chain Type</h2>
                      <div className="deposit-selected-coin d-flex align-items-center">
                        {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency?._id)).length ?
                          networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency?._id)).map((network) => (
                            <p key={network._id} className={selectedNetwork && selectedNetwork.symbol == network.symbol ? "" : "non-active"} onClick={() => { clearWithdrawFee(); getWithdrawInfo(network); setSelectedNetwork(network) }}>
                              {network.name}
                            </p>
                          ))
                          : <b className='text-light'> No Networks found! </b>
                        }
                      </div>
                    </div>

                    {selectedNetwork && selectedNetwork.name ?
                      showWithdraw && withdrawFee && withdrawFee?.fee ?

                        <>
                          <div className="wallet-address-amount-withdrawal">
                            <div className="wallet-address">
                              <div className="address-add">
                                <p className="mb-0 text-white">Wallet Address</p>
                                <button type="button" onClick={handleShow} className="btn add-address-btn">Add</button>
                              </div>
                              <div className="dropdown wallet-address-dd">
                                <button
                                  className="btn dropdown-toggle"
                                  type="button"
                                  id="dropdownMenuButton1"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  {selectedAddress && selectedAddress.address ?
                                    selectedAddress.name
                                    :
                                    "Select wallet address..."
                                  }

                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                  {externalWallets && externalWallets.filter(wallet => (wallet.networkId == selectedNetwork._id && wallet.currencyId == selectedCurrency?._id)).length ?
                                    externalWallets && externalWallets.filter(wallet => (wallet.networkId == selectedNetwork._id && wallet.currencyId == selectedCurrency?._id)).map(wallet =>
                                      <li>
                                        <a className="dropdown-item" key={wallet._id} onClick={() => setSelectedAddress(wallet)}>
                                          {wallet.name}
                                        </a>
                                      </li>
                                    )
                                    :
                                    <li>
                                      <a className="dropdown-item">No Addresses Added</a>
                                    </li>
                                  }
                                </ul>
                              </div>
                            </div>

                            {selectedAddress && selectedAddress.status ?
                              <>
                                <div className="amount-withdrawal">
                                  <div className="withdrawal-amount">
                                    <p className="mb-0 text-white">Amount Withdrawable</p>
                                    <p className="text-white-light mb-0">
                                      Amount {haveCoins} {selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : ""}
                                    </p>
                                  </div>
                                  <div className="input-all">
                                    <input type="text" max={(parseFloat(haveCoins) - withdrawFee?.fee >= 0 ? parseFloat(haveCoins) - withdrawFee?.fee : 0) < withdrawFee?.max ? (parseFloat(haveCoins) - withdrawFee?.fee >= 0 ? parseFloat(haveCoins) - withdrawFee?.fee : 0) : withdrawFee?.max} min={withdrawFee?.min} onChange={(e) => { setWithdrawCoins(e.target.value) }} onBlur={() => handleWithdrawLimit()} value={withdrawCoins} />
                                    <button type="button" className="btn text-green"
                                      onClick={() => { setWithdrawCoins((parseFloat(haveCoins) - withdrawFee?.fee >= 0 ? parseFloat(haveCoins) - withdrawFee?.fee : 0) < withdrawFee?.max ? (parseFloat(haveCoins) - withdrawFee?.fee >= 0 ? parseFloat(haveCoins) - withdrawFee?.fee : 0) : withdrawFee?.max) }}
                                    >
                                      All
                                    </button>
                                  </div>
                                </div>

                                <div className="transcation-and-amount">
                                  <p>Transaction Fee</p>
                                  <p>{withdrawFee?.fee} {selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : ""}</p>
                                </div>
                              </>
                              : null
                            }
                          </div>

                          {selectedAddress && selectedAddress.status && parseFloat(withdrawCoins) >= withdrawFee?.min ?
                            <button type="button" className="btn enter-btn3" onClick={() => handleShowConfirmation()} disabled={loader}>ENTER</button>
                            : null
                          }

                        </>
                        :
                        <b className="text-white-light">Cannot withdraw this coin and network. Withdraw Fee not Found</b>
                      :
                      null
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="deposit-col">
                  <div className="important-faqs">
                    <h3>Important:</h3>
                    <div className="important-faqs-content">
                      <p>FAQ</p>
                      <p>1</p>
                      <p>
                        Is it safe to deposit and store my cryptocurrencies with
                        Bybit?
                      </p>
                      <p>
                        Yes, it is safe to do so! To maintain a high level of
                        asset security and flexibility, Bybit uses an
                        industry-standard cold wallet to keep your deposited
                        assets safe, and a hot wallet that allows for all-day
                        withdrawals. All withdrawals undergo a strict confirmation
                        procedure and every withdrawal request is manually
                        reviewed by our team daily at 0:00AM, 8:00AM, and 4:00PM
                        UTC. In addition, 100% of our traders' deposit assets are
                        segregated from Bybit's own operating budget for increased
                        financial accountability. If you wish to learn more,
                        please refer to our Terms of Service.
                      </p>
                      <p>2</p>
                      <p>What type of coin deposits does Bybit support?</p>
                      <p>
                        We're constantly working on expanding the types of coin
                        deposits we accept to better suit your needs. Here are the
                        types of coin deposits we currently support: BTC ETH XRP
                        EOS USDT DOGE DOT LTC XLM Note: Each coin must be based
                        and have their transaction hash (TXID) validated on their
                        respective standard blockchains. Depositing a coin type
                        via a blockchain not listed above may result in the
                        permanent loss of your coin. For more info, please refer
                        to Depositing Unsupported Coins Into Your Bybit Account
                      </p>
                      <p>3</p>
                      <p>How do I make a deposit if I don't own coins?</p>
                      <p>There are 3 ways you can do this:</p>
                      <p>
                        Method 1: Convert fiat currencies to cryptocurrencies via
                        our service partners. This service is wholly provided by
                        the respective third-party service providers.
                      </p>
                      <p>
                        Method 2: Search for a reputable online Spot exchange and
                        open an account to purchase cryptocurrencies before
                        transferring them to your Bybit wallet. Please note that
                        most exchanges require you complete a KYC (Know Your
                        Client) process.
                      </p>
                      <p>
                        Method 3: Do Over-the-Counter trading with someone who is
                        willing to sell you Bitcoin via P2P (Peer-to-Peer)
                        transactions. After making the purchase, you can send your
                        Bitcoin to your Bybit wallet. This process eliminates the
                        need to sign up for an account with an exchange but has
                        its own risks too.
                      </p>
                      <p>4</p>
                      <p>Is there a minimum deposit amount for Bybit?</p>
                      <p>
                        No, there are no minimum deposit amounts for Bybit and our
                        users can deposit any amount they like.
                      </p>
                      <p>5</p>
                      <p>I don't see my deposit in my Bybit account. Why?</p>
                      <p>
                        There might be a few reasons for the delay. Here are the
                        major reasons for the respective coins: BTC — Unconfirmed
                        transactions on the blockchain (at least 1 confirmation is
                        needed). ETH — Unconfirmed transactions on the blockchain
                        (at least 30 confirmations are needed), or it could be a
                        Smart Contract transaction that Bybit does not currently
                        support. XRP or EOS — Invalid or missing tag/memo when the
                        deposit was made. USDT — Unconfirmed transaction on the
                        blockchain (1 or 30 or 100 confirmations are needed
                        depending if the deposit was an Omni, ERC-20, or TRC-20
                        transfer).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="batton"></div>
        </section>

        {/* ==================================== confirmation modal ============================== */}

        <Modal Modal className='withdrawal-modal' centered show={showConfirmation} onHide={handleCloseConfirmation} >
          <Modal.Header className='modal-main-heading' closeButton>
            <div className="modal-main-heading-content">
              <h5 className="modal-title" id="exampleModalLabel">ARE YOU SURE?</h5>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="withdrawal-modal1 text-light">
              <p> <b>Sending to Address: </b> <p style={{wordBreak: "break-all"}}>{selectedAddress?.address}</p>  </p>
              <p> <b>Sending: </b> {withdrawCoins} {selectedCurrency?.symbol} </p>
              <p> <b>Transaction Fee: </b> {withdrawFee?.fee} {selectedCurrency?.symbol} </p>
              <p> <b>Deducted from your Wallet: </b> {(parseFloat(withdrawCoins) + parseFloat(withdrawFee?.fee)).toPrecision(8)} {selectedCurrency?.symbol} </p>
              <br />
              <p> <b className='text-danger'>Warning: </b> We will not be responsible if the coins are sent to a wrong address!!! </p>
              <div className='d-flex justify-content-right'>
                <button type="button" className='btn form-btn text-capitalize' onClick={() => { handleWithdraw(); handleCloseConfirmation() }}> YES, Send! </button>
                <button type="button" className='btn btn-danger text-capitalize ms-2' onClick={() => { handleCloseConfirmation() }}> Cancel </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* ==================================== modal 1 ============================== */}

        <Modal className="withdrawal-modal" show={show} onHide={handleClose} centered size="xl">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <div className="withdrawal-modal1">
              <h4 className="text-white mb-0">Addresses</h4>
              <div className="text-end">
                <button type="button" onClick={handleShowAddr} className="btn add-address-btn">Add Address</button>
              </div>
              <br />
              <UserWalletAddress />
            </div>
          </Modal.Body>
        </Modal>

        {/* ==================================== modal 2 =============================== */}

        <Modal className="withdrawal-modal" show={showAddAddress} onHide={handleCloseAddr} centered backdrop="static" size="xl">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <AddAddress handleCloseAddr={handleCloseAddr} />
          </Modal.Body>
        </Modal>

      </>
  );
};

export default WithdrawCryptoPage;
