import axios from "axios";

export const getUsers = async () => {
  try {
    const token = sessionStorage.getItem("apiToken");
    const response = await axios.get(
      "https://apibookingsaccomodations-production.up.railway.app/api/V1/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};
