const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const verifyToken = require("../../middleare/verifyToken")
router.get("/", verifyToken, async function (req, res) {
    try {
        const result = await User.findOne({_id: req.user._id})
        return res.status(200).json(result)
    } catch (err) {
        return res.status(400).json(err.message)
    }
})

module.exports = router
