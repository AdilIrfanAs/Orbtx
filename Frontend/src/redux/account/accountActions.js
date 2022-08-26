import { GET_ACCOUNT, TRANSFER, CLEAR } from "./accountTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getAccount = (Id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/account/` + Id, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_ACCOUNT,
        payload: data.account
      })
    }
  } catch (error) {
    // toast.error(error.response.message)
  }
}


export const transferAmounts = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/account/transferAmounts`, data)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: TRANSFER,
        payload: data
      })
    }
  } catch (error) {
    // toast.error(error.response.message)
  }
}

export const clearTransfer = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR
    })
  } catch (error) {
    // toast.error(error.response.message)
  }
}