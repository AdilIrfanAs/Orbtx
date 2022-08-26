const express = require('express')
const router = express.Router()

const auth = require('./auth');
const user = require('./user');
const role = require('./role');
const permission = require('./permission');
const wallet = require('./wallet');
const account = require('./account');
const currency = require('./currency');
const transaction = require('./transaction');
const externalTransaction = require('./externalTransaction');
const withdrawFee = require('./withdrawFee');
const transactionManagement = require('./transactionManagement');
const setting = require('./setting');
const network = require('./network');
const cronjob = require('./cronjob');
const externalWallet = require('./externalWallet');
const dashboard = require('./dashboard');
const internalOrderHistory = require('./internalOrderHistory');
const leverage = require('./leverage');
const leverageOrder = require('./leverageOrder'); 
const spotOrder = require('./spotOrder');
const blockchainBalance = require('./blockchainBalance');


// const authenticate = require('../middlewares/authenticate');


router.get('/', (req, res) => {
    res.status(200).send({ message: "Welcome to the SERVER APIs" });
});


router.use('/auth', auth);
router.use('/user', user);
router.use('/role', role);
router.use('/permission', permission);
router.use('/wallet', wallet);
router.use('/external-wallet', externalWallet);
router.use('/account', account);
router.use('/currency', currency);
router.use('/transaction', transaction);
router.use('/externalTransaction', externalTransaction);
router.use('/transactionManagement', transactionManagement);
router.use('/withdrawManagement', withdrawFee);
router.use('/setting', setting);
router.use('/network', network);
router.use('/dashboard', dashboard);
router.use('/internalOrderHistory', internalOrderHistory);
router.use('/leverageOrder', leverageOrder);
router.use('/leverage', leverage);
router.use('/spotOrder', spotOrder);
router.use('/cronjob', cronjob);
router.use('/blockchainBalance', blockchainBalance);

module.exports = router