const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.use(express.json());

router.post('/authenticate', async (req, res) => {
    
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email : req.body.email});
    if (!user)
        return res.status(400).send('Invalid email/password');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send('Invalid email/password');

    const token = user.generateToken();
    return res.header('X-Auth-Token', token).send("Login successful");
})

function validate(loginRequest)
{
    const schema = {
        email : Joi.string().email().required(),
        password : Joi.string().required()
    }
    return Joi.validate(loginRequest, schema);
}

module.exports = router;