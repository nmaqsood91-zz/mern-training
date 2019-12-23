const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require("config")
const verifyToken = require("../../middleare/verifyToken")
router.post("/", [
    check('password').isLength({ min: 6 }),
    check('email').isEmail(),
],async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const result = await User.findOne({email: req.body.email}).lean()
        if(result)
            return res.status(409).json({message: "Email already exist"})
        const _results = await User.create(req.body)
        const token = jwt.sign({ 
            email: _results.email,
            username: _results.username
        }, config.secret);

        return res.status(201).json({
            message: "User created successfully",
            token
        })
    } catch (err) {
        return res.status(400).json(err.message)
    }
})


router.post("/verify", verifyToken, async function (req, res) {
  return res.status(200).json({message: "User Verified"})
})


module.exports = router
