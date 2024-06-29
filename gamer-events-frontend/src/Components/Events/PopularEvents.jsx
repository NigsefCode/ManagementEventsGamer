// PopularEvents.jsx
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
        <div>
            <h1>Eventos Populares</h1>
            <ul>
                {events.map(event => (
                    <li key={event._id}>{event.name} - {event.participants_count} participantes</li>
                ))}
            </ul>
        </div>
    );
};

export default PopularEvents;
