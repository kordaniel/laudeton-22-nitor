export interface User {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    toFlightId: Flight['id'];
    fromFlightId: Flight['id'];
    activityId: Activity['id'];
}

export interface Activity {
    id: string;
    name: string;
}

export interface Flight {
    id: string;
    name: string;
}

export interface Coordinates {
    lat: number;
    long: number;
}