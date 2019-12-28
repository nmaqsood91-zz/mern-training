const User = require("../models/User")
const jwt = require("jsonwebtoken")
const config = require("config")
module.exports = async function (req, res, next) {
    try {
        const token = req.headers["x-token"]
        const {body: {email, password}} = req
        if(!token)
            return res.status(401).json({message: "Token is required"})
        const decodedUser = jwt.verify(token, config.secret)
        if(!decodedUser)
            return res.status(401).json({message:"Token mismatch"})
        const user = await User.findOne({email: decodedUser.email}).lean()
        if(!user)
            return res.status(401).json({message:"User not found"})
        req.user = user
        next()
    } catch (err) {
        return res.status(400).json({error: err.message})
    }
}