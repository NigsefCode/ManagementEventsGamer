import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Axios/Axios';

const PopularEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchPopularEvents();
    }, []);

    const fetchPopularEvents = async () => {
        try {
            const response = await axiosInstance.get('popular-events/');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching popular events:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white bg-opacity-90 text-gray-900 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Eventos Populares</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <li key={event._id} className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <p className="text-gray-300">{event.participants_count} participantes</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopularEvents;
