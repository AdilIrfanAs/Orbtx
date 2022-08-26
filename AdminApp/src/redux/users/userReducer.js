import {
   SHOW_ALL_USERS, GET_USER, ADD_USER, EDIT_USER, DELETE_USER, FORGET_PASSWORD, CHANGE_PASS, REFERRALS_PER_ID, ADD_BALANCE, GET_USER_DETAILS,
   CONNECT_WALLET, DISCONNECT_WALLET, SHOW_SUB_ADMINS, SINGLE_SUB_ADMIN, DELETED_USERS, DELETED_SUB_ADMINS, RECOVER_USER, SUCCESS_MESSAGE, SHOW_ADMIN_BALANCE,
   GET_SENT_BALANCE_TO_USER, TOGGLE_STATE
} from './userTypes';


let initialState = {
   user: [],
   users: [],
   subAdmins: [],
   delUsers: [],
   delSubAdmins: [],
   balance: [],
   passChanged: false,
   walletAddress: null,
   isDeleted: false,
   success: false,
   fetched: false,
   balanceAdded: false,
   adminBalance: [],
   sentAmountToUser: [],
   pagination: ""
   // referrals: []
}

const userReducer = (state = initialState, action) => {
   switch (action.type) {
      case CONNECT_WALLET:
         return {
            ...state,
            mAddress: action.payload,
         }
      case DISCONNECT_WALLET:
         return {
            ...state,
            mAddress: "",
         }
      case SHOW_ALL_USERS:
         return {
            ...state,
            users: action.payload.referral,
            success: false,
            fetched: true
         }
      case SHOW_SUB_ADMINS:
         return {
            ...state,
            subAdmins: action.payload.subAdmins,
            success: false,
            fetched: true
         }
      case SINGLE_SUB_ADMIN:
         return {
            ...state,
            subAdmins: action.payload
         }
      case DELETED_USERS:
         return {
            ...state,
            delUsers: action.payload,
            success: false,
            fetched: true
         }
      case SUCCESS_MESSAGE:
         return {
            success: true
         }
      case DELETED_SUB_ADMINS:
         return {
            ...state,
            delSubAdmins: action.payload,
            success: false
         }
      case RECOVER_USER:
         return {
            ...state,
            delUsers: action.payload,
            success: true,
            fetched: true
         }
      case GET_USER:
         return {
            ...state,
            user: action.payload
         }
      case GET_USER_DETAILS:
         return {
            ...state,
            user: action.payload
         }
      case SHOW_ADMIN_BALANCE:
         return {
            ...state,
            adminBalance: action.payload
         }
      case GET_SENT_BALANCE_TO_USER:
         return {
            ...state,
            sentAmountToUser: action.payload
         }
      case REFERRALS_PER_ID:
         return {
            ...state,
            users: action.payload.referral
         }
      case ADD_USER:
         return {
            ...state,
            users: [...state.users, action.payload]
         }
      case EDIT_USER:
         return {
            ...state,
            user: action.payload,
            success: true
         }
      case DELETE_USER:
         return {
            ...state,
            user: action.payload,
            success: true
         }
      case FORGET_PASSWORD:
         return {
            ...state,
            users: action.payload
         }
      case CHANGE_PASS:
         return {
            ...state,
            passChanged: true
         }
      case ADD_BALANCE:
         return {
            ...state,
            balance: action.payload,
            balanceAdded: true,
         }
      case TOGGLE_STATE:
         return {
            success: false
         }
      default:
         return {
            ...state,
         }
   }
}

export default userReducer
