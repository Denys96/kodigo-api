import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import AccommodationCard from "../components/AccommodationCard";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { getAccomodations } from "../services/accomodationServices";

export default function Dashboard() {
  const [accomodations, setAccomodations] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState("accommodations");
  const itemsPerPage = 4;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await getAccomodations();
      console.log("Response de getAccomodations:", response);

      // Garantizamos que siempre sea array
      setAccomodations(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      console.error("Error en fetchData:", err);
      setError(err.message);
      if (err.message === "No hay token disponible") {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("apiToken");
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
      setIsAuthenticated(false);
      navigate("/");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-8">
          <Header />
          <p className="text-gray-500">Cargando...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-8">
          <Header />
          <p className="text-red-500">Error: {error}</p>
        </main>
      </div>
    );
  }

  // Calculamos paginación de forma segura
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = Array.isArray(accomodations)
    ? accomodations.slice(startIndex, endIndex)
    : [];
  const totalPages = Math.ceil(
    (Array.isArray(accomodations) ? accomodations.length : 0) / itemsPerPage
  );

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const sectionTitle =
    activeView === "accommodations" ? "Alojamientos" : "Reservaciones";
  const newButtonLabel =
    activeView === "accommodations" ? "Nuevo Alojamiento" : "Nueva Reservación";

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-8 space-y-4">
        <Header />

        {/* Título y botón */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{sectionTitle}</h1>
          <button
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition"
            onClick={() => console.log(`Crear ${newButtonLabel}`)}
          >
            <i className="fas fa-plus"></i>
            {newButtonLabel}
          </button>
        </div>

        {/* Vista Alojamientos */}
        {activeView === "accommodations" && (
          <>
            {accomodations.length === 0 ? (
              <p className="text-gray-500">
                No hay alojamientos disponibles.
              </p>
            ) : (
              <>
                {paginatedItems.map((item) => (
                  <AccommodationCard
                    key={item.id}
                    title={item.name}
                    address={item.address}
                    description={item.description}
                    onEdit={() => console.log("Editar", item.id)}
                    onDelete={() => console.log("Eliminar", item.id)}
                  />
                ))}

                {/* Paginación */}
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Vista Reservaciones */}
        {activeView === "reservations" && (
          <p className="text-gray-500">
            Aquí se mostrarán las reservaciones.
          </p>
        )}
      </main>
    </div>
  );
}
