const config = require("config")
const mongoose = require("mongoose")

function connect() {
    try {
        mongoose.connect(config.mognodb_uri, { 
            useNewUrlParser: true,
            useUnifiedTopology: true 
        })
        mongoose.connection.on("error", (error) => {
            console.log(error)
        })
        mongoose.connection.on("open", () => {
            console.log("connection made with atlas")
        })
        mongoose.set('debug', true)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {connect}

