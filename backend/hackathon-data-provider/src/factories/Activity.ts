import { Activity } from "../types";
import {id} from "./util";

export const activity = (partial: Partial<Activity>): Activity => ({
    id: id('A'),
    name: "Aktiviteetti",
    ...partial
})