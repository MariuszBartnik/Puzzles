const { Router } = require('express');
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

router.get('/register', isNotAuthenticated, authController.register_get);
router.get('/login', isNotAuthenticated, authController.login_get);
router.post('/register', authController.register_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);


module.exports = router;