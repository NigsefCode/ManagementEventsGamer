import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axios/Axios';

const formatDateTimeLocal = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EventForm = ({ event, onEventCreated }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: event?.name || '',
        category: event?.category?.id || '',
        start_time: event?.start_time ? formatDateTimeLocal(event.start_time) : '',
        end_time: event?.end_time ? formatDateTimeLocal(event.end_time) : '',
        registration_deadline: event?.registration_deadline ? formatDateTimeLocal(event.registration_deadline) : '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axiosInstance.get('categories/');
            setCategories(response.data);
        };
        fetchCategories();

        if (event) {
            setFormData({
                name: event.name || '',
                category: event.category?.id || '',
                start_time: event.start_time ? formatDateTimeLocal(event.start_time) : '',
                end_time: event.end_time ? formatDateTimeLocal(event.end_time) : '',
                registration_deadline: event.registration_deadline ? formatDateTimeLocal(event.registration_deadline) : '',
            });
        }
    }, [event]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedStartTime = new Date(formData.start_time).toISOString();
            const formattedEndTime = new Date(formData.end_time).toISOString();
            const formattedRegistrationDeadline = new Date(formData.registration_deadline).toISOString();
            const dataToSend = {
                name: formData.name,
                category: formData.category,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                registration_deadline: formattedRegistrationDeadline,
            };
            if (event && event.id) {
                await axiosInstance.put(`events/${event.id}/`, dataToSend);
            } else {
                await axiosInstance.post('events/', dataToSend);
            }
            onEventCreated();
        } catch (error) {
            console.error('Error submitting event:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{event && event.id ? 'Editar Evento' : 'Añadir Evento'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre del Evento</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Categoría</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        >
                            <option value="" disabled>Seleccionar categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Inicio</label>
                        <input
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Fin</label>
                        <input
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Fecha límite de inscripción</label>
                        <input
                            type="datetime-local"
                            name="registration_deadline"
                            value={formData.registration_deadline}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => onEventCreated()}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            {event && event.id ? 'Actualizar Evento' : 'Crear Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
