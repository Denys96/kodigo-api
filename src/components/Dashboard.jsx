import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import AccommodationCard from "../components/AccommodationCard";
import Sidebar from "../components/Sidebar";
import { getAccomodations } from "../services/accomodationServices";
import ReservationCalendar from "./ReservationCalendar";

export default function Dashboard() {
  const [accomodations, setAccomodations] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState("accommodations");
  const itemsPerPage = 3;

  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const response = await getAccomodations();
      console.log("Response de getAccomodations:", response);
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

  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = accomodations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(accomodations.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        {/* Flecha izquierda */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          className={`px-3 py-1 rounded-full border ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-200 text-gray-600"
          }`}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {/* Números dinámicos */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;

          if (
            pageNumber === currentPage ||
            pageNumber === currentPage - 1 ||
            pageNumber === currentPage + 1
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`px-4 py-1 rounded-full ${
                  currentPage === pageNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            );
          }

          if (
            (pageNumber === 1 && currentPage > 3) ||
            (pageNumber === totalPages && currentPage < totalPages - 2)
          ) {
            return (
              <span key={pageNumber} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          return null;
        })}

        {/* Flecha derecha */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          className={`px-3 py-1 rounded-full border ${
            currentPage === totalPages || totalPages === 0
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-200 text-gray-600"
          }`}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          &gt;
        </button>
      </div>
    );
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{sectionTitle}</h1>
          <Link
            to={
              activeView === "accommodations"
                ? "/newaccommodation"
                : "/newbooking"
            }
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            <i className="fas fa-plus"></i>
            {newButtonLabel}
          </Link>
        </div>

        {activeView === "accommodations" && (
          <>
            {accomodations.length === 0 ? (
              <p className="text-gray-500">No hay alojamientos disponibles.</p>
            ) : (
              <>
                {paginatedItems.map((item) => (
                  <AccommodationCard
                    key={item.id}
                    title={item.name}
                    address={item.address}
                    description={item.description}
                    image={item.image}
                    onEdit={() =>
                      navigate(`/editaccommodation/${item.id}`)
                    }
                    onDelete={() => console.log("Eliminar", item.id)}
                  />
                ))}

                {renderPagination()}
              </>
            )}
          </>
        )}

        {activeView === "reservations" && (
          <>
            <ReservationCalendar />
          </>
        )}
      </main>
    </div>
  );
}
