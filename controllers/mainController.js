const path = require('path');
const { checkToken } = require('../middleware/authMiddleware');

const mainController = {
    index_get: (req, res) => {
        res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
    },

    index_isLogged_get: async (req, res) => {
        const token = req.cookies.jwt;

        try{
            const decodedToken = await checkToken(token);
            res.json({isLoggedIn: true});
        }catch(err){
            res.json({isLoggedIn: false});
        }
    },

    page_404_get: (req, res) => {
        res.sendFile(path.resolve(__dirname, '../views', '404.html'));
    }
}

module.exports = mainController;