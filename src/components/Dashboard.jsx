// src/pages/Dashboard.jsx
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
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await getAccomodations();
      setAccomodations(response);
      setError(null);
    } catch (err) {
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
        <Sidebar />
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
        <Sidebar />
        <main className="flex-1 p-8">
          <Header />
          <p className="text-red-500">Error: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 space-y-4">
        <Header />
       

        {accomodations.length === 0 ? (
          <p className="text-gray-500">No hay alojamientos disponibles.</p>
        ) : (
          accomodations.map((item) => (
            <AccommodationCard
              key={item.id}
              title={item.name}
              address={item.address}
              description={item.description}
              onEdit={() => console.log("Editar", item.id)}
              onDelete={() => console.log("Eliminar", item.id)}
            />
          ))
        )}
      </main>
    </div>
  );
}
