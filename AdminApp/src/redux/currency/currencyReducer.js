import {
   SHOW_ALL_CURRENCIES, ADD_CURRENCY, DELETE_CURRENCY, EDIT_CURRENCY, GET_CURRENCY, WALLET_CURRENCIES,
   TOGGLE_STATE, ERROR_STATE
} from './currencyTypes';

const initialState = {
   currencies: [],
   walletCurrencies: [],
   success: false,
   fetched: false,
   error: false,
}

const currencyReducer = (state = initialState, action) => {
   switch (action.type) {
      case SHOW_ALL_CURRENCIES:
         return {
            ...state,
            currencies: action.payload,
            success: false,
            fetched: true
         }
      case GET_CURRENCY:
         return {
            ...state,
            currencies: action.payload
         }
      case ADD_CURRENCY:
         return {
            ...state,
            currencies: [state.currencies, action.payload],
            success: true
         }
      case DELETE_CURRENCY:
         return {
            ...state,
            currencies: action.payload,
            success: true
         }
      case EDIT_CURRENCY:
         return {
            ...state,
            currencies: action.payload
         }
      case WALLET_CURRENCIES:
         return {
            ...state,
            walletCurrencies: action.payload
         }
      case TOGGLE_STATE:
         return {
            ...state,
            success: false,
            error: false
         }
      case ERROR_STATE:
         return {
            ...state,
            error: true
         }
      default:
         return state
   }
}

export default currencyReducer
