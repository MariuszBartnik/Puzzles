const path =  require('path');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require ('dotenv');

dotenv.config();

const handleErrors = (error) => {
    const errors = [];

    if(error.message === 'Invalid email address'){
        errors.push({path: "emailError", message: 'Invalid email address' });
    }

    if(error.message === 'Invalid password'){
        errors.push({path: "passwordError", message: 'Invalid password' });
    }

    if(error.code === 11000){
        errors.push({path: "emailError", message: "This email is already registered"});
    }

    if(error.message.includes("User validation failed")){
        Object.values(error.errors).forEach(err => {
            const {path, message} = err.properties;
            errors.push({path: `${path}Error`, message });
        })
    }

    return errors;
}

const maxAge = 60 * 60 * 24;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
}

const authController = {
    register_get: (req, res) => {
        res.sendFile(path.resolve(__dirname, '../views', 'register.html'));
    },

    login_get: (req, res) => {
        res.sendFile(path.resolve(__dirname, '../views', 'login.html'));
    },

    register_post: async (req, res) => {
        const { email, password } = req.body;

        try{
            const user = await User.create({ email, password });
            const token = createToken(user._id);

            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000 });
            res.json({user: user._id});
        }catch(error){
            const errors = handleErrors(error);
            res.json({errors});
        }
    },

    login_post: async (req, res) => {
        const { email, password } = req.body;

        try{
            const user = await User.login(email, password);
            const token = createToken(user._id);

            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000 });
            res.json({user: user._id});            
        }
        catch(error){
            const errors = handleErrors(error);
            res.json({errors});
        }
    },

    logout_get: (req, res) => {
        res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
        res.redirect('/');
    }
}

module.exports = authController;