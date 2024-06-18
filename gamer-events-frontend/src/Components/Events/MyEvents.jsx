import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Axios/Axios';
import EventForm from './EventForm';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await axiosInstance.get('events/my_events/');
            setEvents(response.data);
        };
        fetchEvents();
    }, []);

    const deleteEvent = async (id) => {
        try {
            await axiosInstance.delete(`events/${id}/`);
            setEvents(events.filter(event => event.id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const editEvent = (event) => {
        setEditingEvent(event);
    };

    const handleEventCreated = () => {
        setEditingEvent(null);
        const fetchEvents = async () => {
            const response = await axiosInstance.get('events/my_events/');
            setEvents(response.data);
        };
        fetchEvents();
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white bg-opacity-90 text-gray-900 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Mis Eventos</h2>
            <div className="flex justify-between mb-4">
                <button
                    onClick={() => setEditingEvent({})}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-transform transform hover:scale-105"
                >
                    Añadir Evento
                </button>
            </div>
            {editingEvent && <EventForm event={editingEvent} onEventCreated={handleEventCreated} />}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <li key={event.id} className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <p className="text-gray-300">{event.category}</p>
                        <p className="text-gray-300">{new Date(event.start_time).toLocaleString()}</p>
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={() => editEvent(event)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded-md transition-transform transform hover:scale-105"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => deleteEvent(event.id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md transition-transform transform hover:scale-105"
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyEvents;
