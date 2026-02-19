import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRouter.js'

// app config 
const app =express()
const port =process.env.PORT||4000
connectDB()

// middlewares

app.use(express.json())
// app.use(cors())

app.use(cors({
  origin: [
    "https://manga-go-zha8.vercel.app",
    "https://manga-go-iuot.vercel.app"
  ]
}));

// api endpoint
app.use('/api/user/',userRouter)
app.get('/',(req,res)=>{
    res.send("Api working")
})
app.use('/api/admin/',adminRouter)


app.listen(port,()=> console.log("Server stared"))