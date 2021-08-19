const {createUser,login, changePassword, forgotPassword, verifyForgotPassword,} = require('../controllers/auth.controller');

const express = require('express');
const router = express.Router();

router.post('/register',createUser);
router.post('/login',login);
router.patch('/password/:id',changePassword);
router.post('/password/reset',forgotPassword);
router.post('/password/verify',verifyForgotPassword);
module.exports = router;
