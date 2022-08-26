const express = require('express');
const Transaction = require('../controllers/transaction');

const router = express.Router();

//INDEX
router.get('/', Transaction.index);

//STORE
router.post('/add', Transaction.store);
router.post('/sell-short', Transaction.sellShort);

//SHOW
router.get('/:id', Transaction.show);

//UPDATE
// router.put('/:id', Transaction.update);

//DELETE
router.delete('/:id', Transaction.destroy);

module.exports = router;
