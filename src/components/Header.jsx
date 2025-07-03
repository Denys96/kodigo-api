// src/components/Header.jsx
import React from "react";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Alojamientos</h1>
      <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition">
        <i className="fas fa-plus"></i>
        Nuevo Alojamiento
      </button>
    </div>
  );
}
