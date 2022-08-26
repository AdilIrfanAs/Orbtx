const mongoose = require('mongoose');


const ExternalTransactionSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        trim: true
    },
    fromAddress: {
        type: String,
        required: 'fromAddress is required',
        trim: true
    },
    toAddress: {
        type: String,
        required: 'toAddress is required',
        trim: true
    },
    txHash: {
        type: String,
        required: false,
        trim: true
    },
    blockNumber: {
        type: Number,
        // required: 'blockNumber is required',
        trim: true
    },
    blockHash: {
        type: String,
        // required: 'blockNumber is required',
        trim: true
    },
    amount: {
        type: String,
        required: 'Amount is required',
        trim: true
    },
    gasPrice: {
        type: String,
        required: false,
        trim: true
    },
    gasLimit: {
        type: String,
        // required: 'gasLimit is required',
        trim: true
    },
    currency: {
        type: String,
        required: 'Currency is required',
        trim: true
    },
    isResolved: {
        type: Boolean,
        required: true,
        default: false
    },
    transactionTime: {
        type: String,
        // required: true,
        trim: true
    },
    transactionType: {
        type: Boolean,  // 0: Inbound , 1: Outbound 
        required: true,
        default: false
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    extras: {
        type: String,
        required: false
    }

}, { timestamps: true });


module.exports = mongoose.model('ExternalTransaction', ExternalTransactionSchema);