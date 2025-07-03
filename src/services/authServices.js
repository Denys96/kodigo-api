import axios from "axios";

const login = async (data) => {
    try {
        const response = await axios.post('https://apibookingsaccomodations-production.up.railway.app/api/V1/login', data);
        return response.data;
    } catch (error) {
        console.error("Error al autenticarse", error);
    }
}

export { login }