import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Axios/Axios';

const ParticipationList = () => {
    const [participations, setParticipations] = useState([]);

    useEffect(() => {
        const fetchParticipations = async () => {
            try {
                const response = await axiosInstance.get('my-participations/');
                setParticipations(response.data);
            } catch (error) {
                console.error('Error fetching participations:', error);
            }
        };

        fetchParticipations();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`participate/${id}/`);
            setParticipations(participations.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting participation:', error);
        }
    };

    return (
        <div className="content px-6 lg:px-8 flex items-center justify-center min-h-screen pt-28">
            <div className="bg-white bg-opacity-70 p-12 rounded-lg shadow-lg mx-auto text-center max-w-6xl w-full">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Mis Participaciones</h1>
                <div className="mt-10">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {participations.map(participation => (
                            <li key={participation.id} className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                <h3 className="text-xl font-semibold">{participation.event.name}</h3>
                                <p className="text-gray-300">{new Date(participation.event.start_time).toLocaleString()}</p>
                                <button
                                    onClick={() => handleDelete(participation.id)}
                                    className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md"
                                >
                                    Eliminar Inscripción
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ParticipationList;
