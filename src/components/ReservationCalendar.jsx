import React, { useEffect, useState } from "react";
import { getReservations } from "../services/reservationServices";
import { getAccomodations } from "../services/accomodationServices";

export default function ReservationCalendar() {
  const [reservations, setReservations] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchGuest, setSearchGuest] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReservations();
      const acc = await getAccomodations();
      setReservations(res);
      setAccommodations(acc);
    };

    fetchData();
  }, []);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getFilteredReservations = () => {
    return reservations.filter((res) => {
      const resDate = new Date(res.date);
      const matchesMonth =
        resDate.getMonth() === currentDate.getMonth() &&
        resDate.getFullYear() === currentDate.getFullYear();

      const matchesAccommodation =
        selectedAccommodation === "all" ||
        res.accommodationId === selectedAccommodation;
      const matchesStatus =
        selectedStatus === "all" || res.status === selectedStatus;
      const matchesGuest =
        searchGuest === "" ||
        res.guestName.toLowerCase().includes(searchGuest.toLowerCase());
      return matchesMonth && matchesAccommodation && matchesStatus && matchesGuest;
    });
  };

  const renderReservationsByDay = (day) => {
    const filtered = getFilteredReservations().filter((res) => {
      const resDate = new Date(res.date);
      return resDate.getDay() === day;
    });

    return filtered.map((res, i) => (
      <div
        key={i}
        className={`p-1 text-sm rounded mb-1 ${
          res.status === "confirmed"
            ? "bg-blue-100"
            : res.status === "pending"
            ? "bg-yellow-100"
            : "bg-red-100"
        }`}
      >
        <p className="font-medium">{res.guestName}</p>
        <p className="text-xs text-gray-500">{res.accommodationName}</p>
      </div>
    ));
  };

  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div>
      {/* Navegación de mes */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevMonth}
            className="text-xl px-3 py-1 rounded hover:bg-gray-200"
          >
            &#8249;
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToNextMonth}
            className="text-xl px-3 py-1 rounded hover:bg-gray-200"
          >
            &#8250;
          </button>
        </div>
      </div>

      {/* Filtros */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div className="flex flex-col w-full">
    <label className="text-sm text-gray-600 mb-1">Alojamiento</label>
    <select
      onChange={(e) => setSelectedAccommodation(e.target.value)}
      className="w-full border border-gray-300 bg-white rounded px-3 py-2"
    >
      <option value="all">Todos los alojamientos</option>
      {accommodations.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </select>
  </div>

  <div className="flex flex-col w-full">
    <label className="text-sm text-gray-600 mb-1">Estado</label>
    <select
      onChange={(e) => setSelectedStatus(e.target.value)}
      className="w-full border border-gray-300 bg-white rounded px-3 py-2"
    >
      <option value="all">Todos los estados</option>
      <option value="confirmed">Confirmada</option>
      <option value="pending">Pendiente</option>
      <option value="cancelled">Cancelada</option>
    </select>
  </div>

  <div className="flex flex-col w-full">
  <label className="text-sm text-gray-600 mb-1">Buscar huésped</label>
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      <i className="fas fa-search"></i>
    </span>
    <input
      type="text"
      placeholder="Nombre del huésped..."
      value={searchGuest}
      onChange={(e) => setSearchGuest(e.target.value)}
      className="w-full pl-10 border border-gray-300 bg-white rounded px-3 py-2"
    />
  </div>
</div>

</div>


      {/* Tabla semanal */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              {days.map((day, i) => (
                <th
                  key={i}
                  className="text-left p-3 border-b border-gray-300 text-gray-600"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((_, i) => (
                <td
                  key={i}
                  className="align-top p-2 border-t border-gray-300 h-40 w-48"
                >
                  {renderReservationsByDay(i)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Leyenda de estados */}
      <div className="flex items-center gap-6 mt-4 px-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-300"></span>
          <span className="text-sm text-gray-700">Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-300"></span>
          <span className="text-sm text-gray-700">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-300"></span>
          <span className="text-sm text-gray-700">Cancelada</span>
        </div>
      </div>
    </div>
  );
}
