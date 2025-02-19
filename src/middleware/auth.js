const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({
            error: 'Please authenticate.',
            theError: e
        })
    }
}

const validateUser = async (req, res, next) => {
    //get token
    let decoded = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET)
    
    //check if the user exists
    const user =  await User.findOne({
        _id: decoded._id,
        'tokens.token': req.header('Authorization')
    })
    if(!user) {
        return {
            error: "User not created"
        }
    }
    //save it to req variable 
    req.authToken = decoded
    //next()
    next()
}

module.exports = { 
    auth,
    validateUser
}