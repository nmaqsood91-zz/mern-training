const mongoose = require("mongoose")
const profileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    contact: {
        type: String
    },
    website:{
        type: String
    },
    socialMediaLinks: [{
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        linkedIn: {
            type: String
        }
    }],
    education: [{
    }],
    skills: [],
    githubUserName: {
        type: String
    },
    employement: [{}]

})

const Profile = mongoose.model('Profile', profileSchema)
module.exports = Profile