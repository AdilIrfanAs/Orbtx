import { GET_ACCOUNT, TRANSFER, CLEAR } from './accountTypes';

const initialState = {
   account: [],
   success: false
}

const AccountReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_ACCOUNT:
         return {
            ...state,
            account: action.payload
         }
      case TRANSFER:
         return {
            ...state,
            success: true
         }
      case CLEAR:
         return {
            ...state,
            success: false
         }
      default:
         return state
   }
}

export default AccountReducer
