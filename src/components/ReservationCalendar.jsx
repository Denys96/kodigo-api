import React, { useEffect, useState } from "react";
import { getReservations } from "../services/reservationServices";
import { getAccomodations } from "../services/accomodationServices";

export default function ReservationCalendar() {
  const [reservations, setReservations] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchGuest, setSearchGuest] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReservations();
      const acc = await getAccomodations();
      setReservations(res);
      setAccommodations(acc);
    };

    fetchData();
  }, []);

  const getFilteredReservations = () => {
    return reservations.filter((res) => {
      const matchesAccommodation =
        selectedAccommodation === "all" ||
        res.accommodationId === selectedAccommodation;
      const matchesStatus =
        selectedStatus === "all" || res.status === selectedStatus;
      const matchesGuest =
        searchGuest === "" ||
        res.guestName.toLowerCase().includes(searchGuest.toLowerCase());
      return matchesAccommodation && matchesStatus && matchesGuest;
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

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          onChange={(e) => setSelectedAccommodation(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">Todos los alojamientos</option>
          {accommodations.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">Todos los estados</option>
          <option value="confirmed">Confirmada</option>
          <option value="pending">Pendiente</option>
          <option value="cancelled">Cancelada</option>
        </select>

        <input
          type="text"
          placeholder="Nombre del huésped..."
          value={searchGuest}
          onChange={(e) => setSearchGuest(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Tabla semanal */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              {days.map((day, i) => (
                <th key={i} className="text-left p-3 border-b">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((_, i) => (
                <td key={i} className="align-top p-2 border-t h-40 w-48">
                  {renderReservationsByDay(i)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
