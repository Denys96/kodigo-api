import axios from "axios";

// obtenemos todos los alojamientos
const getAccomodations = async () => {
  try {
    // obtenemos el token de sesion storage
    const token = sessionStorage.getItem('apiToken'); 

    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await axios.get(
      "https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodations",
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

const postAccomodations = async (nameAccomodation, descriptionAccomodation, addressAccomodation) => {
  try {
    const token = sessionStorage.getItem('apiToken'); 

    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await axios.post(
      "https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodation",
      {
        name: nameAccomodation,
        description: descriptionAccomodation,
        address: addressAccomodation
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

export { getAccomodations, postAccomodations };
