const express = require("express")
const router = express.Router()
const Post = require("../../models/Post")
const mw = require("../../middleare/verifyToken")
const { check, validationResult } = require('express-validator');
router.get("/", mw, async function(req,res) {
    try {
        const result = await Post.find().populate('user')
        return res.status(200).json(result)
    } catch (err) {
        return status(500).json(err.message)
    }
})

router.get("/:postId", async (req, res) => {
    try {
        const result = await Post.findOne({_id: req.params.postId})
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

router.post("/", mw,[
    check('text').not().isEmpty(),
    check('name').not().isEmpty(),
    ], async (req, res) => {
    try {
        const {body, user} = req
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
        const post = await Post.findOne({_id: req.params.postId})
        if(!post)
            return res.status(404).json({
                message: "Post not found"
            })
        await Post.deleteOne({_id: req.params.postId})
        return res.status(200).json({
            message: "Post deleted!"
        })
    } catch (err) {
        return res.status(400).json(err.message)
    }
})

router.post("/like/:postId", mw, async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.postId})
        if(!post)
            return res.status(404).json({
                message: "Post not found"
            })
        if (post.likes.length > 0) {
            const result = post.likes.filter(like => {
                if(like.user.toString() === req.user._id.toString()) 
                    return like
            });
            if (result.length > 0)
                return res.status(409).json({
                    message: "You had already liked this post"
                })
            }
        post.likes.unshift({user: req.user._id})
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
        const post = await Post.findOne({_id: req.params.postId})
        if(!post)
            return res.status(404).json({
                message: "Post not found"
            })
        /** Does post has likes */
        if(post.likes.length > 0){
            const result = post.likes.filter(async like => {
                /** check User's like */
                if(like.user.toString() === req.user._id.toString()){
                    let likeArray = post.likes;
                    console.log("Array before",likeArray)
                    /** Remove User's like only */
                    likeArray.splice(post.likes.indexOf(like.user.toString()), 1 );
                    console.log("Arrat after",likeArray)
                    post.likes = likeArray;
                    /** Update post */
                    await Post.updateOne({_id: req.params.postId}, {$set: {"likes": likeArray}})
                    return res.status(200).json({
                        message: "Unlike successfully"
                    })
                }else{
                    /** Post has likes but user didn't like */
                    return res.status(404).json({
                        message: "You didn't like"
                    })
                }
            })
        } else {
            return res.status(400).json({
                message: "didn't found any like"
            })
        }
    } catch (err) {
        return res.status(400).json(err.message)
    }
})

router.post("/comment/:postId", mw, [
    check('text').not().isEmpty(),
] , async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        const post = await Post.findOne({_id: req.params.postId})
        if(!post)
            return res.status(404).json({
                message: "Post not found"
            })
        let postComment = {
            user: req.user._id,
            text: req.body.text
        }
        post.comments.push(postComment)
        await Post.updateOne({_id: req.params.postId}, {$set: {"comments": post.comments}})
        return res.status(200).json({
            message: "Commented successfully!"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

router.delete("/comment/:postId/:commentId", mw, async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.postId})
        if(!post)
            return res.status(404).json({
                message: "Post not found"
            })
        /** Does post has comment */
        if(post.comments.length > 0){
            console.log("post data: ", post.comments)
            console.log(req.params.commentId)
            const result = post.comments.filter(async comment => {
                /** check User's commented */
                if(comment._id.toString() === req.params.commentId.toString()){
                    let commentsArray = post.comments;
                    /** Remove User's like only */
                    commentsArray.splice(post.comments.indexOf(req.params.commentId.toString()), 1 );
                    console.log("Arrat after",commentsArray)
                    post.comments = commentsArray;
                    /** Update post */
                    await Post.updateOne({_id: req.params.postId}, { $set: {"comments": commentsArray}})
                    return res.status(201).json({
                        message: "Comment Deleted!"
                    })
                }else{
                    /** Post has likes but user didn't like */
                    return res.status(404).json({
                        message: "You didn't comment"
                    })
                }
            })
        } else {
            return res.status(400).json({
                message: "No comment found "
            })
        }
    } catch(err) {

    }
})
module.exports = router