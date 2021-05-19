const express = require('express');
const router = express.Router();
const controller = require('../../controllers/recovery-pass');

router.post('/', controller.recovery);
router.post('/remind', controller.remind);
router.post('/confirm', controller.confirm);
router.post('/resend', controller.resend);

module.exports = router;
