import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Axios/Axios';

const TeamList = () => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axiosInstance.get('teams/');
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
        fetchTeams();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white bg-opacity-90 text-gray-900 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Todos los Equipos</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map(team => (
                    <li key={team.id} className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold">{team.name}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamList;
