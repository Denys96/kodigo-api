import axios from "axios";

// obtenemos todos los alojamientos
const getBookings = async () => {
try {
    // obtenemos el token de sesion storage
    const token = sessionStorage.getItem('apiToken'); 

    if (!token) {
    throw new Error('No hay token disponible');
    }

    const response = await axios.get(
    "https://apibookingsaccomodations-production.up.railway.app/api/V1/bookings",
    {
        headers: {
        Authorization: `Bearer ${token}`,
        }
    }
    );
    
    return response.data;
} catch (error) {
    console.error("Error al obtener los datos", error);
    return null;
}
};

const postBookings = async (num, checkin, checkout, amount, accomadation, id) => {
try {
    const token = sessionStorage.getItem('apiToken'); 

    if (!token) {
    throw new Error('No hay token disponible');
    }

    const response = await axios.post(
    "https://apibookingsaccomodations-production.up.railway.app/api/V1/booking",
    {
        booking: num,
        check_in_date: checkin,
        check_out_date: checkout,
        total_amout: amount,
        accomodation_id: accomadation,
        user_id: id
    },
    {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
    }
    );
    
    return response.data;
} catch (error) {
    console.error("Error al enviar los datos", error);
    return null;
}
};

export { getBookings, postBookings };
