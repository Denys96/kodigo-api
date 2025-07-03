// src/components/Sidebar.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("apiToken");
    navigate("/");
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
              <Link
                to="#"
                className="flex items-center px-4 py-2 text-gray-900 bg-blue-100 rounded-r-full font-medium"
              >
                <i className="fas fa-home mr-3"></i>
                Alojamientos
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-r-full"
              >
                <i className="fas fa-calendar-alt mr-3"></i>
                Reservaciones
              </a>
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
