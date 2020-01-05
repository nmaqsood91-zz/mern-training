const express = require("express")
const app = express()
const cors = require('cors')
const port = 5000
const {connect} = require("./models/index")
connect()
/**
 * requiring routes from the routes/api folder
 */
const user = require("./routes/api/users")
const profile = require("./routes/api/profile")
const auth = require("./routes/api/auth")
app.use(cors())
 /** express middleware to parse JSON body */
 app.use(express.json({urlencoded: false}))

/**
 * using the routes that are imported in the above line
 */
app.use("/api/v1/users", user)
app.use("/api/v1/auth", auth)
app.use("/api/v1/profile", profile)
app.use("/api/v1/posts", require("./routes/api/post"))
app.listen(process.env.PORT || port, () => {
    console.log(' Server is up and running ')
})