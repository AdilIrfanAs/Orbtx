import { GET_CURRENCY } from "./currencyTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getCurrency = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/currency/`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_CURRENCY,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}