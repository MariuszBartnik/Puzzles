const mongoose = require("mongoose");

const HighScoreSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,    
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const HighScore = new mongoose.model('highscore', HighScoreSchema);

module.exports =  HighScore;