import React, {useState} from 'react';
import activitiesService from "../services/activitiesService";
import Button from 'react-bootstrap/Button';
import {Form, InputGroup} from "react-bootstrap";

const AddActivityForm = ({ coordinates, close }) => {
    const [ name, setName ] = useState("");

    const handleInput = event => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const activity = {
            name: name,
            coordinates: coordinates
        }
        activitiesService.addActivity(activity);
        close();
    }

    return (
        <div>
            <Form className="mt-4">
                <Form.Control className="mb-2" placeholder="Name" value={name} onChange={handleInput}/>
                <Button onClick={handleSubmit}>Add activity</Button>
            </Form>
        </div>
    )
}

export default AddActivityForm;