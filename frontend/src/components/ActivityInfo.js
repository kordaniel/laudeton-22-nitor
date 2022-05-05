import React, {useEffect, useState} from "react";
import activitiesService from "../services/activitiesService";

const ActivityInfo = ({ id }) => {
    const [ activity, setActivity] = useState(undefined);

    useEffect(() => {
        if (id == null) return;
        activitiesService.getActivity(id).then((activity) => {
            setActivity(activity);
        })
    }, [id])

    if (activity === undefined) {
        return (<div>Loading...</div>)
    }
    return (
        <>
        <div>
            <h3>{activity.activityName}</h3>
        </div>
        <div>
            <h4>Closest users:</h4>
            {activity.userDistances.map(user => (
                <div key={user.name}><b>Name:</b> {user.name} <b>Distance:</b> {(user.distance).toFixed(1)}</div>
            ))}
        </div>
                </>
    )
}

export default ActivityInfo