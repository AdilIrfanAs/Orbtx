const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const { access } = require('../../_helpers/authorize')
const User = require('../controllers/user');
const validate = require('../middlewares/validate');

const router = express.Router();

var upload = multer({ dest: "./upload" });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload");
    },
    filename: function (req, file, cb) {
        var fileExtension = file.mimetype.split("/")[1];
        cb(null, "1" + Date.now() + "." + fileExtension);
    },
});

var upload = multer({ storage: storage });

// const upload = multer().single('profileImage');


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                ADMIN ROUTES

/////////////////////////////////////////////////////////////////////////////////////////////////////////////



//INDEX
router.get('/', User.index);

//STORE
router.post('/add', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('username').not().isEmpty().withMessage('You username is required'),
    check('firstName').not().isEmpty().withMessage('You first name is required'),
    check('lastName').not().isEmpty().withMessage('You last name is required')
], validate, User.store);

router.get('/single-subadmin/:id', User.singleSubAdmin)

// Change Password
router.put('/change-password/:id', User.changePassword);

// subadmins list

router.get('/sub-admins-listing', User.subadminsListing)
router.get('/deleted-sub-admins', User.deletedSubadmins)
router.get('/deleted-users', User.deletedUsers)


// Forget Password Email
router.put('/forget-passsword-email', User.forgetPasswordEmail);
router.put('/recover/:id', User.recover);

router.put('/delete-user/:id', User.destroy);
router.put('/hard-delete-user/:id', User.hard_destroy);

// Forget Password
router.put('/forget-passsword', User.forgetPassword);

//SHOW
router.post('/users', User.usersAgainstRole);

router.get('/:id', User.show);
router.get('/user-details/:id', User.userDetails);

router.get('/referralsAgainstId/:id', User.referralsAgainstId)

// OPT authentication
router.post('/send-otp', User.sendOTP);
router.post('/verify-otp', User.verifyOTP);
router.post('/verify-tfa', User.verifyTFA);

//UPDATE
router.put('/:id', upload.single('image'), User.update);

//DELETE
// router.delete('/:id', User.destroy);








/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                USER ROUTES

/////////////////////////////////////////////////////////////////////////////////////////////////////////////




module.exports = router;