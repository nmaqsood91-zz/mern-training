const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require("config")
const bcrypt = require("bcrypt")
const verifyToken = require("../../middleare/verifyToken")
let hash = "testing"
router.post("/", [
    check('password').isLength({ min: 6 }),
    check('email').isEmail(),
],async function (req, res) {
    try {
        const errors = validationResult(req);
        const salt = await bcrypt.genSalt(10)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const result = await User.findOne({email: req.body.email}).lean()
        if(result)
            return res.status(409).json({message: "Email already exist"})
        let _user = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
        }
        _user.password = await bcrypt.hash(req.body.password, salt)
        const _results = await User.create(_user)
        return res.status(201).json({
            message: "User created successfully"
        })
    } catch (err) {
        return res.status(400).json(err.message)
    }
})


router.post("/login", async function (req, res) {
    const salt = await bcrypt.genSalt(10)
    let {body: {email, password}} = req
    const result = await User.findOne({
      email
    }).lean()
    if(!result)
        return res.status(404).json({message: "User not found"})
    let flag = await bcrypt.compare(password, result.password)
    if(!flag)
        return res.status(401).json({message: "User email or password not found"})
    const token = jwt.sign({ 
        email: result.email,
        username: result.username
    }, config.secret);

    return res.status(200).json({
        message:"User verified successfully",
        token
    })

})


module.exports = router
