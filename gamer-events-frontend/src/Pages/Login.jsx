import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../Axios/Axios';

const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear the error message when the user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('token/', formData);
            console.log('Login response:', res.data);
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('user_id', res.data.user_id);
            localStorage.setItem('username', formData.username);
            localStorage.setItem('is_superuser', res.data.is_superuser);
            localStorage.setItem('is_staff', res.data.is_staff);
            axiosInstance.defaults.headers['Authorization'] = `Bearer ${res.data.access}`;
            setIsAuthenticated(true);
            navigate('/home');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Nombre de usuario o contraseña incorrectos');
            } else {
                setError('Ocurrió un error, por favor intente nuevamente más tarde');
            }
        }
    };



    return (
        <div className="content max-w-md m-auto mt-24 p-6 text-black rounded-3xl shadow-lg bg-white border-gray-200 border-2">
            <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error}
                    </div>
                )}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Nombre de usuario</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nombre de usuario"
                        value={formData.username}
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
                    Iniciar Sesión
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-gray-800">¿No tienes cuenta?</p>
                <Link to="/register" className="text-purple-400 hover:text-purple-300">Regístrate aquí</Link>
            </div>
        </div>
    );
};

export default Login;
