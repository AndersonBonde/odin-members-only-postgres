const { Router } = require('express');
const indexController = require('../controllers/indexController');

const router = new Router();

router.get('/', indexController.index);
router.get('/signup', indexController.signUpGet);
router.post('/signup', indexController.signUpPost);
router.get('/login', indexController.loginGet);
router.post('/login', indexController.loginPost);
router.get('/logout', indexController.logoutGet);
router.get('/member', indexController.memberPageGet);
router.post('/member', indexController.memberPagePost);
router.get('/message', indexController.newMessageGet);
router.post('/message', indexController.newMessagePost);
router.get('/admin', indexController.adminGet);
router.post('/admin', indexController.adminPost);

module.exports = router;
