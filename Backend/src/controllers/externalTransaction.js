const ExternalTransaction = require('../models/externalTransaction');
const Referral = require('../models/transaction');

const User = require('../models/user');
const Account = require('../models/account');
const Currency = require('../models/currency');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Network = require('../models/network');
const Wallet = require('../models/wallet');
const Web3 = require("web3");
const { json } = require('body-parser');
const ethNetwork = process.env.RINKEBY;
const RippleAPI = require('ripple-lib').RippleAPI
var Tx = require('ethereumjs-tx');
const tokenAbi = require('../config/abi.json')
const TronWeb = require('tronweb')
const TronGrid = require('trongrid')

const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const tinysecp = require('tiny-secp256k1');

// @route GET admin/transaction
// @desc Returns all transactions
// @access Public
// exports.index = async function (req, res) {

exports.index = async function (req, res) {

    const externalTransactions = await ExternalTransaction.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'fromAccount',
                foreignField: '_id',
                as: 'fromAccount'
            }
        },
        {
            $unwind: "$fromAccount"
        },
        {
            $lookup: {
                from: 'users',
                localField: 'toAccount',
                foreignField: '_id',
                as: 'toAccount'
            }
        },
        {
            $unwind: "$toAccount"
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'currencyId',
                foreignField: '_id',
                as: 'currencies'
            }
        },
        {
            $unwind: "$currencies"
        },
        {
            $project: {
                'amounts': 1,
                'fromAddress.firstname': 1,
                'fromAddress.lastname': 1,
                'fromAddress.username': 1,
                'fromAddress.email': 1,
                'toAddress.firstName': 1,
                'toAddress.lastname': 1,
                'toAddress.username': 1,
                'toAddress.email': 1,
                'currencies.name': 1,
                'currencies.symbol': 1,
            }
        }
    ])

    res.status(200).json({ success: true, message: "List of transactions", externalTransactions })
};

// @route POST api/transaction/add
// @desc Add a new transaction
// @access Public

exports.store = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/transaction/{id}
// @desc Returns a specific transaction
// @access Public
exports.show = async function (req, res) {

    const transaction = await ExternalTransaction.aggregate([
        {
            $match: {
                _id: ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'fromAccount',
                foreignField: '_id',
                as: 'fromAccount'
            }
        },
        {
            $unwind: "$fromAccount"
        },
        {
            $lookup: {
                from: 'users',
                localField: 'toAccount',
                foreignField: '_id',
                as: 'toAccount'
            }
        },
        {
            $unwind: "$toAccount"
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'currencyId',
                foreignField: '_id',
                as: 'currencies'
            }
        },
        {
            $unwind: "$currencies"
        },
        {
            $limit: 1
        },
    ])

    res.status(200).json({ success: true, message: "List of users associated with transaction", transaction })
};

exports.getUserTransactions = async function (req, res) {
    const externalTransactions = await ExternalTransaction.find({ userId: ObjectId(req.params.id) })
    res.status(200).json({ success: true, message: "List of transactions", externalTransactions })
};

exports.getUserDeposits = async function (req, res) {
    const deposits = await ExternalTransaction.find({ userId: ObjectId(req.params.id), transactionType: { $ne: true } })
    res.status(200).json({ success: true, message: "List of transactions", deposits })
};

exports.getUserWithdraws = async function (req, res) {
    const withdraws = await ExternalTransaction.find({ userId: ObjectId(req.params.id), transactionType: 1 })
    res.status(200).json({ success: true, message: "List of transactions", withdraws })
};

function financialMfil(numMfil) {
    return Number.parseFloat(numMfil / 1e3).toFixed(3);
}

