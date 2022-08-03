require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 5000
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fu = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fu({}))
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`server has successfully started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()