import React, { useEffect, useState } from "react";
import { getBookingsForCalendar, postBooking } from "../services/reservationServices";
import { getAccomodations } from "../services/accomodationServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ReservationCalendar() {
  const [reservations, setReservations] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchGuest, setSearchGuest] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    bookingNumber: "",
    checkInDate: "",
    checkOutDate: "",
    totalAmount: "",
    accomodationId: "",
    userId: "",
    status: "pending"
  });
  
  const navigate = useNavigate();
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener alojamientos
        const acc = await getAccomodations();
        setAccommodations(acc);
        
        // Calcular rango de fechas del mes actual
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const startDate = formatDate(startOfMonth);
        const endDate = formatDate(endOfMonth);
        
        // Obtener reservaciones solo para el mes actual
        const res = await getBookingsForCalendar(
          selectedAccommodation === "all" ? null : selectedAccommodation,
          startDate,
          endDate
        );
        
        // Enriquecer datos y filtrar solo las reservaciones del mes actual
        const enrichedReservations = res
          .filter(r => {
            const checkIn = new Date(r.check_in_date);
            const checkOut = new Date(r.check_out_date);
            return (
              (checkIn.getMonth() === currentDate.getMonth() && checkIn.getFullYear() === currentDate.getFullYear()) ||
              (checkOut.getMonth() === currentDate.getMonth() && checkOut.getFullYear() === currentDate.getFullYear())
            );
          })
          .map(r => {
            const accommodation = acc.find(a => a.id === r.id_accomodation);
            return {
              ...r,
              accommodationId: r.id_accomodation,
              startDate: r.check_in_date,
              endDate: r.check_out_date,
              guestName: r.user || "Invitado",
              accommodationName: accommodation ? accommodation.name : "Alojamiento desconocido",
              status: r.status?.toLowerCase() || "pending"
            };
          });
        
        setReservations(enrichedReservations);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate, selectedAccommodation]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await postBooking(newBooking);
      
      if (result) {
        // Mostrar alerta de éxito
        await Swal.fire({
          title: '¡Reserva creada!',
          text: 'La reservación se ha guardado correctamente',
          icon: 'success',
          confirmButtonText: 'Volver al calendario'
        });
        
        // Recargar los datos
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const startDate = formatDate(startOfMonth);
        const endDate = formatDate(endOfMonth);
        
        const res = await getBookingsForCalendar(
          selectedAccommodation === "all" ? null : selectedAccommodation,
          startDate,
          endDate
        );
        
        // Enriquecer datos
        const enrichedReservations = res.map(r => {
          const accommodation = accommodations.find(a => a.id === r.id_accomodation);
          return {
            ...r,
            accommodationId: r.id_accomodation,
            startDate: r.check_in_date,
            endDate: r.check_out_date,
            guestName: r.user || "Invitado",
            accommodationName: accommodation ? accommodation.name : "Alojamiento desconocido",
            status: r.status?.toLowerCase() || "pending"
          };
        });
        
        setReservations(enrichedReservations);
        setShowBookingForm(false);
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo crear la reservación',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      console.error("Error creating booking:", error);
    }
  };

  const getFilteredReservations = () => {
    return reservations.filter(res => {
      const matchesStatus = selectedStatus === "all" || res.status === selectedStatus;
      const matchesGuest = searchGuest === "" || 
        res.guestName.toLowerCase().includes(searchGuest.toLowerCase());
      return matchesStatus && matchesGuest;
    });
  };

  const groupReservationsByDay = () => {
    const grouped = {};
    const filteredReservations = getFilteredReservations();
    
    filteredReservations.forEach(res => {
      const start = new Date(res.startDate);
      const end = new Date(res.endDate);
      
      // Solo procesar si la reserva está en el mes actual
      if (start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear()) {
        // Agregar para cada día de la reservación
        for (let day = start.getDate(); day <= end.getDate(); day++) {
          if (!grouped[day]) {
            grouped[day] = [];
          }
          // Solo agregar si no existe ya para evitar duplicados
          if (!grouped[day].some(r => r.id === res.id)) {
            grouped[day].push(res);
          }
        }
      }
    });
    
    return grouped;
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const groupedReservations = groupReservationsByDay();

  if (loading) {
    return <div className="p-4 text-center">Cargando calendario...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      {/* Navegación de mes */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &larr; Anterior
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Siguiente &rarr;
        </button>
      </div>



      {/* Formulario de nueva reserva (modal) */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Nueva Reservación</h3>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Número de Reserva</label>
                <input
                  type="text"
                  value={newBooking.bookingNumber}
                  onChange={(e) => setNewBooking({...newBooking, bookingNumber: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Fecha de Entrada</label>
                <input
                  type="date"
                  value={newBooking.checkInDate}
                  onChange={(e) => setNewBooking({...newBooking, checkInDate: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Fecha de Salida</label>
                <input
                  type="date"
                  value={newBooking.checkOutDate}
                  onChange={(e) => setNewBooking({...newBooking, checkOutDate: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Monto Total</label>
                <input
                  type="number"
                  value={newBooking.totalAmount}
                  onChange={(e) => setNewBooking({...newBooking, totalAmount: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Alojamiento</label>
                <select
                  value={newBooking.accomodationId}
                  onChange={(e) => setNewBooking({...newBooking, accomodationId: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Seleccione un alojamiento</option>
                  {accommodations.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ID de Usuario</label>
                <input
                  type="text"
                  value={newBooking.userId}
                  onChange={(e) => setNewBooking({...newBooking, userId: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alojamiento</label>
          <select
            value={selectedAccommodation}
            onChange={(e) => setSelectedAccommodation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="all">Todos los alojamientos</option>
            {accommodations.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="all">Todos los estados</option>
            <option value="confirmed">Confirmada</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar huésped</label>
          <input
            type="text"
            placeholder="Nombre del huésped..."
            value={searchGuest}
            onChange={(e) => setSearchGuest(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2">
        {/* Espacios vacíos para días del mes anterior */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2 h-24 border rounded bg-gray-50"></div>
        ))}

        {/* Días del mes */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const reservationsForDay = groupedReservations[day] || [];
          const isToday = new Date().getDate() === day && 
                          new Date().getMonth() === currentDate.getMonth() && 
                          new Date().getFullYear() === currentDate.getFullYear();

          return (
            <div
              key={day}
              className={`p-2 h-24 border rounded overflow-y-auto ${
                isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
              }`}
            >
              <div className={`flex justify-between items-center mb-1 ${
                isToday ? 'text-blue-600 font-bold' : ''
              }`}>
                <span>{day}</span>
                {reservationsForDay.length > 0 && (
                  <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5">
                    {reservationsForDay.length}
                  </span>
                )}
              </div>
              
              {reservationsForDay.map((res, idx) => {
                let bgColor = "bg-gray-100";
                let borderColor = "border-gray-200";
                
                if (res.status === "confirmed") {
                  bgColor = "bg-green-100";
                  borderColor = "border-green-200";
                } else if (res.status === "pending") {
                  bgColor = "bg-yellow-100";
                  borderColor = "border-yellow-200";
                } else if (res.status === "cancelled") {
                  bgColor = "bg-red-100";
                  borderColor = "border-red-200";
                }

                return (
                  <div
                    key={idx}
                    className={`p-1 mb-1 text-xs rounded truncate ${bgColor} ${borderColor}`}
                    title={`${res.guestName} - ${res.accommodationName} (${res.status})`}
                  >
                    <p className="font-medium truncate">{res.guestName}</p>
                    <p className="text-xs text-gray-500 truncate">{res.accommodationName}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 mt-6 p-3 bg-gray-50 rounded">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-300"></span>
          <span className="text-sm">Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-yellow-300"></span>
          <span className="text-sm">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-300"></span>
          <span className="text-sm">Cancelada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300"></span>
          <span className="text-sm">Hoy</span>
        </div>
      </div>
    </div>
  );
}