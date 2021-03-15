const path = require('path');

const User = require('../models/User');
const HighScore = require('../models/HighScore');

const gameController = {
    play_get_page: (req, res) => {
        res.sendFile(path.resolve(__dirname, '../views', 'game.html'));
    },

    ranking_get_page: (req, res) => {
        res.sendFile(path.resolve(__dirname, '../views', 'ranking.html'));
    },

    ranking_get_data: async (req, res) => {
        let highscores = await HighScore.find().sort({ score: -1 }).limit(5);
        let userHighscore;
        let position;

        const isUserInHighscores = highscores.find(score => score.userId === req.id);
        if(!isUserInHighscores){
            userHighscore = await HighScore.findOne({userId: req.id});

            // check user position in ranking
            if(userHighscore){
                position = await HighScore.countDocuments({score: {$gt: userHighscore.score}});
            }
        }

        res.json({ highscores, userHighscore, position });
    },

    ranking_get_user_data: async (req, res) => {
        const userHighScore = await HighScore.findOne({userId: req.id});
        if(userHighScore) {
            res.status(200).json({ userHighScore });
        }
        else{
            res.json({});
        }
    },

    ranking_post_data: async (req, res) => {
        const { newScore } = req.body;

        try{
            const user = await User.findById(req.id);
            const newHighScore = await HighScore.create({email: user.email, userId: user._id, score: newScore });
    
            res.status(201).json({newHighScore});
        }
        catch(error){
            console.log(error);
        }
    },

    ranking_put_data: async (req, res) => {
        const { newScore } = req.body;

        try{
            const newHighScore = await HighScore.findOneAndUpdate({ userId: req.id }, { score: newScore }, {useFindAndModify: false});            
            res.status(200).json(newHighScore);
        }
        catch(error){
            console.log(error);
        }
    }
}

module.exports = gameController;
