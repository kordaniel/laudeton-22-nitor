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

function degToRadians(degrees) {
    return (degrees * Math.PI) / 180.0;
}

// Returns the distance between two points in kilometers
function haversine(coordsA, coordsB) {
    const earthR = 6372.8;
    const dLat = degToRadians(coordsA.lat - coordsB.lat);
    const dLon = degToRadians(coordsA.long - coordsB.long);
    const Alat = degToRadians(coordsA.lat);
    const Blat = degToRadians(coordsB.lat);

    const a = Math.pow(Math.sin(dLat/2), 2)
            + Math.cos(Alat) * Math.cos(Blat) * Math.pow(Math.sin(dLon/2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return earthR * c;
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

function getUsersDistances(activity, users) {
    const activityName = activity.name;
    let userDistances = [];
    users.forEach(u => {
        const distance = haversine(u.coordinates, activity.coordinates);
        userDistances = userDistances.concat({
            name: u.name, distance: distance
        });
    });

    userDistances.sort(function(a, b) { return a.distance - b.distance });

    return { activityName, userDistances };
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

app.get('/activities/:aid', async (req, res) => {
    const activitiesJson = await fileHandler("./data/activities.json")
    const activities = JSON.parse(activitiesJson).filter(a => a.id === req.params.aid);

    if (activities.length === 0) {
        return res.status(400).json({
            error: "Activity ID not found"
        });
    }

    const activity = activities[0];
    const userJson = await fileHandler("./data/users.json")
    const users = JSON.parse(userJson).map(u => ({ userId: u.id, name: u.name, coordinates: getCoordinates() }))

    const responseJson = getUsersDistances(activity, users);

    setHeaders(res)
    res.send(JSON.stringify(responseJson));
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
