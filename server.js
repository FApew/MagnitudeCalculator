// Coded by F. Aiello CL-Robocity All Rigths Reserved
import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

let dirs = [
    "./index.html",
    "./src/style.css",
    "./src/script.js",
    "./src/main.js",
    "./src/data.js",
    "./src/assets/fonts/POIAeronautTrial-Regular.otf",
    "./src/assets/imgs/graph.png",
    "./src/assets/imgs/stars.png",
    "./src/assets/imgs/image.png"
]

dirs.forEach((dir) => {
    app.get(dir, (req, res) => {
        res.sendFile(__dirname + dir)
    })
})

app.listen(8080, () => {
    console.log("App listening on https://localhost:8080/")
})