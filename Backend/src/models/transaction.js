const mongoose = require('mongoose');


const TransactionSchema = new mongoose.Schema({

    id: Number,

    fromAccount: {
        type: mongoose.Types.ObjectId,
        required: 'fromAccount address is required',
        trim: true
    },
    toAccount: {
        type: mongoose.Types.ObjectId,
        required: 'toAccount address is required',
        trim: true
    },
    amount: {
        type: String,
        required: 'Amount is required',
        trim: true
    },
    currencyId: {
        type: mongoose.Types.ObjectId,
        required: 'Currency Id is required',
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('Transaction', TransactionSchema);