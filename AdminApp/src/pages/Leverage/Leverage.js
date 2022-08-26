import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { deleteLeverage, displayLeverage, getLeverageByCurrency } from '../../redux/leverage/leverageActions';
import { getRole } from '../../redux/roles/roleActions';
import { getPermission } from "../../config/helpers";
import Swal from 'sweetalert2';
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import Select from 'react-select';

var currenciesOptions = [];
const Leverage = () => {

   const dispatch = useDispatch();
   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const leverageDta = useSelector(state => state.leverages?.leverage?.leverages);
   const [loader, setLoader] = useState(false);
   const [selectedCurrency, setSelectedCurrency] = useState(null);

   const roleData = useSelector(state => state.role.role);
   const permissions = roleData[0]?.permissions;
   const permissionName = getPermission(permissions);

   const success = useSelector(state => state.leverages?.success);
   const fetched = useSelector(state => state.leverages?.fetched);

   useEffect(() => {
      dispatch(showAllCurrencies());
   }, []);

   useEffect(() => {
      setLoader(true);

      currenciesOptions = currencies?.filter(curr => curr.symbol != 'USDT').map(curr => { return { value: curr._id, label: `${curr.symbol}USDT` } });

      if (currenciesOptions && currenciesOptions.length > 0 && (!leverageDta || leverageDta?.length < 0)) {
         setSelectedCurrency(currenciesOptions?.[0]);
         dispatch(getLeverageByCurrency(currenciesOptions?.[0]?.value));
      }
      else {
         const currFetchedCurrency = leverageDta?.[0].sourceCurrency;
         setSelectedCurrency({ value: currFetchedCurrency?._id, label: `${currFetchedCurrency?.symbol}USDT` });
      }

      if (fetched)
         setLoader(false)
   }, [currencies, success, fetched]);

   // useEffect(() => {
   //    setLoader(true)
   //    dispatch(displayLeverage());
   //    if (fetched)
   //       setLoader(false)
   // }, [success, fetched]);

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      dispatch(getRole(id));
   }, [leverageDta]);

   const handleCurrencyChange = (selectedCurr) => {
      setSelectedCurrency(selectedCurr);
      dispatch(getLeverageByCurrency(selectedCurr.value));
   }

   const deleteAction = (id) => {
      Swal.fire({
         title: `Are you sure you want to Delete?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            dispatch(deleteLeverage(id))
         }
      })
   }

   return (
      <>
         {loader ? <FullPageLoader /> :
            <div className="col-lg-9 col-md-8">
               <div className="content-wrapper">
                  <div className="content-box">
                     <h3>Leverage & Margin</h3>
                     <div className="row">
                        <div className="form-group col-md-6">
                           <label className="control-label">Select PAIR</label>
                           <Select
                              value={selectedCurrency}
                              onChange={handleCurrencyChange}
                              options={currenciesOptions}
                           />
                        </div>
                        {
                           permissionName && permissionName.length > 0 && permissionName.includes('set_leverage') ?
                              <div className="form-group col-md-6" style={{ textAlign: 'right' }}>
                                 <Link to='/admin/set-leverage'><button className="btn-default hvr-bounce-in nav-button">Add Leverage</button></Link>
                              </div>
                              :
                              null
                        }
                     </div>

                     <Table responsive>
                        <thead>
                           <tr>
                              <th>Tier</th>
                              {/* <th>Currency PAIR</th> */}
                              {/* <th>Destination Currency</th> */}
                              <th title='Your position notional value include both long and short positions.'>Position Bracket (Notional Value in USDT)</th>
                              <th>Max Leverage</th>
                              <th>Maintenance Margin Rate</th>
                              <th>Maintenance Amount</th>
                              <th>Leverage Fee</th>
                              {
                                 permissionName && permissionName.length > 0 && permissionName.includes('edit_leverage', 'delete_leverage') ?
                                    <th>Action(s)</th>
                                    :
                                    null
                              }
                           </tr>
                        </thead>
                        <tbody>
                           {leverageDta && leverageDta.length > 0 && leverageDta.map((leverage, i) => {
                              return (
                                 <tr key={leverage._id}>
                                    <td>{i + 1}</td>
                                    {/* <td>{`${leverage.sourceCurrency?.symbol}USDT`}</td> */}
                                    {/* <td>{leverage.destinationCurrency?.symbol}</td> */}
                                    <td>{leverage.fromAmount.toLocaleString()} - {leverage.toAmount ? leverage.toAmount?.toLocaleString() : 'unlimited'}</td>
                                    <td>{leverage.leverage}x</td>
                                    <td>{leverage.maintenanceMR.toFixed(2)}%</td>
                                    <td>{leverage.maintenanceAmount.toLocaleString()}</td>
                                    <td>{leverage.leverageFee}</td>
                                    <td>
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('edit_leverage') ?
                                             <Link to={`/admin/edit-leverage/${leverage._id}`} className='btn btn-primary me-2 text-decoration-none text-light'>Edit</Link>
                                             :
                                             null
                                       }
                                       {/* {
                                          permissionName && permissionName.length > 0 && permissionName.includes('delete_leverage') ?
                                             <button className="btn btn-danger me-2" onClick={() => deleteAction(leverage._id)}>Delete</button>
                                             :
                                             null
                                       } */}
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </Table>
                  </div>
               </div>
            </div>
         }
      </>
   )
}

export default Leverage