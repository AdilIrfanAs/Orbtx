const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Token = require('../models/token');

const UserSchema = new Schema({

    id: Number,
    email: {
        type: String,
        unique: true,
        required: 'Your email is required',
        trim: true
    },

    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },

    password: {
        type: String,
        required: 'Your password is required',
        max: 100
    },

    firstName: {
        type: String,
        required: 'First Name is required',
        max: 100
    },

    lastName: {
        type: String,
        required: 'Last Name is required',
        max: 100
    },

    phone: {
        type: String,
        required: 'Phone number is required',
        max: 15
    },

    bio: {
        type: String,
        required: false,
        max: 255
    },

    mnemonic: {
        type: String,
        required: false,
        default: ''
    },

    profileImage: {
        type: String,
        required: false,
        max: 255
    },
    roleId: {
        type: mongoose.Types.ObjectId,
        default: ObjectId('6231913525b96872210f8f7e'),
        ref: 'Role',
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    verifiedAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    status: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    otpCode: {
        type: String,
        default: ""
    },
    otpStatus: {
        type: Boolean,
        default: false,
    },
    secret: {
        type: String,
        required: false
    },
    qrCode: {
        type: String,
        required: false
    },
    privateKey: {
        type: String,
        required: false,
        default: ''
    }
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.createPassword = function (newPassword) {
    const user = this;
    // if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        // if (err) return next(err);
        if (err) {
            throw new Error(err);
        }

        bcrypt.hash(newPassword, salt, function (err, hash) {
            if (err) {
                throw new Error(err);
            }

            user.password = hash

            // next();
        });
    });
}

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    let payload = {
        id: this._id,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

UserSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

UserSchema.methods.generateVerificationToken = function () {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };

    return new Token(payload);
};

module.exports = mongoose.model('User', UserSchema);