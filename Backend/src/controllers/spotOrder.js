const SpotOrder = require("../models/spotOrder");
const User = require("../models/user");
const Account = require("../models/account");
const Currency = require('../models/currency');
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const https = require('https');

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.index = async function (req, res) {
    try {
        const orders = await SpotOrder.aggregate([
            {
                $match: {
                    userId: ObjectId("62bad7ef85b2f48e5ac70d5b")
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'fromCurrency',
                    foreignField: '_id',
                    as: 'fromCurrency'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'toCurrency',
                    foreignField: '_id',
                    as: 'toCurrency'
                }
            },
            {
                $unwind: '$fromCurrency'
            },
            {
                $unwind: '$toCurrency'
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
            },
        ]).sort({ "created_at": -1 })
        res.status(200).json({ success: true, message: "All orders", orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST api/account/add
// @desc Add a new account
// @access Public
exports.store = async (req, res) => {
    try {
        const newOrder = new SpotOrder({ ...req.body });
        const data = { ...req.body };
        if (data.marketOrder == 1) {
            newOrder.status = 2;
            newOrder.isResolved = true;
        } else {
            newOrder.status = 1;
            newOrder.isResolved = false;
        }
        const account = await Account.findOne({ userId: data.userId })
        account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).amount) - parseFloat(data.userInvestedAmount);
        account.save();

        const order_ = await newOrder.save();
        res.status(200).json({ success: true, message: "Spot order created successfully", order_ })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET api/account/{id}
// @desc Returns a specific account
// @access Public
exports.show = async function (req, res) {
    try {
        const userOrderss = await SpotOrder.aggregate([
            {
                $match: {
                    userId: ObjectId(req.params.id)
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'fromCurrency',
                    foreignField: '_id',
                    as: 'fromCurrency'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'toCurrency',
                    foreignField: '_id',
                    as: 'toCurrency'
                }
            },
            {
                $unwind: '$fromCurrency'
            },
            {
                $unwind: '$toCurrency'
            }
        ])
        // console.log("userOrderss: ", userOrderss);
        const userOrders = userOrderss.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        });
        res.status(200).json({ success: true, message: "User's orders", userOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT api/account/{id}
// @desc Update account details
// @access Public
exports.update = async function (req, res) {
    try {
        let data = { ...req.body }
        const leverageOrder = await SpotOrder.findById(data._id);
        if (leverageOrder) {
            let tradeEndPrice = 0;
            let maintainance = 1;

            if (data.tradeType == 0) {
                tradeEndPrice = (data.tradeStartPrice * data.leverage) / (data.leverage + 1 - (data.leverage * 0.01))
            } else {
                // buy
                tradeEndPrice = (data.tradeStartPrice * data.leverage) / (data.leverage - 1 + (data.leverage * 0.01))
            }

            data.tradeEndPrice = tradeEndPrice;

            const account = await Account.findOne({ userId: data.userId })

            account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).amount) - (0 - (parseFloat(leverageOrder.userInvestedAmount) - parseFloat(data.userInvestedAmount)));

            account.save();
            const leverageOrder_ = await SpotOrder.findByIdAndUpdate(data._id, data)
            res.status(200).json({ success: true, message: "Updated" });
        }
        else {
            res.status(200).json({ success: true, message: "Order Not Found" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.destroy = async function (req, res) {
    try {
        res.status(200).json({ success: true, message: "Delete is Pending" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.stop = async function (req, res) {
    try {
        const id = req.params.id;
        const spotOrder = await SpotOrder.findById(id);

        const account = await Account.findOne({ userId: spotOrder.userId.toString() });
        account.amounts.find(row => row.currencyId.toString() == spotOrder.fromCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == spotOrder.fromCurrency.toString()).amount) + parseFloat(spotOrder.userInvestedAmount);
        account.save();

        spotOrder.status = 3;
        spotOrder.isResolved = true;
        spotOrder.save();
        res.status(200).json({ success: true, message: "Order is Stopped" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.complete = async function (req, res) {
    try {
        const id = req.params.id;
        const spotOrder = await SpotOrder.findById(id);

        const account = await Account.findOne({ userId: spotOrder.userId.toString() });
        var total = spotOrder.tradeType == 0 ? spotOrder.userInvestedAmount * spotOrder.tradeStartPrice : spotOrder.userInvestedAmount / spotOrder.tradeStartPrice;
        account.amounts.find(row => row.currencyId.toString() == spotOrder.toCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == spotOrder.toCurrency.toString()).amount) + parseFloat(total);
        account.save();

        spotOrder.status = 2;
        spotOrder.isResolved = true;
        spotOrder.save();
        res.status(200).json({ success: true, message: "Order is Completed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.userOrders = async function (req, res) {
    try {
        const orders = await SpotOrder.aggregate([
            {
                $match: {
                    userId: ObjectId(req.params.id)
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'fromCurrency',
                    foreignField: '_id',
                    as: 'fromCurrency'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'toCurrency',
                    foreignField: '_id',
                    as: 'toCurrency'
                }
            },
            {
                $unwind: '$fromCurrency'
            },
            {
                $unwind: '$toCurrency'
            }
        ]).sort({ "created_at": -1 })
        res.status(200).json({ success: true, message: "All orders", orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPendingOrders = async function (req, res) {
    try {
        const orders = await SpotOrder.aggregate([
            {
                $match: {
                    isResolved: { $ne: true }
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'fromCurrency',
                    foreignField: '_id',
                    as: 'fromCurrency'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'toCurrency',
                    foreignField: '_id',
                    as: 'toCurrency'
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
            },
            {
                $unwind: '$fromCurrency'
            },
            {
                $unwind: '$toCurrency'
            }
        ]).sort({ "created_at": -1 })
        res.status(200).json({ success: true, message: "All orders", orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};