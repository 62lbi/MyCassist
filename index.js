/** load library express */
const express = require(`express`)

/** load library cors */
const cors = require(`cors`)

/** create object that instances of express */
const app = express()

/** define port of server */
const PORT = 3433

/** open CORS policy */
app.use(cors())

/** run the server based on defined port */
app.listen(PORT, () => {
    console.log(`apparently the port runs on ${PORT}`)
})