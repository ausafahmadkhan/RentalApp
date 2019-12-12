const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const validRoles = ['ADMIN', 'STUDENT'];

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        minlength : 4,
        maxlength : 20,
        trim : true,
        required : true
    },
    email : {
        type : String,
        minlength : 8,
        maxlength : 15,
        unique : true,
        required : true
    },
    password : {
        type : String,
        minlength : 8,
        maxlength : 255,
        required : true
    },
    role : {
        type : String,
        enum : validRoles,
        required : true
    }
})


userSchema.methods.generateToken = function()
{
    const token = jwt.sign({
        _id : this._id,
        username : this.username,
        email : this.email,
        role : this.role
    }, config.get('mySecretKey'));
    
    return token;
}

const User = mongoose.model('users', userSchema);

function validateUser(user)
{
    const schema = {
        username : Joi.string().min(4).max(20).required(),
        email : Joi.string().min(8).max(15).email().required(),
        password : Joi.string().min(8).max(255).required(),
        role : Joi.string().only(validRoles).required()
    }
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;