import React from "react";


export default function AccommodationCard({
  title,
  address,
  description,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-start">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="flex items-center text-gray-600 text-sm mt-1">
          <i className="fas fa-map-marker-alt mr-2"></i>
          {address}
        </p>
        <p className="flex items-center text-gray-500 text-sm mt-1">
          <i className="fas fa-info-circle mr-2"></i>
          {description}
        </p>
      </div>
      <div className="flex gap-3 mt-1">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}