exports.withdraw = async function (req, res) {
    try {
        const data = req.body;
        console.log("data2: ", data);
        const network = await Network.findOne({ _id: data.networkId })
        const currency = await Currency.findOne({ _id: data.currencyId })
        // admin's wallet
        const wallet = await Wallet.findOne({ userId: ObjectId('624c04c17b1291e3b1f9b2fc'), networkId: data.networkId })
        let live = process.env.NETWORK_LIVE;
        console.log("currency.symbol: ", currency.symbol);

        if (currency.symbol == 'ETH') {
            const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
            console.log("balance 3");
            let balance = await web3.utils.fromWei(await web3.eth.getBalance(wallet.address))
            console.log("balance ", balance);
            if ((parseFloat(balance)) < parseFloat(data.coins) + ((parseFloat(data.gas ? data.gas.toString() : '2100') * (100 + 10)) * 0.00000000106)) {
                // add data to External transations table.
                let insertExternalTransaction = new ExternalTransaction({
                    userId: data.userId,
                    fromAddress: wallet.address,
                    toAddress: data.sendToAddress,
                    amount: data.coins.toString() ? data.coins.toString() : "0",
                    gasPrice: data.gas ? (data.gas).toString() : '21000',
                    currency: currency.symbol,
                    isResolved: false,
                    transactionType: 1, //outbound
                    extras: JSON.stringify({ networkId: data.networkId, deducted: data.deducted })
                })
                const saveExternalTransaction = await insertExternalTransaction.save();
                return res.status(200).json({ message: "Withdraw submitted. Waiting for approval from Admin." });
            }
            else {
                const nonce = await web3.eth.getTransactionCount(wallet.address, 'latest');
                let gasPrice = await web3.eth.getGasPrice();
                let coin = await web3.utils.toWei(data.coins, currency.symbol == 'ETH' ? "ether" : "tether")
                const transaction = {
                    'to': data.sendToAddress,
                    'value': coin,
                    'gas': data.gas ? (data.gas).toString() : '21000'
                };

                const signedTx = await web3.eth.accounts.signTransaction(transaction, wallet.privateKey);

                await web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function (error, hash) {
                    if (!error) {
                        // add data to External transations table.
                        let insertExternalTransaction = new ExternalTransaction({
                            userId: data.userId,
                            fromAddress: wallet.address,
                            toAddress: transaction.to,
                            txHash: hash,
                            amount: transaction.value.toString() ? transaction.value.toString() : "0",
                            gasPrice: transaction.gas,
                            currency: currency.symbol,
                            isResolved: true,
                            transactionType: 1 //outbound
                        })
                        const saveExternalTransaction = await insertExternalTransaction.save();
                        // subtract amount from user's account
                        const account = await Account.findOne({ userId: data.userId })
                        account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) - parseFloat(data.deducted);
                        account.save();
                        return res.status(200).json({ message: "YAYY! The hash of your transaction is: " + hash + "\n Check Alchemy's Mempool to view the status of your transaction!" });
                    } else {
                        return res.status(500).json({ message: "OPSS! Something went wrong while submitting your transaction:" + error });
                    }
                });
            }
        }
        else if (currency.symbol == 'USDT') {
            const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

            var count = await web3.eth.getTransactionCount(wallet.address);
            let contractAddress = live == 1 ? "0xdac17f958d2ee523a2206206994597c13d831ec7" : "0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad";
            let contract = await new web3.eth.Contract(tokenAbi, contractAddress)

            const balance = await contract.methods.balanceOf(wallet.address).call()
            if ((financialMfil(balance)) < parseFloat(data.coins) + ((parseFloat(data.gas ? data.gas.toString() : '2100') * (100 + 10)) * 0.00000000106)) {
                // add data to External transations table.
                let insertExternalTransaction = new ExternalTransaction({
                    userId: data.userId,
                    fromAddress: wallet.address,
                    toAddress: data.sendToAddress,
                    amount: data.coins.toString() ? data.coins.toString() : '0',
                    gasPrice: data.gas ? (data.gas).toString() : '21000',
                    currency: currency.symbol,
                    isResolved: false,
                    transactionType: 1, //outbound
                    extras: JSON.stringify({ networkId: data.networkId, deducted: data.deducted })
                })
                const saveExternalTransaction = await insertExternalTransaction.save();
                return res.status(200).json({ message: "Withdraw submitted. Waiting for approval from Admin." });
            }

            // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
            // Use Gwei for the unit of gas price
            var gasPriceGwei = 3;
            var gasLimit = 3000000;
            // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net
            var chainId = live == 1 ? 1 : 3;
            var rawTransaction = {
                "from": wallet.address,
                "nonce": "0x" + count.toString(16),
                "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
                "gasLimit": web3.utils.toHex(gasLimit),
                "to": contractAddress,
                "value": "0x0",
                "data": contract.methods.transfer(data.sendToAddress, data.coins).encodeABI(),
                "chainId": chainId
            };
            // The private key for myAddress in .env
            var privKey = wallet.privateKey;
            var tx = new Tx(rawTransaction);
            tx.sign(privKey);
            var serializedTx = tx.serialize();
            // Comment out these four lines if you don't really want to send the TX right now
            var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
            // The receipt info of transaction, Uncomment for debug
            return res.status(200).json({ message: `YAYY! The hash of your transaction is completed. \n${JSON.stringify(receipt, null, '\t')}` });
            // The balance may not be updated yet, but let's check

        }
        else if (currency.symbol == 'AVAX') {
            // in progress
        }
        else if (currency.symbol == 'TRX') {
            // if you want to transfer 1 TRX then use 1000000
            data.coins = data.coins * 1000000
            const balance = await TronWeb.trx.getBalance(wallet.address);

            if ((parseFloat(balance)) < parseFloat(data.coins) + ((parseFloat(data.gas ? data.gas.toString() : '2100') * (100 + 10)) * 0.00000000106)) {
                // add data to External transations table.
                let insertExternalTransaction = new ExternalTransaction({
                    userId: data.userId,
                    fromAddress: wallet.address,
                    toAddress: data.sendToAddress,
                    amount: data.coins.toString() ? data.coins.toString() : '0',
                    gasPrice: data.gas ? (data.gas).toString() : '1000000',
                    currency: currency.symbol,
                    isResolved: false,
                    transactionType: 1, //outbound
                    extras: JSON.stringify({ networkId: data.networkId, deducted: data.deducted })
                })
                const saveExternalTransaction = await insertExternalTransaction.save();
                return res.status(200).json({ message: "Withdraw submitted. Waiting for approval from Admin." });
            }

            const unsignedTxn = await TronWeb.transactionBuilder.sendTrx(data.sendToAddress, data.coins, wallet.address);
            // console.log("unsignedTxn: ", unsignedTxn);
            var privKey = wallet.privateKey;
            const signedTxn = await TronWeb.trx.sign(unsignedTxn, privKey);
            // console.log("signedTxn: ", signedTxn);
            const receipt = await TronWeb.trx.sendRawTransaction(signedTxn);
            // console.log("receipt: ", receipt);

            // The receipt info of transaction, Uncomment for debug
            return res.status(200).json({ message: `YAYY! The hash of your transaction is completed. \n${receipt.txid}` });
            // The balance may not be updated yet, but let's check

        }
        else if (currency.symbol == 'BTC') {
            // let testnet = bitcoin.networks.bitcoin;
            // let txb = new bitcoin.TransactionBuilder(testnet);
            // let amount = 100000000 * 0.00231520
            // txb.addOutput("2NDR8KWPjeSWkeZZ69vMS3JmaKRG7GA9s9J", amount);

            // let txid = "2d04373baa5fb57893dd5a141e39570bdd7c786c43a0189227209ada298168b3"; //transaction id
            // let outn = 0; // n out
            // txb.addInput(txid, outn);

            // let WIF = "cShnDKBJED9Vr6jzUpxfjmgc3vffiM7wod5Ne7iu1bLs3zE3ZJcE";
            // //private key of the address associated with this unspent output
            // let keypair = ECPair.fromWIF(WIF, testnet);
            // txb.sign(0, keypair);
            // let tx = txb.build();
            // let txhex = tx.toHex();
            // console.log(txhex);
            // The receipt info of transaction, Uncomment for debug
            return res.status(200).json({ message: `YAYY! The hash of your transaction is completed. \n${receipt.txid}` });
            // The balance may not be updated yet, but let's check

        }
        // else if (currency.symbol == 'XRP') {
        //     let api = new RippleAPI({
        //         server: live == 1 ? 'wss://s1.ripple.com' : 'wss://s.altnet.rippletest.net:51233'
        //     })
        //     await api.connect();

        //     let balance = 0;
        //     await api.getAccountInfo(wallet.address).then(info => {
        //         balance = info.xrpBalance;
        //     });
        //     if ((parseFloat(balance)) < parseFloat(data.coins)) {
        //         // add data to External transations table.
        //         let insertExternalTransaction = new ExternalTransaction({
        //             userId: data.userId,
        //             fromAddress: wallet.address,
        //             toAddress: data.sendToAddress,
        //             amount: data.coins.toString() ? data.coins.toString() : '0',
        //             currency: currency.symbol,
        //             isResolved: false,
        //             transactionType: 1, //outbound
        //             extras: JSON.stringify({ networkId: data.networkId, deducted: data.deducted })
        //         })
        //         const saveExternalTransaction = await insertExternalTransaction.save();
        //         return res.status(200).json({ message: "Withdraw submitted. Waiting for approval from Admin." });
        //     }


        //     // Ripple payments are represented as JavaScript objects
        //     const payment = {
        //         source: {
        //             address: wallet.address,
        //             maxAmount: {
        //                 value: data.coins.toString(),
        //                 currency: 'XRP'
        //             }
        //         },
        //         destination: {
        //             address: data.sendToAddress,
        //             amount: {
        //                 value: data.coins.toString(),
        //                 currency: 'XRP'
        //             }
        //         }
        //     };

        //     // Get ready to submit the payment
        //     const prepared = await api.preparePayment(wallet.address, payment, {
        //         maxLedgerVersionOffset: 5
        //     });

        //     // Sign the payment using the sender's secret
        //     const { signedTransaction } = api.sign(prepared.txJSON, wallet.privateKey);

        //     // Submit the payment
        //     const resp = await api.submit(signedTransaction);
        //     api.disconnect();
        //     // add data to External transations table.
        //     let insertExternalTransaction = new ExternalTransaction({
        //         userId: data.userId,
        //         fromAddress: wallet.address,
        //         toAddress: data.sendToAddress,
        //         txHash: resp.tx_json.hash,
        //         amount: data.coins.toString() ? data.coins.toString() : '0',
        //         gasPrice: (parseFloat(resp.tx_json.Fee) * 0.000001).toString(),
        //         currency: 'XRP',
        //         isResolved: true,
        //         transactionType: 1 //outbound
        //     })
        //     const saveExternalTransaction = await insertExternalTransaction.save();
        //     // subtract amount from user's account
        //     const account = await Account.findOne({ userId: data.userId })
        //     account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) - parseFloat(data.deducted);
        //     account.save();
        //     return res.status(200).json({ message: "YAYY! The hash of your transaction is: " + resp.tx_json.hash + "\n livenet.xrpl.org to view the status of your transaction!" });
        // }
        else
            return res.status(500).json({ message: "Currency not found." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.completePendingTransaction = async function (req, res) {
    try {

        const id = req.params.id;

        const externalTransaction = await ExternalTransaction.findById(id);
        let live = process.env.NETWORK_LIVE;
        const currency = await Currency.findOne({ symbol: externalTransaction.currency })
        // admin's wallet
        const wallet = await Wallet.findOne({ userId: ObjectId('624c04c17b1291e3b1f9b2fc'), networkId: ObjectId(JSON.parse(externalTransaction.extras).networkId) })

        if (externalTransaction.currency == 'ETH') {
            const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
            let balance = await web3.utils.fromWei(await web3.eth.getBalance(wallet.address))
            if ((parseFloat(balance)) < parseFloat(externalTransaction.amount) + ((parseFloat(externalTransaction.gasPrice) * (100 + 10)) * 0.00000000106)) {
                return res.status(500).json({ message: "Not Enough Balance in account" });
            }
            else {
                const nonce = await web3.eth.getTransactionCount(wallet.address, 'latest');
                let gasPrice = await web3.eth.getGasPrice();
                let coin = await web3.utils.toWei(externalTransaction.amount, externalTransaction.currency == 'ETH' ? "ether" : "tether")
                const transaction = {
                    'to': externalTransaction.toAddress,
                    'value': coin,
                    'gas': externalTransaction.gasPrice
                };

                const signedTx = await web3.eth.accounts.signTransaction(transaction, wallet.privateKey);

                await web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function (error, hash) {
                    if (!error) {
                        // update data in External transations table.
                        externalTransaction.txHash = hash;
                        externalTransaction.amount = transaction.value.toString();
                        externalTransaction.gasPrice = transaction.gas;
                        externalTransaction.isResolved = true;
                        await externalTransaction.save();
                        // subtract amount from user's account
                        const account = await Account.findOne({ userId: externalTransaction.userId })
                        account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) - parseFloat(JSON.parse(externalTransaction.extras).deducted);
                        account.save();
                        return res.status(200).json({ message: "YAYY! The hash of your transaction is: " + hash + "\n Check Alchemy's Mempool to view the status of your transaction!" });
                    } else {
                        return res.status(500).json({ message: "OPSS! Something went wrong while submitting your transaction:" + error });
                    }
                });
            }
        }
        else if (externalTransaction.currency == 'USDT') {
            const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

            var count = await web3.eth.getTransactionCount(wallet.address);

            let contractAddress = live == 1 ? "0xdac17f958d2ee523a2206206994597c13d831ec7" : "0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad";

            let contract = await new web3.eth.Contract(tokenAbi, contractAddress)

            // How many tokens do I have before sending?
            var balance = await contract.methods.balanceOf(wallet.address).call();

            if ((financialMfil(balance)) < parseFloat(externalTransaction.amount) + ((parseFloat(externalTransaction.gasPrice) * (100 + 10)) * 0.00000000106)) {
                return res.status(500).json({ message: "Not Enough Balance in account" });
            }
            else {

                // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
                // Use Gwei for the unit of gas price
                var gasPriceGwei = 3;
                var gasLimit = 3000000;
                // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net
                var chainId = live == 1 ? 1 : 3;
                var rawTransaction = {
                    "from": wallet.address,
                    "nonce": "0x" + count.toString(16),
                    "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
                    "gasLimit": web3.utils.toHex(gasLimit),
                    "to": contractAddress,
                    "value": "0x0",
                    "data": contract.methods.transfer(externalTransaction.toAddress, externalTransaction.amount).encodeABI(),
                    "chainId": chainId
                };
                // The private key for myAddress in .env
                var privKey = wallet.privateKey;
                var tx = new Tx(rawTransaction);
                tx.sign(privKey);
                var serializedTx = tx.serialize();

                await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async function (error, hash) {
                    if (!error) {
                        // update data in External transations table.
                        externalTransaction.txHash = hash;
                        externalTransaction.amount = transaction.value.toString();
                        externalTransaction.gasPrice = transaction.gasPrice;
                        externalTransaction.isResolved = true;
                        await externalTransaction.save();
                        // subtract amount from user's account
                        const account = await Account.findOne({ userId: externalTransaction.userId })
                        account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) - parseFloat(JSON.parse(externalTransaction.extras).deducted);
                        account.save();
                        return res.status(200).json({ message: "YAYY! The hash of your transaction is: " + hash + "\n Check Alchemy's Mempool to view the status of your transaction!" });
                    } else {
                        return res.status(500).json({ message: "OPSS! Something went wrong while submitting your transaction:" + error });
                    }
                });
            }
        }
        else if (externalTransaction.currency == 'TRX') {

            // How many tokens do I have before sending?
            const balance = await TronWeb.trx.getBalance(wallet.address);

            if ((parseFloat(balance)) < parseFloat(externalTransaction.amount) + ((parseFloat(externalTransaction.gasPrice) * (100 + 10)) * 0.00000000106)) {
                return res.status(500).json({ message: "Not Enough Balance in account" });
            }
            else {
                const unsignedTxn = await TronWeb.transactionBuilder.sendTrx(externalTransaction.toAddress, externalTransaction.amount, wallet.address);
                // console.log("unsignedTxn: ", unsignedTxn);
                var privKey = wallet.privateKey;
                const signedTxn = await TronWeb.trx.sign(unsignedTxn, privKey);
                // console.log("signedTxn: ", signedTxn);
                const receipt = await TronWeb.trx.sendRawTransaction(signedTxn)
                    .then(async (res) => {
                        // update data in External transations table.
                        externalTransaction.txHash = res.txid;
                        externalTransaction.gasPrice = 1000000;
                        externalTransaction.isResolved = true;
                        await externalTransaction.save();
                        // subtract amount from user's account
                        const account = await Account.findOne({ userId: externalTransaction.userId })
                        account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) - parseFloat(((parseFloat(externalTransaction.coins) + 1000000) / 1000000));
                        account.save();
                        return res.status(200).json({ message: "YAYY! The hash of your transaction is: " + hash + "\n Check Alchemy's Mempool to view the status of your transaction!" });
                    })
                    .catch(err => {
                        return res.status(500).json({ message: "OPSS! Something went wrong while submitting your transaction:" + error });
                    })
            }
        }

        // else if (externalTransaction.currency == 'XRP') {
        //     let api = new RippleAPI({
        //         server: live == 1 ? 'wss://s1.ripple.com' : 'wss://s.altnet.rippletest.net:51233'
        //     })
        //     await api.connect();

        //     await api.getAccountInfo(wallet.address).then(info => {
        //         balance = info.xrpBalance;
        //     });
        //     if ((parseFloat(balance)) < parseFloat(externalTransaction.amount)) {
        //         return res.status(500).json({ message: "Not Enough Balance in account" });
        //     }

        //     // Ripple payments are represented as JavaScript objects
        //     const payment = {
        //         source: {
        //             address: wallet.address,
        //             maxAmount: {
        //                 value: externalTransaction.amount.toString(),
        //                 currency: externalTransaction.currency
        //             }
        //         },
        //         destination: {
        //             address: externalTransaction.toAddress,
        //             amount: {
        //                 value: externalTransaction.amount.toString(),
        //                 currency: externalTransaction.currency
        //             }
        //         }
        //     };

        //     // Get ready to submit the payment
        //     const prepared = await api.preparePayment(wallet.address, payment, {
        //         maxLedgerVersionOffset: 5
        //     });

        //     // Sign the payment using the sender's secret
        //     const { signedTransaction } = api.sign(prepared.txJSON, wallet.privateKey);

        //     // Submit the payment
        //     const resp = await api.submit(signedTransaction);
        //     api.disconnect();
        //     // update data in External transations table.
        //     externalTransaction.txHash = resp.tx_json.hash;
        //     externalTransaction.amount = externalTransaction.amount.toString();
        //     externalTransaction.gasPrice = (parseFloat(resp.tx_json.Fee) * 0.000001).toString();
        //     externalTransaction.isResolved = true;
        //     await externalTransaction.save();
        //     // subtract amount from user's account
        //     const account = await Account.findOne({ userId: externalTransaction.userId })
        //     account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) - parseFloat(JSON.parse(externalTransaction.extras).deducted)
        //     account.save();
        //     return res.status(200).json({ message: "YAYY! The hash of your transaction is: " + resp.tx_json.hash + "\n livenet.xrpl.org to view the status of your transaction!" });
        // }
        else
            return res.status(500).json({ message: "Currency not found." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getPendingTransactions = async function (req, res) {

    const pendingTransactions = await ExternalTransaction.aggregate([
        {
            $match: {
                isResolved: { $ne: true }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        }
    ])

    res.status(200).json({ success: true, message: "List of Panding transactions", pendingTransactions })
};