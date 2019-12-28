const express = require("express")
const router = express.Router()
const Post = require("../../models/Post")
const mw = require("../../middleware/verifyToken")
const { check, validationResult } = require('express-validator');
router.get("/", mw, async function (req, res) {
    try {
        const result = await Post.find().populate('user')
        return res.status(200).json(result)
    } catch (err) {
        return status(500).json(err.message)
    }
})

router.get("/:postId", async (req, res) => {
    try {
        const result = await Post.findOne({ _id: req.params.postId })
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

router.post("/", mw, [
    check('text').not().isEmpty(),
    check('name').not().isEmpty(),
], async (req, res) => {
    try {
        const { body, user } = req
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        console.log('user', user)
        let post = {
            name: body.name,
            text: body.text,
            user: user._id
        }
        const result = await Post.create(post)
        return res.status(201).json(result)
    } catch (err) {
        return res.status(400).json(err.message)
    }
})

router.delete("/:postId", mw, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId })
        if (!post)
            return res.status(404).json({
                message: "Post not found"
            })
        await Post.deleteOne({ _id: req.params.postId })
        return res.status(200).json({
            message: "Post deleted!"
        })
    } catch (err) {
        return res.status(400).json(err.message)
    }
})

router.post("/like/:postId", mw, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId })
        if (!post)
            return res.status(404).json({
                message: "Post not found"
            })
        if (post.likes.length > 0) {
            const result = post.likes.filter(like => {
                if (like.user.toString() === req.user._id.toString()) {
                    // console.log(like)
                    return like
                }
            })
            if (result.length > 0)
                return res.status(409).json({
                    message: "You had already liked this post"
                })
        }
        post.likes.unshift({ user: req.user._id })
        post.save()
        return res.status(200).json({
            message: "You had liked the post successfully!"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

router.delete("/like/:postId", mw, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId })
        if (!post)
            return res.status(404).json({
                message: "Post not found"
            })
        if (post.likes.length > 0) {
            const result = post.likes.filter(like => {
                if (like.user.toString() === req.user._id.toString())
                    if (like.length > 0) {
                        post.likes.splice(post.likes.indexOf({ user: req.user._id }), 1)
                        post.save()
                        return res.status(200).json({
                            message: "You had Unliked the post successfully!"
                        })
                    }
            })
        }
        return res.status(409).json({
            message: "You had already unliked this post"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

router.post("/comment/:postId", mw, [
    check('text').not().isEmpty(),
    check('user').not().isEmpty(),
], async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId })
        if (!post)
            return res.status(404).json({
                message: "Post not Found"
            })
        if (post.comments.length > 0) {
            post.comments.filter(comment => {
                if (comment.user.toString() === req.user._id.toString()) {
                    post.comments.unshift({ user: req.user._id })
                    post.save()
                    return res.status(200).json({
                        message: "Commented on the post successfully!"
                    })
                }
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

router.delete("/comment/:postId", mw, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        if (!post)
            return res.status(404).json({
                message: err.message
            })
        //code to delete the comment 
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

module.exports = router