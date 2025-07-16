import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccommodationById, updateAccommodation } from "../services/accomodationServices";
import Swal from "sweetalert2";

export default function EditAccommodation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: ""
  });

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const acc = await getAccommodationById(id);
        setFormData({
          name: acc.name || "",
          description: acc.description || "",
          address: acc.address || ""
        });
      } catch (error) {
        console.error("Error fetching accommodation:", error);
        Swal.fire("Error", "No se pudo cargar el alojamiento", "error");
      }
    };

    fetchAccommodation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await updateAccommodation(id, formData);
      if (success) {
        Swal.fire("Modificado", "El alojamiento fue actualizado", "success").then(() => {
          navigate("/dashboard", { state: { activeView: "accommodations" } });
        });
      } else {
        Swal.fire("Error", "No se pudo actualizar el alojamiento", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Ocurrió un error al actualizar", "error");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Editar Alojamiento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Dirección</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard", { state: { activeView: "accommodations" } })}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
