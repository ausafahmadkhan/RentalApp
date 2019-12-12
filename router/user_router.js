const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const _ = require('lodash');
const { User, validateUser } = require('../models/user')

router.use(express.json());

router.post("/addUser", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email : req.body.email});

    if (user)
        return res.status(400).send("User already registered");
    
    user = new User(_.pick(req.body, ['username', 'email', 'password', 'role']));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    user = await user.save();

    const token = user.generateToken();

    return res.status(200)
            .header('X-Auth-Token', token)
            .send(_.pick(user, ['username', 'email', 'role']));
})

module.exports = router;