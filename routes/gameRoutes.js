const { Router } = require('express');
const gameController = require('../controllers/gameController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

router.get('/play', isAuthenticated, gameController.play_get_page);
router.get('/ranking', isAuthenticated, gameController.ranking_get_page);
router.get('/ranking/data', isAuthenticated, gameController.ranking_get_data);
router.get('/ranking/user-data', isAuthenticated, gameController.ranking_get_user_data);
router.post('/ranking/user-data', isAuthenticated, gameController.ranking_post_data);
router.put('/ranking/user-data', isAuthenticated, gameController.ranking_put_data);


module.exports = router;