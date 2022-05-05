import React, {useEffect, useState} from "react";
import activitiesService from "../services/activitiesService";

const ActivityInfo = ({ id }) => {
    const [ activity, setActivity] = useState(undefined);

    useEffect(() => {
        activitiesService.getActivities().then((activities) => {
            const activity = activities.find(activity => activity.id === id);
            console.log(activity)
            setActivity(activity);
        })
    }, [id])
    
    if (activity === undefined) {
        return (<div>Loading...</div>)
    }
    return (
        <div>
            {activity.name}
        </div>
    )
}

export default ActivityInfo