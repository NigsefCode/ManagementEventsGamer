import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Axios/Axios';
import ParticipateForm from '../Participation/ParticipateForm';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userParticipations, setUserParticipations] = useState([]);

    const fetchUserParticipations = async () => {
        try {
            const response = await axiosInstance.get('my-participations/');
            setUserParticipations(response.data);
        } catch (error) {
            console.error('Error fetching user participations:', error);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get('events/', {
                    params: { category: selectedCategory }
                });
                setEvents(response.data);
                await fetchUserParticipations(); // Llamar a esta función después de obtener los eventos
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('categories/');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchEvents();
        fetchCategories();
    }, [selectedCategory]);

    const handleParticipationClick = (event) => {
        setSelectedEvent(event);
    };

    const handleParticipationCreated = async () => {
        setSelectedEvent(null);
        await fetchUserParticipations(); // Actualizar las participaciones del usuario después de crear una nueva
    };

    const isUserParticipating = (eventId) => {
        return userParticipations.some(participation => participation.event.id === eventId);
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white bg-opacity-90 text-gray-900 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Todos los eventos</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Filtrar por categoría</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <li key={event.id} className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <p className="text-gray-300">{event.category.name}</p>
                        <p className="text-gray-300">{new Date(event.start_time).toLocaleString()}</p>
                        <p className="text-gray-300">{new Date(event.registration_deadline).toLocaleString()}</p>
                        {isUserParticipating(event.id) ? (
                            <button
                                className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
                                disabled
                            >
                                Inscrito
                            </button>
                        ) : (
                            <button
                                onClick={() => handleParticipationClick(event)}
                                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Participar
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            {selectedEvent && (
                <ParticipateForm
                    event={selectedEvent}
                    onParticipationCreated={handleParticipationCreated}
                />
            )}
        </div>
    );
};

export default EventList;
