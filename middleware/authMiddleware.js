const jwt = require('jsonwebtoken');

const checkToken = (token) => {
    return new Promise((resolve, reject) => {
        if(!token) reject();
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) reject();
    
            resolve(decodedToken);
        });
    });
}

// Check if user if logged in to toggle buttons on main page
const isLoggedInToggle = async (req, res, next) => {
    const token = req.cookies.jwt;

    try{
        const decodedToken = await checkToken(token);   
        req.isLoggedIn = true;
        next();
    }catch(err){
        req.isLoggedIn = false;
        next();
    }
}

// Check if user is logged in - if not redirect to login screen
const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.jwt;

    try{
        const decodedToken = await checkToken(token);   
        req.id = decodedToken.id;
        next();
    }catch(err){
        res.redirect('/auth/login');
    }
}

// Checked is user is logged out - if not redirect to play a game page
const isNotAuthenticated = async (req, res, next) => {
    const token = req.cookies.jwt;
    
    try{
        const decodedToken = await checkToken(token);   
        res.redirect('/game/play')
    }catch(err){
        next();
    }
}

module.exports = {
    checkToken, 
    isAuthenticated, 
    isLoggedInToggle,
    isNotAuthenticated
}