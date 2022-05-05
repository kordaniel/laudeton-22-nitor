import React, {useState} from 'react';
import activitiesService from "../services/activitiesService";
import Button from 'react-bootstrap/Button';
import {Form} from "react-bootstrap";

const AddActivityForm = ({ coordinates, close, addActivityToMap }) => {
    const [ name, setName ] = useState("");

    const handleInput = event => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const activity = {
            name: name,
            coordinates: {
                lat: coordinates[1],
                long: coordinates[0]
            }
        }
        activitiesService.addActivity(activity).then(newActivity => {
            console.log(newActivity)
            addActivityToMap(newActivity);
        });
        setName("")
        close();
    }

    return (
        <div>
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Form.Control className="mb-2" placeholder="Name" value={name} onChange={handleInput}/>
                <Button type="submit">Add activity</Button>
            </Form>
        </div>
    )
}

export default AddActivityForm;