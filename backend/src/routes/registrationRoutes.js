const express = require('express');
const { createRegistration, listRegistrations, stats, getRegistration, updateRegistration } = require('../controllers/registrationsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createRegistration);
router.get('/', auth, listRegistrations);
router.get('/stats', stats);
router.get('/:id', auth, getRegistration);
router.put('/:id', auth, updateRegistration);

module.exports = router;
