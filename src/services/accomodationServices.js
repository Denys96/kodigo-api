import axios from "axios";

//obtenemos el token de la session
const token = sessionStorage.getItem('apiToken'); 

//obtenemos todos los alojamientos
const getAccomodations = async () => {
    try {
        if (!token) {
            throw new Error('No hay token disponible');
        }

        const response = await axios.get("https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodations", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; 
    } catch (error) {
        console.error("Error al obtener los datos", error);
        return null;
    }
}

export { getAccomodations }