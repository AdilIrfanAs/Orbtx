import { GET_PENDING_WITHDRAWS, APPROVE_PENDING_TRANSACTION, WITHDRAW_CURRENCY, ERROR_STATE, TOGGLE_STATE } from './externalTransactionTypes';

const initialState = {
   pendingWithdraws: [],
   withdrawCurrencies: [],
   success: false,
   error: false,
   withdrawn: false
}

const ExternalTransactionReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_PENDING_WITHDRAWS:
         return {
            ...state,
            pendingWithdraws: action.payload,
            success: true
         }
      case APPROVE_PENDING_TRANSACTION:
         return {
            ...state,
            pendingWithdraws: action.payload
         }
      case WITHDRAW_CURRENCY:
         return {
            ...state,
            withdrawCurrencies: action.payload,
            withdrawn: true
         }
      case ERROR_STATE:
         return {
            ...state,
            error: true
         }
      case TOGGLE_STATE:
         return {
            ...state,
            error: false
         }
      default:
         return state
   }
}

export default ExternalTransactionReducer
