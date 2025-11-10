import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = process.env.PORT

app.listen(PORT, (req, res) => {
    console.log(`App is listening on ${PORT}`)
})

app.get("/", (req, res) => res.json({message: "here is the app"}))