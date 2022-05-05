import axios from "axios";

const apiBaseUrl = "http://localhost:3000";

const addActivity = async (activity) => {
    const { data: results } = await axios.post(`${apiBaseUrl}/activities`, activity);
    return results;
}

const getActivities = async () => {
    const { data: results } = await axios.get(`${apiBaseUrl}/activities`);
    return results;
}

const getActivity = async (id) => {
    const { data: results } = await axios.get(`${apiBaseUrl}/activities/${id}`);
    return results;
}

export default {
    addActivity, getActivities, getActivity
}