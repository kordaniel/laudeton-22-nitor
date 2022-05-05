import express from 'express'
import cors from 'cors'
import Rand from 'rand-seed';
import { fileHandler, fileWriter } from "./src/fileHandler";
import { User } from "./src/types";
import { randomElementSeed } from "./src/util";
import { getCoordinates } from "./src/coordinates";
const app = express();

app.use(express.json())
app.use(cors())
const PORT = 3000;

function setHeaders(res : express.Response) {
    res.header("Content-Type",'application/json')
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Cache-Control", "private, max-age=0")
}

function generateId(objects) {
    const jsonObjects = JSON.parse(objects)
    const idLetters = 1;
    const idNums    = 1;
    const letters   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers   = '0123456789';
    const lettersLength = letters.length;
    const numbersLength = numbers.length;

    var newId = 'A1';
    while (jsonObjects.filter(o => o.id === newId).length > 0) {
        newId = '';
        newId += letters.charAt(Math.floor(Math.random() * lettersLength));
        newId += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }

    return newId;
}

function getDistance(coordsA, coordsB) {
    const distLat = coordsA.lat  - coordsB.lat;
    const distLon = coordsA.long - coordsB.long;

    return Math.sqrt( (distLat * distLat) + (distLon * distLon) );
}

function getClosestUser(user, allUsers) {
    let closestUserId = '';
    let distance = -1;
    let closest = null;
    allUsers.filter(u => u.userId != user.userId).forEach(u => {
        const distancePair = getDistance(user.coordinates, u.coordinates);

        if (distance === -1) {
            closestUserId = u.userId;
            distance = distancePair;
            closest = u;
        } else if (distancePair < distance) {
            closestUserId = u.userId;
            distance = distancePair;
            closest = u;
        }
    });

    return closest;
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

app.get('/nearest/:uid', async (req, res) => {
    const usersJson = await fileHandler("./data/users.json");
    const usersInfo = JSON.parse(usersJson).map(u => ({ userId: u.id, coordinates: getCoordinates() }));
    const user = usersInfo.filter(u => u.userId === req.params.uid);
    if (user.length === 0) {
        return res.status(400).json({
            error: "UID not found"
        });
    }

    const closestUser = getClosestUser(user[0], usersInfo);

    setHeaders(res)
    res.send(JSON.stringify(closestUser));
})

app.post('/activities', async (req, res) => {
    const activities = await fileHandler("./data/activities.json");
    const newId = generateId(activities);

    const body = req.body
    if (!body.name) {
        return res.status(400).json({
            error: 'Activity name is missing'
        });
    }
    if (!body.coordinates) {
        return res.status(400).json({
            error: 'Activity coordinates are missing'
        });
    }

    const activity = { id: newId, ...body }
    fileWriter("./data/activities.json", activity)

    res.json(activity)
})

app.listen(PORT)

console.log(`App listening on ${PORT}`)
