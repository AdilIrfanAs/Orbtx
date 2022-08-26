import { GET_ORDER, CLEAR_ORDER, GET_USER_ORDER, ORDER_ERROR, STOP_ORDER } from "./leverageOrderTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getLeverageOrders = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/leverageOrder/`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getUserLeverageOrders = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/leverageOrder/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_USER_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const clearLeverageOrder = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_ORDER
    })
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const stopLeverageOrder = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/leverageOrder/stop/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: STOP_ORDER,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}