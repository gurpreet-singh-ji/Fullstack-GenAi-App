import express from "express"
import authRouter from "./routes/auth.routes.js"
import aiRouter from "./routes/ai.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/interview", aiRouter)

export default app

