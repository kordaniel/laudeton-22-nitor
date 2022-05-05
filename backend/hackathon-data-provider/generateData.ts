import {activity} from "./src/factories/Activity";
import {flight} from "./src/factories/Flight";
import {user} from "./src/factories/User";
import fs, { readFileSync } from "fs"
import {randomElement, rand} from "./src/util";

const writeDataToFile = async (filename: string, data: Array<object>) => {
    fs.writeFile("./data/" + filename, JSON.stringify(data), (err) => {
        if(err) {
            console.error(err)
        }
        console.log("wrote", filename)
    })
}

const userNames = readFileSync('random-names/users.txt').toString('utf-8').split('\n').map(row => {
    const split = row.split(',')
    return {email:split[0], name:split[1]}
}).filter(x => rand.next()>0.5)

const activities = ["Visit to Reindeer Farm", "Snowmobile Safari", "Cross Country Skiing", "Downhill Skiing"].map(n => activity({ name: n }))
const toFlights = ["AYY-666", "AYY-1337"].map(n => flight({ name: n }))
const fromFlights = ["AYY-FOO", "AYY-BAR"].map(n => flight({ name: n }))

const users = Array.from({ length: 20 }).map((_, i) => user({
    activityId: randomElement(activities).id,
    toFlightId: randomElement(toFlights).id,
    fromFlightId: randomElement(fromFlights).id,
    name: userNames[i].name,
    email: userNames[i].email
}))

Promise.all([
    writeDataToFile("users.json", users),
    writeDataToFile("activities.json", activities),
    writeDataToFile("toFlights.json", toFlights),
    writeDataToFile("fromFlights.json", fromFlights)
]).then(() => {
    console.log("Done")
})

