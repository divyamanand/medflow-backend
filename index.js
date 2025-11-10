import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})

app.get("/", (_, res) => res.json({message: "here is the updated app with pm2"}))