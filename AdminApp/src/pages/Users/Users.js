import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllUsers, deleteUser, editUser, referralsPerId } from '../../redux/users/userActions';
import { getRole } from '../../redux/roles/roleActions';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPermission } from "../../config/helpers";
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import DataTable, { createTheme } from 'react-data-table-component';
import FilterComponent from '../../components/FilterComponent';
import { Form } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';


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

const Users = () => {
   const [roleId, setRoleId] = useState('');
   const [userId, setUserId] = useState('');
   const [loader, setLoader] = useState(false);
   const [filterText, setFilterText] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

   const dispatch = useDispatch();
   const users = useSelector(state => state?.users?.users);
   const referrals = useSelector(state => state);

   const roleData = useSelector(state => state?.role.role);
   const permissions = roleData[0]?.permissions;
   const [type, setType] = useState("0");
   const [all, setAll] = useState("");
   const permissionName = getPermission(permissions);
   const [show, setShow] = useState(true);
   const success = useSelector(state => state.users.success);
   // const fetched = useSelector(state => state.users.fetched);

   const filteredItems = users?.filter(
      (item, index) =>
         item.users.firstName && item.users.firstName.toLowerCase().includes(filterText.toLowerCase()) ||
         item.users.email && item.users.email.toLowerCase().includes(filterText.toLowerCase()) ||
         item.userType && item.userType.toLowerCase().includes(filterText.toLowerCase())
   );

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      setRoleId(id)
      const uid = data?._id
      setUserId(uid)
      dispatch(getRole(id));
   }, [])

   useEffect(() => {
      setLoader(true);
      dispatch(showAllUsers(type, roleId, userId));
      type == "0" ? setShow(true) : setShow(false);
      if (filteredItems) {
         setLoader(false);
      }
   }, [type, success, roleId, userId, filteredItems, all]);

   const userAction = (id, type) => {
      Swal.fire({
         title: `Are you sure you want to ${type && type == "block" ? "block" : "unblock"}?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: `${type && type == "block" ? "Block" : "Unblock"}`
      }).then((result) => {
         if (result.isConfirmed) {
            const data = { status: type && type == "block" ? false : true }
            dispatch(editUser(id, data))
         }
      })
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
            dispatch(deleteUser(id))
         }
      })
   }

   const columns = [
      {
         name: 'UID',
         selector: row => {
            return (
               <>
                  <span data-tip={row?.users._id}>{row?.users._id}</span>
                  <ReactTooltip />
               </>
            )
         }
      },
      // {
      //    name: 'Remark',
      //    selector: row => "-",
      //    sortable: true,
      // },
      // {
      //    name: 'Tag',
      //    selector: row => "-",
      //    sortable: true,
      // },
      {
         name: 'User Name',
         selector: row => row?.users.firstName,
         sortable: true,
      },
      {
         name: 'Email',
         selector: row => {
            return (
               <>
                  <span data-tip={row?.users.email}>{row?.users.email}</span>
                  <ReactTooltip />
               </>
            )
         },
         sortable: true,
      },
      {
         name: 'Referer Name',
         selector: row =>
            row?.referer ?
               <Link to={`/admin/user-detail/${row?.referer?._id}`} className='text-decoration-none' >
                  {row?.referer?.firstName}
               </Link>
               : "-"
         ,
         sortable: true,
      },
      {
         name: 'Type',
         selector: row => row?.userType,
         sortable: true,
      },
      // {
      //    name: 'Trading Type',
      //    selector: row => "Executed",
      //    sortable: true,
      // },
      {
         name: 'Registration Date',
         selector: row => "2022-03-22 08:35:00",
         sortable: true,
      },
      {
         name: 'First Trading Date',
         selector: row => "2022-03-22 08:35:00",
         sortable: true,
      },
      {
         name: 'Action(s)',
         cell: row => {
            return (
               <>
                  <Link to={`/admin/user-detail/${row?.users?._id}`} className='btn btn-success btn-sm me-1 p-1 text-decoration-none text-light'>View</Link>
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('edit_user') ?
                        <Link to={`/admin/edit-user/${row?.users?._id}`} className='btn btn-primary btn-sm me-1 p-1 text-decoration-none text-light'>Edit</Link>
                        :
                        null
                  }
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('delete_user') ?
                        <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => deleteAction(row?.users?._id)}>Delete</button>
                        :
                        null
                  }
                  {/* {
                     permissionName && permissionName.length > 0 && permissionName.includes('block_user') ?
                        <>
                           {row?.users.status == true ?
                              <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => userAction(row?.users?._id, "block")}>Block</button>
                              : <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => userAction(row?.users?._id, "unBlock")}>Unblock</button>
                           }
                        </>
                        :
                        null
                  }
                  {row.refCount >= 0 && row.refCount < 2 ?

                     <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => viewReferrals(row?.users?._id, setShow(false))}>Referrals</button>
                     : null
                  } */}

               </>
            );
         },
      },
      {
         name: '',
         cell: row => {
            return (
               <>
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('block_user') ?
                        <>
                           {row?.users.status == true ?
                              <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => userAction(row?.users?._id, "block")}>Block</button>
                              : <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => userAction(row?.users?._id, "unBlock")}>Unblock</button>
                           }
                        </>
                        :
                        null
                  }
                  {row.refCount >= 0 && row.refCount < 2 ?

                     <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => viewReferrals(row?.users?._id, setShow(false))}>Referrals</button>
                     : null
                  }
               </>
            );
         },
      },
   ];

   const subHeaderComponentMemo = useMemo(() => {
      const handleClear = () => {
         if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
         }
      };

      return (
         <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
      );
   }, [filterText, resetPaginationToggle]);

   const viewReferrals = (id) => {
      if (id) {
         let data = { id }
         dispatch(referralsPerId(data));
      }
   }
   return (
      <>
         {loader ? <FullPageLoader /> :
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Users Details</h3>
                     {
                        show && permissionName && permissionName.length > 0 && permissionName.includes('add_user') ?
                           <Link to='/admin/add-user'><button className="btn btn-default">Add User</button></Link>
                           :
                           null
                     }
                     <br /> <br />
                     <div>
                        {/* <form>
                           <div className="form-group col-md-12">
                              <select className="form-control" name="type" required="required" onChange={e => setType(e.target.value)} value={type} >
                                 <option value="0">All</option>
                                 <option value="1">Master</option>
                                 <option value="2">Partner</option>
                                 <option value="3">Slave</option>
                              </select>
                           </div>
                        </form> */}
                        <div className="form-group col-md-12 mb-3">
                           <Form.Select aria-label="Default select example" name="type" required="required" onChange={e => setType(e.target.value)} value={type}>
                              <option value="0" onClick={e => setAll(0)}>All</option>
                              <option value="1">Master</option>
                              <option value="2">Partner</option>
                              <option value="3">Slave</option>
                           </Form.Select>
                        </div>
                     </div>
                     <DataTable
                        columns={columns}
                        data={filteredItems}
                        pagination
                        highlightOnHover
                        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        persistTableHead
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

export default Users