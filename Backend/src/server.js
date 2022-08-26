require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const path = require("path");
const routes = require('./routes/index');
// const Wallet = require('./controllers/wallet');
// const InternalOrderHistory = require('./controllers/internalOrderHistory');
// const LeverageOrder = require('./controllers/leverageOrder');

// var cron = require('node-cron');

// const Cronjob = require('./controllers/cronjob');


// Setting up port
// const connUri = process.env.MONGO_LOCAL_CONN_URL;
let PORT = 8000;
let URL = process.env.SITE_URL

const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  useServerTime: false,
  recvWindow: 2000,
});

// == 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cron.schedule('0 0 */12 * * *', () => {
//   Wallet.getETHWalletTransactions();
// });

// cron.schedule('0 0 */12 * * *', () => {
//   Wallet.getETHWalletTransactions();
// });

// cron.schedule('0 0 */12  * * *', () => {
//   Wallet.getXRPWalletTransactions();
// });

// cron.schedule('0 0 */12 * * *', () => {
//   Wallet.resolveAccountTransactions();
// });

// cron.schedule('0 */2 * * * *', () => {
//   InternalOrderHistory.resolveOrders(); // Internal Conversion
// });

// cron.schedule('0 */2 * * * *', () => {
//   LeverageOrder.ordersCron();  // Cron Job, Leverage orders feature
// });

app.use('/images', express.static(path.join(__dirname, '../upload')))

app.use('/api', routes);

// Admin Site Build Path
app.use('/admin/', express.static(path.join(__dirname, '../admin/build')))
app.get('/admin/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../admin/build', 'index.html'));
});

// Front Site Build Path
app.use('/', express.static(path.join(__dirname, '../client/build')))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//== 2 - SET UP DATABASE
//Configure mongoose's promise to global promise

mongoose.promise = global.Promise;

mongoose.connect(process.env.MONGO_LOCAL_CONN_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(passport.initialize());
require("./middlewares/jwt")(passport);


app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});