import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { getAccomodations } from "../services/accomodationServices";
import { useNavigate } from "react-router-dom";

function generateBookingCode() {
    const prefix = "BK";
    const number = Math.floor(100000 + Math.random() * 900000); // número de 6 dígitos
    return `${prefix}${number}`;
}

export default function NewBookings() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeView, setActiveView] = useState("accommodations");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const itemsPerPage = 4;
    const [accomodations, setAccomodations] = useState([]);
    const { register, handleSubmit, reset } = useForm();
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

    const onSubmit = async (data) => {
        const { accommodation, guest, startDate, endDate } = data;
        const code = generateBookingCode();

        setUploading(true);
        setSuccess(false);
        setError("");

        const result = await postAccomodations(code, startDate, endDate, 500, accommodation, 1 );

        setUploading(false);

        if (result) {
            setSuccess(true);
            reset(); // limpia el formulario si quieres
        } else {
            setError("Falló el envío a la API.");
        }
        };

    return (
        <Main>
            <ContentBooking>
                <ContentTitle>
                    <Title>Nuevo Reservación</Title>
                </ContentTitle>
                <Line />
                <ContentForm>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Label htmlFor="select-accommodation">Alojamiento</Label>
                        <Select id="select-accommodation" className="border px-3 py-2 rounded w-full" {...register('accommodation')} required
                        >
                        <option value="">Seleccione un alojamiento</option>
                        {accomodations.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                        </Select>

                        <Label htmlFor="input-guest">Huésped</Label>
                        <Input type="text" id="input-guest" placeholder="Nombre del huésped" {...register('guest')} required />

                        <ContentDate>
                            <LabelDate htmlFor="input-date-start">Fecha de inicio</LabelDate>
                            <LabelDate htmlFor="input-date-end">Fecha de fin</LabelDate>
                        </ContentDate>
                        <ContentDate>
                            <Date type="date" id="input-date-start" required {...register('startDate')} />
                            <Date type="date" id="input-date-end" required {...register('endDate')} />
                        </ContentDate>
                    <ContentButton>
                        <Exit type="button" value="Cancelar"/>
                        <Save type="submit" value="Guardar"/>
                    </ContentButton>
                    </form>
                </ContentForm>
            </ContentBooking>
        </Main>
    );
}

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
const Textarea = styled.textarea`
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    padding: 2%;
    min-height: 100px; 
    resize: vertical; 
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
const Input = styled.input`
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    padding: 2%;
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
        background-color: #1f2937 ;
    }
`;