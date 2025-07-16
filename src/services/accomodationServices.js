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

export const getAccommodationById = async (id) => {
  const token = sessionStorage.getItem("apiToken");
  const res = await fetch(`https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodation/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error fetching accommodation");
  return await res.json();
};

export const updateAccommodation = async (id, data) => {
  const token = sessionStorage.getItem("apiToken");
  const res = await fetch(`https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodation/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      address: data.address
    })
  });
  return res.ok;
};


export { getAccomodations, postAccomodations };
