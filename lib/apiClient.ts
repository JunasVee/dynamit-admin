import axios from "axios"


const apiClient = axios.create({
    baseURL: 'https://api.dynamits.id/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient
