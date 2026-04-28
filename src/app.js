import cookieParser from 'cookie-parser'
import express from 'express'
import authController from './routes/user.route.js'

const app= express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authController)

export default app