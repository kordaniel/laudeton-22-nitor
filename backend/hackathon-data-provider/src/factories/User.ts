import {User} from "../types";
import {id} from "./util";

export const user = (partial: Partial<User>): User => ({
    id: id('U'),
    name: "moro",
    email: "moro.poro",
    fromFlightId: '',
    toFlightId: '',
    imageUrl: "www.foo.jpg",
    activityId: '',
    ...partial
})