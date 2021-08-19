const {getUsers,getSingleUser, deleteUserAccount, updateUserAccount,} = require('../controllers/auth.controller');

const express = require('express');
const router = express.Router();

router.get('/',getUsers);
router.get('/:id',getSingleUser);
router.delete('/:id',deleteUserAccount);
router.patch('/:id',updateUserAccount);

module.exports = router;
