import axios from "axios";
const API_BASE_URL = "https://apibookingsaccomodations-production.up.railway.app/api/V1";

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



const getBookings = async () => {
  try {
    const token = sessionStorage.getItem("apiToken");
    if (!token) throw new Error("No hay token disponible");

    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos", error);
    throw error;
  }
};

const getBookingsForCalendar = async (accomodationId = null, startDate = null, endDate = null) => {
  try {
    const token = sessionStorage.getItem("apiToken");
    if (!token) throw new Error("No hay token disponible");

    let url = `${API_BASE_URL}/bookings`;
    if (accomodationId) {
      url = `${API_BASE_URL}/bookings/calendar/${accomodationId}`;
    }

    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: params
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener datos para el calendario", error);
    throw error;
  }
};

const postBooking = async (bookingData) => {
  try {
    const token = sessionStorage.getItem("apiToken");
    if (!token) throw new Error("No hay token disponible");

    const response = await axios.post(`${API_BASE_URL}/booking`, {
      booking: bookingData.bookingNumber,
      check_in_date: bookingData.checkInDate,
      check_out_date: bookingData.checkOutDate,
      total_amount: bookingData.totalAmount,
      accomodation_id: bookingData.accomodationId,
      user_id: bookingData.userId,
      status: bookingData.status || 'pending'
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al enviar los datos", error);
    throw error;
  }
};

const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const token = sessionStorage.getItem("apiToken");
    if (!token) throw new Error("No hay token disponible");

    const response = await axios.patch(
      `${API_BASE_URL}/status_booking/${bookingId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado", error);
    throw error;
  }
};

export { getBookings, getBookingsForCalendar, postBooking, updateBookingStatus };
export { getReservations };