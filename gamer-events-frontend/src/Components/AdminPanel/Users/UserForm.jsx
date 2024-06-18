import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../Axios/Axios';

const UserForm = ({ user, onUserCreatedOrUpdated }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        is_superuser: user?.is_superuser || false,
        is_staff: user?.is_staff || false,
        password: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                is_superuser: user.is_superuser || false,
                is_staff: user.is_staff || false,
                password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);
        try {
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.password) {
                delete dataToSubmit.password;
            }

            if (user && user.id) {
                await axiosInstance.put(`users/${user.id}/`, dataToSubmit);
            } else {
                await axiosInstance.post('users/', dataToSubmit);
            }
            onUserCreatedOrUpdated();
        } catch (error) {
            console.error('Error submitting user:', error.response?.data || error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{user && user.id ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Apellido</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Superusuario</label>
                        <input
                            type="checkbox"
                            name="is_superuser"
                            checked={formData.is_superuser}
                            onChange={handleChange}
                            className="mr-2 leading-tight"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Staff</label>
                        <input
                            type="checkbox"
                            name="is_staff"
                            checked={formData.is_staff}
                            onChange={handleChange}
                            className="mr-2 leading-tight"
                        />
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => onUserCreatedOrUpdated()}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            {user && user.id ? 'Actualizar Usuario' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
