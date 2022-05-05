import axios from "axios";

const apiBaseUrl = "http://localhost:3000";

const addActivity = async (activity) => {
    await axios.post(`${apiBaseUrl}/activities`, activity);
}

const getActivities = async () => {
    const { data: results } = await axios.get(`${apiBaseUrl}/activities`);
    return results;
}

export default {
    addActivity, getActivities
}