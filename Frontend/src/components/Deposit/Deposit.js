import React, { useState, useEffect } from 'react';
import QrCode from "../../assets/images/qr-codee.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faQuestionCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from '../../redux/currencies/currencyActions';
import { getNetwork } from '../../redux/networks/networkActions';
import { getUserWallet, createUserWallet } from '../../redux/wallet/walletActions';
import GetAccountData from '../shared/GetAccountData';
import QRCode from "react-qr-code";
import Swal from 'sweetalert2';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useParams } from 'react-router-dom';

const Deposit = () => {
  const { symbol } = useParams();
  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState([]);
  const [DepositTo, setDepositTo] = useState('Spot Account');
  const [showWallet, setShowWallet] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const dispatch = useDispatch();
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const networks = useSelector((state) => state.networks?.networks);
  const userId = useSelector((state) => state.user?.user?._id);
  const wallet = useSelector((state) => state.wallet?.wallet);

  const getWalletInfo = (currency) => {
    dispatch(getUserWallet(userId, currency._id));
  }

  const createWallet = () => {
    setIsLoader(true);
    dispatch(createUserWallet(userId, selectedNetwork._id, selectedCurrency._id));
  }

  useEffect(() => {
    dispatch(getCurrency());
    dispatch(getNetwork());
  }, []);


  useEffect(() => {
    console.log("symbol", symbol);
    if (currencyData) {
      let found = currencyData?.find(currency => currency.symbol == symbol)
      setSelectedCurrency(found);
    }
  }, [currencyData])

  const copyReferral = () => {
    Swal.fire({
      text: 'Successfully Copied!',
      icon: 'success'
    }
    )
  }

  return (
    <>
      <GetAccountData />
      <section className="deposit header-padding">
        <div className="container-fluid custom-box padding50">
          <div className="d-flex justify-content-center align-items-center flex-md-row flex-column">
            <div className="d-flex align-items-center mb-lg-0 mb-3">
              <i className="fa fa-angle-left me-lg-4 me-3 left-angle"></i>
              <h3 className="mb-0 text-light">Deposit</h3>
            </div>
          </div>
          <div className="row pt-4">
            <div className="col-md-8">
              <div className="deposit-col">
                <div className="deposit-coin">
                  <h2>Coin</h2>
                  <div className="dropdown deposit-dropdown">
                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                      <div className="d-flex justify-content-between">
                        <p className="coin-name">{selectedCurrency && selectedCurrency.symbol ? selectedCurrency.symbol : "???"}</p>
                        <div className="coin-details d-flex align-items-center">
                          <p className="detail">({selectedCurrency && selectedCurrency.symbol ? selectedCurrency.name : "Select coin"})</p>
                          <p className="dd-arrow"></p>
                        </div>
                      </div>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                      {currencyData && currencyData.length > 0 && currencyData.map((currency) => (
                        <li key={currency._id} onClick={() => { setSelectedCurrency(currency); setSelectedNetwork([]); setShowWallet(false); }}>
                          <a className="dropdown-item">
                            <div className="d-items d-flex justify-content-between">
                              <p>{currency.symbol}</p>
                              <p>{currency.name}</p>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selectedCurrency && selectedCurrency.symbol ?
                    <>
                      <h2>Chain Type</h2>
                      <div className="d-flex flex-row">
                        {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).length ?
                          networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).map((network) => (
                            <div key={network._id} className={selectedNetwork && selectedNetwork.symbol == network.symbol ? "deposit-selected-coin" : "deposit-notselected-coin"} onClick={() => { getWalletInfo(selectedCurrency); setSelectedNetwork(network); setShowWallet(true) }}>
                              <p>{network.symbol}</p>
                            </div>
                          ))
                          : <p className='text-light'> No Networks found! </p>
                        }
                      </div>

                        { console.log(showWallet , wallet ) }
                      {showWallet ?
                        wallet && wallet.address ?
                          <div>
                            <div className="code-address-wallet">
                              <div className="qr-image p-5">
                                <QRCode size={200} value={wallet.address} className="img-fluid" />
                              </div>
                              <p className="text-white">Your Wallet Address</p>
                              <div className="address-wallet d-flex justify-content-between align-items-center text-white">
                                <p className='me-3'>{wallet.address}</p>
                                <CopyToClipboard text={wallet.address}>
                                  <FontAwesomeIcon icon={faCopy} onClick={() => copyReferral()} />
                                </CopyToClipboard>
                              </div>
                            </div>
                          </div>
                          :
                          <div className="inline-block">
                            {isLoader ?
                              <a className="btn w-100 form-btn text-capitalize mt-5"><FontAwesomeIcon icon={faSpinner} className="fa-spin" /></a>
                              :
                              <a onClick={() => createWallet()} className="btn w-100 form-btn text-capitalize mt-5">Create Wallet</a>
                            }
                          </div>
                        : null
                      }
                    </>
                    : null
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
                      Orbtx?
                    </p>
                    <p>
                      Yes, it is safe to do so! To maintain a high level of
                      asset security and flexibility, Orbtx uses an
                      industry-standard cold wallet to keep your deposited
                      assets safe, and a hot wallet that allows for all-day
                      withdrawals. All withdrawals undergo a strict confirmation
                      procedure and every withdrawal request is manually
                      reviewed by our team daily at 0:00AM, 8:00AM, and 4:00PM
                      UTC. In addition, 100% of our traders' deposit assets are
                      segregated from Orbtx's own operating budget for increased
                      financial accountability. If you wish to learn more,
                      please refer to our Terms of Service.
                    </p>
                    <p>2</p>
                    <p>What type of coin deposits does Orbtx support?</p>
                    <p>
                      We're constantly working on expanding the types of coin
                      deposits we accept to better suit your needs. Here are the
                      types of coin deposits we currently support: BTC ETH XRP
                      EOS USDT DOGE DOT LTC XLM Note: Each coin must be based
                      and have their transaction hash (TXID) validated on their
                      respective standard blockchains. Depositing a coin type
                      via a blockchain not listed above may result in the
                      permanent loss of your coin. For more info, please refer
                      to Depositing Unsupported Coins Into Your Orbtx Account
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
                      transferring them to your Orbtx wallet. Please note that
                      most exchanges require you complete a KYC (Know Your
                      Client) process.
                    </p>
                    <p>
                      Method 3: Do Over-the-Counter trading with someone who is
                      willing to sell you Bitcoin via P2P (Peer-to-Peer)
                      transactions. After making the purchase, you can send your
                      Bitcoin to your Orbtx wallet. This process eliminates the
                      need to sign up for an account with an exchange but has
                      its own risks too.
                    </p>
                    <p>4</p>
                    <p>Is there a minimum deposit amount for Orbtx?</p>
                    <p>
                      No, there are no minimum deposit amounts for Orbtx and our
                      users can deposit any amount they like.
                    </p>
                    <p>5</p>
                    <p>I don't see my deposit in my Orbtx account. Why?</p>
                    <p>
                      There might be a few reasons for the delay. Here are the
                      major reasons for the respective coins: BTC — Unconfirmed
                      transactions on the blockchain (at least 1 confirmation is
                      needed). ETH — Unconfirmed transactions on the blockchain
                      (at least 30 confirmations are needed), or it could be a
                      Smart Contract transaction that Orbtx does not currently
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
    </>
  );
};

export default Deposit;
