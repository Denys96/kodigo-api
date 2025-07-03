// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar({ activeView, setActiveView }) {
  const handleLogout = () => {
    sessionStorage.removeItem("apiToken");
    window.location.href = "/";
  };

  return (
    <aside className="w-64 bg-white border-r flex flex-col justify-between min-h-screen">
      <div>
        <div className="p-4 text-gray-800 font-bold text-lg flex items-center gap-2 border-b">
          <i className="fas fa-th-large"></i>
          Panel de Control
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveView("accommodations")}
                className={`w-full text-left flex items-center px-4 py-2 rounded-r-full font-medium ${
                  activeView === "accommodations"
                    ? "text-gray-900 bg-blue-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <i className="fas fa-home mr-3"></i>
                Alojamientos
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView("reservations")}
                className={`w-full text-left flex items-center px-4 py-2 rounded-r-full font-medium ${
                  activeView === "reservations"
                    ? "text-gray-900 bg-blue-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <i className="fas fa-calendar-alt mr-3"></i>
                Reservaciones
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
