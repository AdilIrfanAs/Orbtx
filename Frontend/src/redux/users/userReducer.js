import { EDIT_USER, SET_USER, CHANGE_PASS, GET_USER, CHANGE_2FA, CLEAR_2FA } from './userTypes';

const initialState = {
   user: [],
   passChanged: false,
   authChanged: false
}

const userReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_USER:
         return {
            ...state,
            user: action.payload
         }
      case EDIT_USER:
         return {
            ...state,
            user: action.payload
         }
      case SET_USER:
         return {
            ...state,
            user: action.payload
         }
      case CHANGE_PASS:
         return {
            ...state,
            passChanged: true
         }
      case CHANGE_2FA:
         return {
            ...state,
            authChanged: true
         }
      case CLEAR_2FA:
         return {
            ...state,
            authChanged: false
         }
      default:
         return state
   }
}

export default userReducer
