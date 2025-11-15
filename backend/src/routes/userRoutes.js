const express = require('express');
const { getMe, updateMe } = require('../controllers/usersController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

module.exports = router;
