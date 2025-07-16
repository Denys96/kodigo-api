import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { getAccomodations } from "../services/accomodationServices";
import { getUsers } from "../services/userServices";
import { postBookings } from "../services/bookingServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";



export default function NewBookings({ setActiveView }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accomodations, setAccomodations] = useState([]);
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    try {
      const accResponse = await getAccomodations();
      setAccomodations(Array.isArray(accResponse) ? accResponse : []);

      const userResponse = await getUsers();
      setUsers(Array.isArray(userResponse) ? userResponse : []);

      setError(null);
    } catch (err) {
      console.error("Error en fetchData:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("apiToken");
    if (token) {
      fetchData();
    } else {
      setLoading(false);
      // redirige a login o página principal
      window.location.href = "/";
    }
  }, []);

  const generateBookingCode = () => {
    const prefix = "BK";
    const number = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}${number}`;
  };

  const onSubmit = async (data) => {
    const { accommodation, guestId, startDate, endDate } = data;
    const code = generateBookingCode();

    const result = await postBookings(
      code,
      startDate,
      endDate,
      500,
      parseInt(accommodation),
      parseInt(guestId)
    );

    if (result) {
      Swal.fire({
        icon: "success",
        title: "¡Reserva creada!",
        text: `Se creó correctamente la reserva #${code}.`,
      }).then(() => {
        reset();
               navigate("/dashboard", {
        state: { activeView: "reservations" },
      });
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Falló el envío a la API.",
      });
    }
  };

const handleCancel = () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Se cancelará la creación de la reserva.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "No, volver",
  }).then((result) => {
    if (result.isConfirmed) {
      reset();
      navigate("/dashboard", {
        state: { activeView: "reservations" },
      });
    }
  });
};

  return (
    <Main>
      <ContentBooking>
        <ContentTitle>
          <Title>Nueva Reservación</Title>
        </ContentTitle>
        <Line />
        <ContentForm>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="select-accommodation">Alojamiento</Label>
            <Select
              id="select-accommodation"
              {...register('accommodation')}
              required
            >
              <option value="">Seleccione un alojamiento</option>
              {accomodations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Label htmlFor="select-guest">Huésped</Label>
            <Select
              id="select-guest"
              {...register('guestId')}
              required
            >
              <option value="">Seleccione un huésped</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Select>

            <ContentDate>
              <LabelDate htmlFor="input-date-start">Fecha de inicio</LabelDate>
              <LabelDate htmlFor="input-date-end">Fecha de fin</LabelDate>
            </ContentDate>
            <ContentDate>
              <Date
                type="date"
                id="input-date-start"
                required
                {...register('startDate')}
              />
              <Date
                type="date"
                id="input-date-end"
                required
                {...register('endDate')}
              />
            </ContentDate>

            <ContentButton>
              <Exit
                type="button"
                value="Cancelar"
                onClick={handleCancel}
              />
              <Save type="submit" value="Guardar" />
            </ContentButton>
          </form>
        </ContentForm>
      </ContentBooking>
    </Main>
  );
}

// Estilos
const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  padding: 2.5%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #b5b8bf;
  overflow-y: auto;
`;
const ContentBooking = styled.section`
  width: 100%;
  max-height: 500px;
  max-width: 500px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 4px rgba(20, 20, 20, 0.3);
  background-color: #fff;
  padding-bottom: 2rem;
`;
const ContentTitle = styled.div`
  padding: 2.5%;
`;
const Title = styled.h1`
  font-weight: 500;
  font-size: 1.2rem;
`;
const Line = styled.hr`
  color: #E5E7EB;
`;
const ContentForm = styled.section`
  padding: 5%;
  color: #374151;
  font-weight: 500;
`;
const Label = styled.label`
  display: block;
  margin-top: 1rem;
  width: 100%;
`;
const LabelDate = styled.label`
  width: 48%;
`;
const ContentDate = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;
const Date = styled.input`
  width: 48%;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  padding: 2%;
  color: #374151;
`;
const Select = styled.select`
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  padding: 2%;
`;
const ContentButton = styled.section`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;
const Exit = styled.input`
  padding: 0.75rem 1.5rem;
  background-color: #e5e7eb;
  color: #111827;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #d1d5db;
  }
`;
const Save = styled.input`
  padding: 0.75rem 1.5rem;
  background-color: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #1f2937;
  }
`;
