const {getAllEmergency,getAllUserEmergency,getSingleEmergency,deleteEmergency,createAlertEmergency, deleteAllEmergency} = require('../controllers/emergency.controller');

const express = require('express');
const router = express.Router();

router.post('/report',createAlertEmergency);
router.delete('/:id',deleteEmergency);
router.get('/user/:id',getAllUserEmergency);
router.get('/:id',getSingleEmergency);
router.get('/',getAllEmergency);
router.delete('/',deleteAllEmergency);

module.exports = router;
