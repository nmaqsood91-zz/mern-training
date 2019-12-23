const express = require("express")
const router = express.Router()
const verifyToken = require("../../middleare/verifyToken")
const Profile = require("../../models/Profile")
router.get("/", verifyToken, async (req, res) =>  {
    try {
        const _user = await Profile.findOne({
            userId: req.user._id
        }).populate('userId', '-password')
        if(!_user)
            return res.status(404).json({message: "Your profile not found"})
        return res.status(200).json({data: _user})
    } catch (err) {
        return res.status(400).json(err)
    }
})
router.post("/", verifyToken, async function (req, res) {
    try {
        let {body} = req
        body.userId = req.user._id
        const profile = await Profile.create(body)
        return res.status(201).json({
            message:"Your profile is created",
            data: profile
        })
    } catch (err) {
        return res.status(400).json(err)
    }

})

module.exports = router
