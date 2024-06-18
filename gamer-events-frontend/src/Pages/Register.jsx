import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../Axios/Axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName
            });
            console.log(res.data);
            // Redirigir al usuario a la página de inicio de sesión después de un registro exitoso
            navigate('/login');
        } catch (error) {
            console.error(error.response?.data || error.message);
            // Manejar errores de registro
        }
    };

    return (
        <div className="content max-w-md mx-auto mt-24 p-6 text-black rounded-3xl shadow-lg bg-white border-gray-200 border-2">
            <h2 className="text-2xl font-bold mb-4">Registro</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Nombre"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-800 rounded-full w-full bg-white text-gray-900"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Apellido</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Apellido"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-800 rounded-full w-full bg-white text-gray-900"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nombre de Usuario"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-800 rounded-full w-full bg-white text-gray-900"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Correo</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-800 rounded-full w-full bg-white text-gray-900"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-800 rounded-full w-full bg-white text-gray-900"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 focus:outline-none focus:bg-purple-600"
                >
                    Registro
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-gray-800">¿Ya tienes una cuenta?</p>
                <Link to="/login" className="text-purple-400 hover:text-purple-300">Inicia sesión aquí</Link>
            </div>
        </div>
    );
};

export default Register;
