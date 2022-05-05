import express from 'express'
import Rand from 'rand-seed';
import { fileHandler } from "./src/fileHandler";
import { User } from "./src/types";
import { randomElementSeed } from "./src/util";
import { getCoordinates } from "./src/coordinates";
const app = express();

const PORT = 3000;

function setHeaders(res : express.Response) {
    res.header("Content-Type",'application/json')
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Cache-Control", "private, max-age=0")
}

app.get('/me',  async (req, res) => {
    const json = await fileHandler("./data/users.json")
    setHeaders(res)
    const users: User[] = JSON.parse(json)
    const seed = new Rand(req.headers['seed'] as string || 'drWho')
    res.send(randomElementSeed(seed, users))
})

app.get('/users', async (req, res) => {
    const users = await fileHandler("./data/users.json")
    setHeaders(res)
    res.send(users)
})

app.get('/activities', async (req, res) => {
    const activities = await fileHandler("./data/activities.json")
    setHeaders(res)
    res.send(activities)
})

app.get('/fromFlights', async (req, res) => {
    const fromFlights = await fileHandler("./data/fromFlights.json")
    setHeaders(res)
    res.send(fromFlights)
})

app.get('/toFlights', async (req, res) => {
    const toFlights = await fileHandler("./data/toFlights.json")
    setHeaders(res)
    res.send(toFlights)
})

app.get('/coordinates', async (req, res) => {
    const userJson = await fileHandler("./data/users.json")
    setHeaders(res)
    const users = JSON.parse(userJson).map(u => ({ userId: u.id, coordinates: getCoordinates() }))
    res.send(JSON.stringify(users))
})

app.options('/me',  async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS")
    res.header("Access-Control-Allow-Headers", "seed")
    res.sendStatus(204)
})

app.get('/robots.txt',  async (req, res) => {
    res.header("Content-Type",'text/plain');
    res.send('User-agent: *\nDisallow: /')
})

app.listen(PORT)

console.log(`App listening on ${PORT}`)
