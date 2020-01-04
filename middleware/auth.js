const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next)
{
    const token = req.header("X-Auth-Token");
    if (!token)
        return res.status(401).send("Access Denied! No token provided");
    
    try
    {
        const decoded = jwt.verify(token, config.get('mySecretKey'));
        req.user = decoded;
        next();
    }
    catch(exception)
    {
        res.status(400).send('Invalid Token');
    }   
}