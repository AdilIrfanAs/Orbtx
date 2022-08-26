// layouts
import PublicLayout from "./components/layouts/PublicLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import PrivateLayout from "./components/layouts/PrivateLayout";

// Public Components
import LandingPageOrbtx from "./components/LandingPageOrbtx";
import WelcomeBackOrbtx from './components/WelcomeBackOrbtx'
import TradePage from "./components/Trade/TradePage";
import PortfolioOrbtx from "./components/PortfolioOrbtx";
import BackupOrbtx from "./components/BackupOrbtx";
import AdditionalSecurityOrbtx from "./components/AdditionalSecurityOrbtx";
import ConnectDevicesOrbtx from "./components/ConnectDevicesOrbtx";
import ExchangeOrbtx from "./components/ExchangeOrbtx";
import TransactionsOrbtx from "./components/TransactionsOrbtx";
import CoinAvtivityOrbtx from "./components/CoinAvtivityOrbtx";
import PersonalizeOrbtx from "./components/PersonalizeOrbtx";
import AssetsOrbtx from "./components/AssetsOrbtx";
import MarketPage from "./components/Market/MarketInfo";
import LeverageMargin from "./components/LeverageMargin";
// import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
// import ChangePassword from "./components/ChangePassword/ChangePassword";

// Auth Components
import LoginOrbtx from "./components/LoginOrbtx";
import RegisterOrbtx from "./components/RegisterOrbtx";
import RestoreOrbtx from './components/RestoreOrbtx';
import CreatePasswordOrbtx from "./components/CreatePasswordOrbtx";
import TradeSpotOrbtx from "./components/TradeSpotOrbtx";
// import Referred from "./components/Referral/Referred";

// Private Components
import WithdrawCryptoPage from "./components/WithdrawCrypto/WithdrawCryptoPage";
import DepositPage from "./components/Deposit/DepositPage";
// import Setting from "./components/Setting/Setting";

const routes = [
  { path: "/", exact: true, name: "Home", layout: PublicLayout, component: LandingPageOrbtx },

  { path: "/trade/:coins", exact: true, name: "Trade", layout: PublicLayout, component: TradePage },
  { path: "/trade-spot/:coins", exact: true, name: "Trade Spot", layout: PublicLayout, component: TradeSpotOrbtx },
  { path: "/backup", exact: true, name: "Backup", layout: PublicLayout, component: BackupOrbtx },
  { path: "/additional-security", exact: true, name: "Addition Security", layout: PublicLayout, component: AdditionalSecurityOrbtx },
  { path: "/connect-device", exact: true, name: "Connect Device", layout: PublicLayout, component: ConnectDevicesOrbtx },
  { path: "/personalize", exact: true, name: "Personalize", layout: PublicLayout, component: PersonalizeOrbtx },
  { path: "/assets", exact: true, name: "Assets", layout: PublicLayout, component: AssetsOrbtx },
  { path: "/market", exact: true, name: "Market", layout: PublicLayout, component: MarketPage },
  { path: "/leverage-margin", exact: true, name: "LeverageMargin", layout: PublicLayout, component: LeverageMargin },



  { path: "/register", exact: true, name: "Register", layout: AuthLayout, component: RegisterOrbtx },
  { path: "/login", exact: true, name: "Login", layout: AuthLayout, component: LoginOrbtx },
  { path: "/restore", exact: true, name: "Restore", layout: AuthLayout, component: RestoreOrbtx },
  { path: "/welcome-back", exact: true, name: "WelcomeBack", layout: AuthLayout, component: WelcomeBackOrbtx },
  // { path: "/forgot-password", exact: true, name: "Forgot Password", layout: AuthLayout, component: ForgotPassword },
  // { path: "/change-password", exact: true, name: "Change Password", layout: AuthLayout, component: ChangePassword },
  // { path: "/referred/:code", exact: true, name: "Referred", layout: AuthLayout, component: Referred },

  { path: "/portfolio", exact: true, name: "Portfolio", layout: PrivateLayout, component: PortfolioOrbtx },
  { path: "/exchange/:symbol", exact: true, name: "Exchange", layout: PrivateLayout, component: ExchangeOrbtx },
  { path: "/transactions", exact: true, name: "Transactions", layout: PrivateLayout, component: TransactionsOrbtx },
  { path: "/activity/:coin", exact: true, name: "Coin Avtivity", layout: PrivateLayout, component: CoinAvtivityOrbtx },
  { path: "/create-password", exact: true, name: "CreatePassword", layout: PrivateLayout, component: CreatePasswordOrbtx },
  { path: "/withdraw-crypto/:symbol", exact: true, name: "Withdraw", layout: PrivateLayout, component: WithdrawCryptoPage },
  { path: "/deposit/:symbol", exact: true, name: "Deposit", layout: PrivateLayout, component: DepositPage },
  // { path: "/profile-setting", exact: true, name: "Settings", layout: PrivateLayout, component: Setting },
];

export default routes;


// ===========
// EXTRA OLD ROUTES
// ===========

{/* <Route path="trade/:coins" element={<TradePage />} /> */ }
{/* <Route path="futures" element={<EarnPage />} /> */ }
{/* <Route path="market" element={<MarketPage />} /> */ }

{/* <Route path="deposit-fiat" element={<DepositFiatPage />} /> */ }
{/* <Route path="deposit-fiat2" element={<DepositFiat2Page />} /> */ }
{/* <Route path="convert-history" element={<ConvertHistoryPage />} /> */ }
{/* <Route path="forgot-password2" element={<ForgotPassword2 />} /> */ }
