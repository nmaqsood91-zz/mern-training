const mongoose = require("mongoose")
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        }
    }],
    comments: [{
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        createAt: {
            type: Date,
            default: Date.now()
        },
        avatar: {
            type: String
        }  
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post