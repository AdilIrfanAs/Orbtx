import {
  SHOW_ALL_USERS, GET_USER, ADD_USER, EDIT_USER, DELETE_USER, CHANGE_PASS, REFERRALS_PER_ID, SUCCESS_MESSAGE, ADD_BALANCE, GET_USER_DETAILS,
  SET_WALLET, SHOW_SUB_ADMINS, SINGLE_SUB_ADMIN, DELETED_USERS, DELETED_SUB_ADMINS, RECOVER_USER, DISCONNECT_WALLET, CONNECT_WALLET, 
  SHOW_ADMIN_BALANCE, GET_SENT_BALANCE_TO_USER, TOGGLE_STATE
} from "./userTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getUser = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/user/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_USER,
        payload: data.user
      })
      // toast.success(res.data.message)
    }
  } catch (error) {
    // console.log(error.response.message)
    // toast.error(error.response.message)
  }
}

export const getUserDetails = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/user/user-details/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_USER_DETAILS,
        payload: data.user
      })
      // toast.success(res.data.message)
    }
  } catch (error) {
    // console.log(error.response.message)
    // toast.error(error.response.message)
  }
}

export const showAllUsers = (type, roleId, userId) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/users`, { 'userType': type, 'role_id': roleId, 'user_id': userId })
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: SHOW_ALL_USERS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const showSubAdmins = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/sub-admins-listing`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: SHOW_SUB_ADMINS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const singleSubAdmin = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/single-subadmin/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: SINGLE_SUB_ADMIN,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedUsers = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-users`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: DELETED_USERS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedSubAdmins = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-sub-admins`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: DELETED_SUB_ADMINS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const recoverUser = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/recover/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: RECOVER_USER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const referralsPerId = (data) => async (dispatch) => {
  try {

    let res = await apiHelper("get", `/api/user/referralsAgainstId/${data.id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      console.log("pay", data)

      dispatch({
        type: REFERRALS_PER_ID,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addUser = (user) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/add`, user)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_USER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const editUser = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_USER,
        payload: data.user
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const forgetPassEmail = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/forget-passsword-email`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const forgetPassword = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/forget-password`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const changePassword = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/change-password/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
      dispatch({
        type: CHANGE_PASS
      })
      window.location.href = "/admin/login"
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const sendTransactionDataToDB = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/transaction/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
      dispatch({
        type: SUCCESS_MESSAGE,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const addBalance = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/account/update`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_BALANCE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteUser = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/delete-user/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_USER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const setUserWallet = (data) => async (dispatch) => {
  try {
    console.log(data, "this is <<<<<<<<,,");
    dispatch({
      type: SET_WALLET,
      payload: data
    })

  } catch (error) {
    toast.error(error.response.message)
  }
}

export const connectUserWallet = (data) => (dispatch) => {
  try {
    dispatch({
      type: CONNECT_WALLET,
      payload: data
    })

  } catch (error) {
    toast.error(error.response.message)
    console.log(error.message)
  }
}

export const disConnectWallet = (data) => (dispatch) => {
  try {
    dispatch({
      type: DISCONNECT_WALLET
    })

  } catch (error) {
    toast.error(error.response.message)
    console.log(error.message)
  }
}

export const showAdminBalance = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/dashboard/get-admin-balance`, '')
    console.log("res: ", res)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_ADMIN_BALANCE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.message)
  }
}

export const getSentAmountToUser = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/dashboard/admin-sent-amount-to-user`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_SENT_BALANCE_TO_USER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.message)
  }
}

export const updateState = () => async (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_STATE
    })
  } catch (error) {
    console.log(error.response.message)
  }
}