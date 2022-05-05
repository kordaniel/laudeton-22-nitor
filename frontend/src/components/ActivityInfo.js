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
            <h4>Lähimmät käyttäjät:</h4>
            {activity.userDistances.map(user => (
                <div key={user.name}><b>Nimi:</b> {user.name} <b>Etäisyys:</b> {(user.distance).toFixed(1)}</div>
            ))}
        </div>
                </>
    )
}

export default ActivityInfo