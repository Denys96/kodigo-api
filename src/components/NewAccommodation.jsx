import React, { useState } from "react";
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postAccomodations } from "../services/accomodationServices";

export default function NewAccommodation() {
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const { name, description, direction } = data;

        setUploading(true);
        setSuccess(false);
        setError("");

        const result = await postAccomodations(name, description, direction);

        setUploading(false);

        if (result) {
            setSuccess(true);
            reset(); // limpia el formulario si quieres
            navigate("/dashboard");
        } else {
            setError("Falló el envío a la API.");
        }
    };

    const handleCancel = () => {
        reset();
        navigate("/dashboard");
    };

    return (
        <Main>
            <ContentAcommodation>
                <ContentTitle>
                    <Title>Nuevo Alojamiento</Title>
                </ContentTitle>
                <Line />
                <ContentForm>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Label htmlFor="input-name">Nombre</Label>
                        <Input
                            type="text"
                            id="input-name"
                            placeholder="Nombre del alojamiento"
                            {...register('name')}
                            required
                        />

                        <Label htmlFor="input-direction">Dirección</Label>
                        <Input
                            type="text"
                            id="input-direction"
                            placeholder="Dirección del alojamiento"
                            {...register('direction')}
                            required
                        />

                        <Label htmlFor="input-description">Descripción</Label>
                        <Textarea
                            id="input-description"
                            placeholder="Describe el alojamiento"
                            required
                            {...register('description')}
                        />

                        <Line />
                        <ContentButton>
                            <Exit
                                type="button"
                                value="Cancelar"
                                onClick={handleCancel}
                            />
                            <Save type="submit" value="Guardar Cambios" />
                        </ContentButton>
                    </form>
                </ContentForm>
            </ContentAcommodation>
        </Main>
    );
}

// estilos
const Main = styled.main`
    width: 100%;
    min-height: 100vh;
    padding: 2.5%;
    display: flex;
    justify-content: center;
    background-color: #b5b8bf;
    overflow-y: auto; 
`;
const ContentAcommodation = styled.section`
    width: 100%;
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
const Input = styled.input`
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 10px;
    padding: 2%;
`;
const BoxInput = styled.div`
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: 2px dashed #cbd5e1;
    padding: 2rem;
    text-align: center;
    border-radius: 10px;
    background-color: #f9fafb;
    position: relative;
`;
const InputFile = styled.input`
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
`;
const LabelFile = styled.label`
    cursor: pointer;
    display: inline-block;
    padding: 3rem;
    strong {
        color: #2563eb;
    }
    .box__dragndrop {
        color: #6b7280;
        margin-left: 0.5rem;
    }
`;
const Status = styled.div`
    margin-top: 1rem;
    font-weight: bold;

    &.box__uploading {
        color: #f59e0b;
    }
    &.box__success {
        color: #10b981;
    }
    &.box__error {
        color: #ef4444;
    }
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
