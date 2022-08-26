import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { getUserDetails } from "../../redux/users/userActions";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClone } from "@fortawesome/free-solid-svg-icons";
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import DataTable from 'react-data-table-component';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from 'sweetalert2';

const UserDetail = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  let { id } = useParams();

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.users?.user);
  const internalTransactions = useSelector((state) => state.users?.user?.internalTransaction);
  const deposits = useSelector((state) => state.users?.user?.externalTransactions?.filter(row => row.transactionType != true));
  const withdraws = useSelector((state) => state.users?.user?.externalTransactions?.filter(row => row.transactionType == true));
  const history = useHistory();
  const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
  const amounts = useSelector((state) => state.users?.user?.account?.amounts);

  useEffect(() => {
    dispatch(showAllCurrencies());
    dispatch(getUserDetails(id));
  }, []);

  useEffect(() => {
    setLoader(true);
    setUser(userData);
    if (userData) { setLoader(false) }
  }, [userData]);

  const copyReferral = () => {
    Swal.fire({
      text: 'Successfully copied!',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK',
    })
  }

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
  }

  const formatDate = (date) => {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  const depositColumns = [
    {
      name: 'Received At',
      selector: row => formatDate(new Date(row?.createdAt)),
      sortable: true,
    },
    {
      name: 'Asset',
      selector: row => row?.currency,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: row => row?.amount,
      sortable: true,
    },
    {
      name: 'Deposited From',
      selector: row => {
        return (
          <>
            <CopyToClipboard text={row?.fromAddress} className="text-black">
              <span>
                {row?.fromAddress.slice(0, 4)}...{row?.fromAddress.slice(row?.fromAddress.length - 4, row?.fromAddress.length)}
                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
              </span>
            </CopyToClipboard>
          </>
        );
      },
    },
    {
      name: 'Deposit Wallet',
      selector: row => {
        return (
          <>
            <CopyToClipboard text={row?.toAddress} className="text-black">
              <span>
                {row?.toAddress.slice(0, 4)}...{row?.toAddress.slice(row?.toAddress.length - 4, row?.toAddress.length)}
                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
              </span>
            </CopyToClipboard>
          </>
        );
      },
    },
    {
      name: 'TxID',
      selector: row => {
        return (
          <>
            <CopyToClipboard text={row?.txHash} className="text-black">
              <span>
                {row?.txHash.slice(0, 4)}...{row?.txHash.slice(row?.txHash.length - 4, row?.txHash.length)}
                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
              </span>
            </CopyToClipboard>
          </>
        );
      },
    },
    {
      name: 'Status',
      selector: row => {
        return (
          <>
            {row?.isResolved == 0 ?
              <span class="badge rounded-pill bg-warning">Pending</span>
              :
              <span class="badge rounded-pill bg-success">Completed</span>
            }
          </>
        );
      },
    }
  ]

  const withdrawColumns = [
    {
      name: 'Withdrawn At',
      selector: row => formatDate(new Date(row?.createdAt)),
      sortable: true,
    },
    {
      name: 'Asset',
      selector: row => row?.currency,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: row => row?.amount,
      sortable: true,
    },
    {
      name: 'Withdraw Wallet',
      selector: row => {
        return (
          <>
            <CopyToClipboard text={row?.toAddress} className="text-black">
              <span>
                {row?.toAddress.slice(0, 4)}...{row?.toAddress.slice(row?.toAddress.length - 4, row?.toAddress.length)}
                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
              </span>
            </CopyToClipboard>
          </>
        );
      },
    },
    {
      name: 'TxID',
      selector: row => {
        return (
          <>
            <CopyToClipboard text={row?.txHash} className="text-black">
              <span>
                {row?.txHash.slice(0, 4)}...{row?.txHash.slice(row?.txHash.length - 4, row?.txHash.length)}
                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
              </span>
            </CopyToClipboard>
          </>
        );
      },
    },
    {
      name: 'Status',
      selector: row => {
        return (
          <>
            {row?.isResolved == 0 ?
              <span class="badge rounded-pill bg-warning">Pending</span>
              :
              <span class="badge rounded-pill bg-success">Completed</span>
            }
          </>
        );
      },
    }
  ]

  const ordersColumns = [
    {
      name: 'Order Coin',
      selector: row => row?.fromCurrency?.symbol,
      sortable: true,
    },
    {
      name: 'Order Amount',
      selector: row => row?.fromAmount,
      sortable: true,
    },
    {
      name: 'Converted Coin',
      selector: row => row?.toCurrency?.symbol,
      sortable: true,
    },
    {
      name: 'Converted Amount',
      selector: row => row?.convertedAmount,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => {
        return (
          <>
            {row?.isResolved == 0 ?
              <span class="badge rounded-pill bg-warning">Pending</span>
              :
              <span class="badge rounded-pill bg-success">Completed</span>
            }
          </>
        );
      },
    },
    {
      name: 'Ordered At',
      selector: row => formatDate(new Date(row?.createdAt)),
      sortable: true,
    }
  ]

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const subHeaderComponentMemo = useMemo(() => {

    return (
      <>
        <input
          id="search"
          type="text"
          className='w-25 form-control'
          placeholder="Search here..."
          aria-label="Search Input"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
        <button type="button" className='btn btn-primary' onClick={handleClear}>Clear</button>
      </>
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <>
      {loader ? (<FullPageLoader />) : user && user ? (
        <>
          {/* <div className="col-lg-9 col-md-8"> */}
          <div className="content-wrapper right-content-wrapper">
            <div className="content-box">
              <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
              <h5>User Information</h5>
              <form>
                <div className="row">
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.firstName}
                      disabled
                    />
                  </div>
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.lastName}
                      disabled
                    />
                  </div>
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">User Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.username}
                      disabled
                    />
                  </div>
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user.email}
                      disabled
                    />
                  </div>
                  {/* <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Mobile</label>
                    <input
                      type="text"
                      className="form-control"
                      value="49237498234"
                      disabled
                    />
                  </div> */}
                  {/* <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Partner Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value="partner name"
                      disabled
                    />
                  </div> */}
                  {user.ref && user.ref.refererId ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">Referrer Id</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user.ref.refererId}
                        disabled
                      />
                    </div>
                    : null
                  }
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">
                      Registration Channel
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value="Web"
                      disabled
                    />
                  </div>
                  {user.referals && user.referals.length ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">Invitation Count</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user.referals.length}
                        disabled
                      />
                    </div>
                    : null
                  }
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Registration Time</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formatDate(new Date(user?.createdAt))}
                      disabled
                    />
                  </div>
                  {user.verifiedAt ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">Activation Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatDate(new Date(user.verifiedAt))}
                        disabled
                      />
                    </div>
                    : null
                  }
                  {deposits && deposits.length ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">
                        First Crypto Deposit Time
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatDate(new Date(deposits[0]?.createdAt))}
                        disabled
                      />
                    </div>
                    : null
                  }
                  {deposits && deposits.length ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">
                        Last Crypto Deposit Time
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatDate(new Date(deposits[deposits.length - 1]?.createdAt))}
                        disabled
                      />
                    </div>
                    : null
                  }
                  {withdraws && withdraws.length ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">
                        First Crypto Withdraw Time
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatDate(new Date(withdraws[0]?.createdAt))}
                        disabled
                      />
                    </div>
                    : null
                  }
                  {withdraws && withdraws.length ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">
                        Last Crypto Withdraw Time
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatDate(new Date(withdraws[withdraws.length - 1]?.createdAt))}
                        disabled
                      />
                    </div>
                    : null
                  }
                  {internalTransactions && internalTransactions.length ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">First Trading Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatDate(new Date(internalTransactions[0]?.createdAt))}
                        disabled
                      />
                    </div>
                    : null
                  }
                  {internalTransactions && internalTransactions.length ?
                    <div className="form-group col-md-4 mt-2">
                      <label className="control-label">Last Trading Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatDate(new Date(internalTransactions[internalTransactions.length - 1]?.createdAt))}
                        disabled
                      />
                    </div>
                    : null
                  }
                  {/* <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Withdrawal status</label>
                    <input
                      type="text"
                      className="form-control"
                      value="Normal"
                      disabled
                    />
                  </div>
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Trade Status</label>
                    <input
                      type="text"
                      className="form-control"
                      value="Normal"
                      disabled
                    />
                  </div>
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">
                      Internal Transferring Status
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value="Normal"
                      disabled
                    />
                  </div> */}
                </div>
                <br />
              </form>
              <br />
              <div>
                <ul className="nav nav-tabs" id="myTab">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      data-bs-toggle="tab"
                      to="#assetInfo"
                    >
                      Asset Information
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#deposits"
                    >
                      Crypto Deposits
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#withdraws"
                    >
                      Crypto WithDrawals
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#activeOrder"
                    >
                      Active Order
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#orderList"
                    >
                      Order List
                    </Link>
                  </li>
                </ul>
                <br />
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="assetInfo">
                    <h5> Account Balance </h5>
                    <div className="row">

                      {amounts && amounts.length ?
                        amounts.map(coin =>
                          <>
                            {currencies?.find(row => row._id == coin.currencyId)?.name ?
                              <div key={coin._id} className="form-group col-md-6">
                                <label className="control-label">
                                  {currencies?.find(row => row._id == coin.currencyId)?.name}({currencies?.find(row => row._id == coin.currencyId)?.symbol})
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={coin.amount}
                                  disabled
                                />
                              </div>
                              : null
                            }
                          </>
                        )
                        :
                        "Empty Wallet"
                      }
                    </div>

                    <br />
                    <div className="d-none">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            data-bs-toggle="tab"
                            to="#spot"
                          >
                            Spot
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#contract"
                          >
                            Contract
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#unitedContract"
                          >
                            United Contract
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#otc"
                          >
                            OTC
                          </Link>
                        </li>
                      </ul>
                      <br />
                      <div className="tab-content" >
                        <div className="tab-pane fade show active" id="spot">
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="1741.61552445"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table mt-3 table">
                              <thead className="table_head">
                                <tr>
                                  <th>Coin</th>
                                  <th>Available</th>
                                  <th>On order</th>
                                  <th>Locked</th>
                                  <th>USDT valuation</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Ether</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade show active"
                          id="contract"
                        >
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="0.00000000"
                                disabled
                              />
                            </div>
                          </div>
                          <br />
                          <ul className="nav nav-tabs">
                            <li className="nav-item">
                              <Link
                                className="nav-link active"
                                data-bs-toggle="tab"
                                to="#usdt"
                              >
                                USDT
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                data-bs-toggle="tab"
                                to="#inverse"
                              >
                                Inverse
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                data-bs-toggle="tab"
                                to="#simulation"
                              >
                                Simulation
                              </Link>
                            </li>
                          </ul>
                          <br />
                          <div className="tab-content">
                            <div
                              className="tab-pane fade show active"
                              id="usdt"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>BTC/USDT</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade show active"
                              id="inverse"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>BTC/USD</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade show active"
                              id="simulation"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Data</td>
                                      <td>Data</td>
                                      <td>Data</td>
                                      <td>Data</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade show active"
                          id="unitedContract"
                        ></div>
                        <div className="tab-pane fade show active" id="otc">
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="0"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table mt-3 table">
                              <thead className="table_head">
                                <tr>
                                  <th>Contract</th>
                                  <th>Available</th>
                                  <th>On Orders</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Data</td>
                                  <td>Data</td>
                                  <td>Data</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tab-pane fade" id="deposits">
                    <div className='table-responsive'>
                      {deposits && deposits.length ?
                        <DataTable
                          columns={depositColumns}
                          data={
                            deposits.filter(row => (row.currency.toLowerCase()?.includes(filterText.toLowerCase()) || row.amount.toLowerCase()?.includes(filterText.toLowerCase()) ||
                              row.fromAddress.toLowerCase()?.includes(filterText.toLowerCase()) || row.toAddress.toLowerCase()?.includes(filterText.toLowerCase()) ||
                              row.txHash.toLowerCase()?.includes(filterText.toLowerCase())))
                          }
                          pagination
                          paginationResetDefaultPage={resetPaginationToggle}
                          subHeader
                          subHeaderComponent={subHeaderComponentMemo}
                          fixedHeader
                          persistTableHead
                        />
                        :
                        <tr >
                          <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                      }
                    </div>
                  </div>

                  <div className="tab-pane fade" id="withdraws">
                    <div className='table-responsive'>
                      {withdraws && withdraws.length ?
                        <DataTable
                          columns={withdrawColumns}
                          data={
                            withdraws.filter(row => (row.currency?.includes(filterText) || row.amount.toLowerCase()?.includes(filterText.toLowerCase()) ||
                              row.fromAddress?.includes(filterText) || row.toAddress?.includes(filterText) || row.txHash?.includes(filterText)))
                          }
                          pagination
                          paginationResetDefaultPage={resetPaginationToggle}
                          subHeader
                          subHeaderComponent={subHeaderComponentMemo}
                          fixedHeader
                          persistTableHead
                        />
                        :
                        <tr >
                          <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                      }
                    </div>
                  </div>

                  <div className="tab-pane fade" id="activeOrder">
                    <div className='table-responsive'>
                      {internalTransactions && internalTransactions.filter(row => row.isResolved == false).length ?
                        <DataTable
                          columns={ordersColumns}
                          data={filterText == '' ? internalTransactions.filter(row => row.isResolved == false) : internalTransactions.filter(row => row.isResolved == false).filter(row => (row.fromCurrency.symbol.toLowerCase()?.includes(filterText.toLowerCase()) || row.toCurrency.symbol.toLowerCase()?.includes(filterText.toLowerCase())))}
                          pagination
                          paginationResetDefaultPage={resetPaginationToggle}
                          subHeader
                          subHeaderComponent={subHeaderComponentMemo}
                          fixedHeader
                          persistTableHead
                        />
                        :
                        <tr >
                          <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                      }
                    </div>
                  </div>

                  <div className="tab-pane fade" id="orderList">
                    <div className='table-responsive'>
                      {internalTransactions && internalTransactions.filter(row => row.isResolved != false).length ?
                        <DataTable
                          columns={ordersColumns}
                          data={
                            filterText == '' ? internalTransactions.filter(row => row.isResolved != false) :
                              internalTransactions.filter(row => row.isResolved != false).filter(row => (row.fromCurrency?.symbol.toLowerCase()?.includes(filterText.toLowerCase()) ||
                                row.toCurrency?.symbol.toLowerCase()?.includes(filterText.toLowerCase())))
                          }
                          pagination
                          paginationResetDefaultPage={resetPaginationToggle}
                          subHeader
                          subHeaderComponent={subHeaderComponentMemo}
                          fixedHeader
                          persistTableHead
                        />
                        :
                        <tr >
                          <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}
        </>
      ) : ("")
      }
    </>
  );
};

export default UserDetail;
