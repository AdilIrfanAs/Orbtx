import authReducer from "./auth/authReducer";
import userReducer from "./users/userReducer";
import permissionReducer from "./permissions/permissionReducer";
import roleReducer from "./roles/roleReducer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from 'redux-thunk'
import currencyReducer from "./currency/currencyReducer";
import transactionFeeReducer from "./transactionFee/transactionFeeReducer";
import transactionReducer from "./transactions/transactionReducer";
import networkReducer from "./network/networkReducer";
import withdrawFeeReducer from "./withdrawFee/withdrawFeeReducer";
import leverageReducer from "./leverage/leverageReducer";
import ExternalTransactionReducer from "./ExternalTransactions/externalTransactionReducer";
import settingsReducer from "./settings/settingsReducer"
import LeverageOrderReducer from "./leverageOrder/leverageOrderReducer";

const middleware = [thunk]
const reducer = combineReducers({
  users: userReducer,
  auth: authReducer,
  permission: permissionReducer,
  role: roleReducer,
  currency: currencyReducer,
  transactionFee: transactionFeeReducer,
  transaction: transactionReducer,
  network: networkReducer,
  withdrawFee: withdrawFeeReducer,
  leverages: leverageReducer,
  externalTransaction: ExternalTransactionReducer,
  LeverageOrders: LeverageOrderReducer,
  settings: settingsReducer
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store