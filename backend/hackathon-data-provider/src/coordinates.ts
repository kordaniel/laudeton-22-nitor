import {Coordinates} from "./types";
import {rand, randomElement} from "./util";

// Ruka tunturi area
const topLeft: Coordinates= { lat: 66.1723414404965, long: 29.13545244311584 }
const bottomRight: Coordinates = { lat: 66.16086158577487, long: 29.174419572872228 }

const hotel: Coordinates = { lat: 66.16769778169346, long: 29.13931099097882 }
const polarBar: Coordinates = {lat: 66.16944885418808, long: 29.155163414833567 }
const skiBistro: Coordinates = {lat: 66.16988654330092, long: 29.170672500752087 }


const valueBetween = (upper: number, lower: number, steps = 100): number => {
    const temp = ((upper - lower) / steps) * (rand.next() * steps);
    return lower + temp
}

export const getCoordinates = () => {
    const randomPointInRuka: Coordinates = { lat: valueBetween(topLeft.lat, bottomRight.lat), long: valueBetween(bottomRight.long, topLeft.long) }

    return randomElement([hotel, polarBar, skiBistro, randomPointInRuka])
}