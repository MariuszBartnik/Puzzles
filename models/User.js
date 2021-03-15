const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [(val) => isEmail(val), "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be between 8 and 24 characters"],
        maxlength: [24, "Password must be between 8 and 24 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});



UserSchema.statics.login = async function(email, password){
    const user = await User.findOne({ email });
    if(!user) throw Error('Invalid email address');
    
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if(!isAuthenticated) throw Error('Invalid password');
    
    return user;
}

const User = new mongoose.model('User', UserSchema);
module.exports = User;