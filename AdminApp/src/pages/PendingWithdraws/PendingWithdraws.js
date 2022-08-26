import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePermission } from '../../redux/permissions/permissionActions';
import { getRole } from '../../redux/roles/roleActions';
import { getPermission } from '../../config/helpers';
import Swal from 'sweetalert2';
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import DataTable, { createTheme } from 'react-data-table-component';
import { approvePendingTransaction, getPendingWithdraws } from '../../redux/ExternalTransactions/externalTransactionActions';
import { Link } from 'react-router-dom';


createTheme(
   "solarizedd",
   {
     text: {
       primary: "#fff",
       secondary: "#fff",
     },
     background: {
       default: "#374057",
     },
     context: {
       background: "#374057",
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



const PendingWithdraws = () => {

   const dispatch = useDispatch();
   const data = useSelector(state => state.externalTransaction?.pendingWithdraws?.pendingTransactions);
   const success = useSelector(state => state.externalTransaction?.pendingWithdraws?.success);
   const [loader, setLoader] = useState(false);
   const roleData = useSelector(state => state?.role.role);
   const loginPermissions = roleData[0]?.permissions;
   const permissionName = getPermission(loginPermissions);

   const columns = [
      {
         name: 'Amount',
         selector: row => row?.amount,
         sortable: true,
      },
      {
         name: 'Currency',
         selector: row => row?.currency,
         sortable: true,
      },
      {
         name: 'Gas Price',
         selector: row => row?.gasPrice,
         sortable: true,
      },
      {
         name: 'User Name',
         selector: row =>
            <Link to={`/admin/user-detail/${row?.user?._id}`} className='text-decoration-none' >
               {row?.user.username}
            </Link >,
         sortable: true,
      },
      {
         name: 'From Address',
         selector: row => row?.fromAddress,
         sortable: true,
      },
      {
         name: 'To Address',
         selector: row => row?.toAddress,
         sortable: true,
      },
      // {
      //    name: 'TxID',
      //    selector: row => {
      //       return (
      //          <>
      //             {row.txHash?.slice(0, 4)}...{row.txHash?.slice(row?.txHash.length - 4, row?.txHash.length)}
      //          </>
      //       );
      //    },
      // },
      {
         name: 'Action(s)',
         cell: row => {
            return (
               <>
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('approve_pending_transactions') ?
                        <button className="btn btn-success btn-sm" onClick={() => approveAction(row._id)}>Approve</button>
                        :
                        null
                  }
               </>
            );
         },
      }
   ];

   useEffect(() => {
      setLoader(true);
      dispatch(getPendingWithdraws());
      if (success) {
         setLoader(false);
      }
   }, [success]);

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      dispatch(getRole(id));
   }, [])

   const approveAction = (id) => {
      Swal.fire({
         title: `Are you sure want to Approve it?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            dispatch(approvePendingTransaction(id))
         }
      })
   }

   return (
      <>
         {loader ? <FullPageLoader /> :
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Pending Withdraws</h3>
                     <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        fixedHeader
                        persistTableHead
                        highlightOnHover
                        defaultSortFieldId={1}
                        theme="solarizedd"
                     />
                  </div>
               </div>
            {/* </div> */}
            </>
         }
      </>
   )
}

export default PendingWithdraws
