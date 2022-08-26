import { GET_CURRENCY} from './currencyTypes';

const initialState = {
   currencies: []
}

const currencyReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_CURRENCY:
         return {
            ...state,
            currencies: action.payload
         }
      default:
         return state
   }
}

export default currencyReducer
