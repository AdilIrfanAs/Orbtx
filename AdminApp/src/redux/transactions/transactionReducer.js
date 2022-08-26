import { DISPLAY_TRANSACTIONS } from './transactionTypes';

const initialState = {
   transactions: [],
   fetched: false
};

const transactionReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_TRANSACTIONS:
         return {
            ...state,
            transactions: action.payload.transactions,
            fetched: true
         }
      default:
         return state
   }
}

export default transactionReducer
