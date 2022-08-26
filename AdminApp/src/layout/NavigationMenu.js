import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPerRole } from '../redux/roles/roleActions';
import { getPermission } from '../config/helpers';
import { useHistory } from 'react-router-dom';

const NavigationMenu = (props) => {

    const history = useHistory()

    const [path, setPath] = useState('/admin');
    let token = localStorage.getItem('token');
    const dispatch = useDispatch();
    const roleData = useSelector(state => state?.role.role);
    const loginPermissions = roleData[0]?.permissions;
    const permissionName = getPermission(loginPermissions);

    const activeTab = (path) => {
        setPath(path)
        history.push(path)
    }

    useEffect(() => {
        const pathname = window.location.pathname;
        setPath(pathname)
    }, []);

    useEffect(() => {
        const loginData = localStorage.getItem('user');
        const data = JSON.parse(loginData);
        const uId = data?.roleId;
        dispatch(getPerRole(uId));
    }, [token])

    return (
        <>
            {/* <div className="col-lg-2 col-md-3"> */}
            <div className="sidebar left-sidebar-fix">
                <div className="profile pt-0">
                    <div className="profile-info">
                        <h5>Admin Panel</h5>
                    </div>
                </div>
                <div className='admin-panel-btns'>
                    <Link to='/admin' className={path === "/admin" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin')} >Dashboard</Link>
                    <Link to='/admin/users' className={path === "/admin/users" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/users')} >Users Management</Link>
                    {
                        permissionName && permissionName.length > 0 && permissionName.includes('sub_admins_management') ?
                            <Link to='/admin/sub-admins' className={path === "/admin/sub-admins" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/sub-admins')}>
                                Sub Admins Management
                            </Link>
                            :
                            null
                    }
                    {
                        permissionName && permissionName.length > 0 && permissionName.includes('roles_management') ?
                            <Link to='/admin/roles' className={path === "/admin/roles" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/roles')}>
                                Roles Management
                            </Link>
                            :
                            null
                    }
                    {
                        permissionName && permissionName.length > 0 && permissionName.includes('permissions_management') ?
                            <Link to='/admin/permissions' className={path === "/admin/permissions" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/permissions')}>
                                Permissions Management
                            </Link>
                            :
                            null
                    }
                    <Link to='/admin/networks' className={path === "/admin/networks" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/networks')}>
                        Network Management
                    </Link>
                    <Link to='/admin/currency' className={path === "/admin/currency" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/currency')}>
                        Currency Management
                    </Link>
                    <Link to='/admin/withdraw-currency' className={path === "/admin/withdraw-currency" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/withdraw-currency')}>
                        Withdraw Currency
                    </Link>
                    <Link to='/admin/pending-withdraws' className={path === "/admin/pending-withdraws" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/pending-withdraws')}>
                        Pending Withdraws
                    </Link>
                    <Link to='/admin/transactions' className={path === "/admin/transactions" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/transactions')}>
                        Transactions Management
                    </Link>
                    {
                        permissionName && permissionName.length > 0 && permissionName.includes('transaction_fee_management') ?
                            <Link to='/admin/conversion-fee' className={path === "/admin/conversion-fee" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/conversion-fee')}>
                                Conversion Fee Management
                            </Link>
                            :
                            null
                    }
                    {
                        permissionName && permissionName.length > 0 && permissionName.includes('withdraw_fee_management') ?
                            <Link to='/admin/withdraw-fee' className={path === "/admin/withdraw-fee" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/withdraw-fee')}>
                                Withdraw Fee Management
                            </Link>
                            :
                            null
                    }
                    {
                        permissionName && permissionName.length > 0 && permissionName.includes('leverage_management') ?
                            <Link to='/admin/leverage' className={path === "/admin/leverage" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/leverage')}>
                                Leverage Management
                            </Link>
                            :
                            null
                    }
                    {/* <Dropdown className='user-dropdown'>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            <span className="admin-nav-link">Partner Management</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Link to='/admin/partner-list' className={path === "/admin/partner-list" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/partner-list')}>
                                Partner List
                            </Link>
                        </Dropdown.Menu>
                    </Dropdown> */}
                    {
                        permissionName && permissionName.length > 0 && permissionName.includes('trade_management') ?
                            <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link">Trade Management</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/trade-history" ? true : false}>
                                    {/* <Link to='/admin/trade-statistics' className={path === "/admin/trade-statistics" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/trade-statistics')}>
                                        trade Statistics
                                    </Link> */}
                                    <Link to='/admin/trade-history' className={path === "/admin/trade-history" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/trade-history')}>
                                        Trade History
                                    </Link>
                                </Dropdown.Menu>
                            </Dropdown>
                            :
                            null
                    }
                    {
                        permissionName && permissionName.length > 0 && permissionName.includes('deleted_users_management') ?
                            <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link">Deleted Users Management</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/deleted-users" || path === "/admin/deleted-sub-admins" ? true : false}>
                                    <Link to='/admin/deleted-users' className={path === "/admin/deleted-users" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/deleted-users')}>
                                        Deleted Users
                                    </Link>
                                    <Link to='/admin/deleted-sub-admins' className={path === "/admin/deleted-sub-admins" ? "active admin-nav-link" : "admin-nav-link"} onClick={() => activeTab('/admin/deleted-sub-admins')}>
                                        Deleted Sub Admins
                                    </Link>
                                </Dropdown.Menu>
                            </Dropdown>
                            :
                            null
                    }
                </div>
            </div>
        {/* </div> */}
        </>
    )
}

export default NavigationMenu
