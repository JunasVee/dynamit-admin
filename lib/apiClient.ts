import axios from "axios"


const apiClient = axios.create({
    baseURL: 'http://91.108.111.175:5000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient