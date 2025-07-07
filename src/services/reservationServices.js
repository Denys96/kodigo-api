import axios from "axios";

const getReservations = async () => {
  try {
    const token = sessionStorage.getItem("apiToken");
    if (!token) throw new Error("No hay token disponible");

    const response = await axios.get(
      "https://apibookingsaccomodations-production.up.railway.app/api/V1/reservations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener las reservaciones", error);
    return [];
  }
};

export { getReservations };
