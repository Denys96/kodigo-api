import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authServices'

export default function Login() {
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()

    const handleLogin = async (data) => {
        try{
            const response = await login(data)
            console.log(response)
            //si la respuesta es un exito guardamos el token en una session
            if(response?.token){
                sessionStorage.setItem('apiToken', response.token)
                navigate('/dashboard')
            }else{
                alert("No estas autorizado")
            }
        }catch(error){
            console.log("Error al autenticarse")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2 flex items-center justify-center gap-2">
            <i className="fas fa-sign-in-alt"></i> {/* icono de login */}
            Iniciar Sesión
            </h1>
            <p className="text-center text-sm text-gray-600 mb-6">
            Ingresa tus credenciales para acceder al sistema
            </p>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div>
                <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-1"
                >
                Correo Electrónico
                </label>
                <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <i className="fas fa-envelope"></i>
                </span>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="correo@ejemplo.com"
                />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center">
                <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-medium mb-1"
                >
                    Contraseña
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                </a>
                </div>
                <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <i className="fas fa-lock"></i>
                </span>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                />
                </div>
            </div>

            <div className="flex items-center">
                <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Mantener sesión iniciada
                </label>
            </div>

            <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition-colors"
            >
                <i className="fas fa-sign-in-alt"></i>
                Iniciar Sesión
            </button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-6">
            ¿Necesitas ayuda?{" "}
            <a href="#" className="text-blue-600 hover:underline">
                Contacta soporte
            </a>
            </div>

            <div className="text-center text-xs text-gray-400 mt-4">
            <i className="fas fa-shield-alt mr-1"></i> Este es un sistema seguro. Tus
            datos están protegidos.
            </div>
        </div>
        </div>

    )
}