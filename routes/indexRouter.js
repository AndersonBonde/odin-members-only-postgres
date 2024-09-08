const { Router } = require('express');
const indexController = require('../controllers/indexController');

const router = new Router();

router.get('/', indexController.index);
router.get('/signup', indexController.signUpGet);
router.get('/message', indexController.newMessageGet);
router.post('/message', indexController.newMessagePost);

module.exports = router;
