import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Axios/Axios';
import TeamForm from './TeamForm';

const MyTeams = () => {
    const [teams, setTeams] = useState([]);
    const [editingTeam, setEditingTeam] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axiosInstance.get('teams/my_teams/');
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching user teams:', error);
            }
        };
        fetchTeams();
    }, []);

    const deleteTeam = async (id) => {
        try {
            await axiosInstance.delete(`teams/${id}/`);
            setTeams(teams.filter(team => team.id !== id));
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    const editTeam = (team) => {
        setEditingTeam(team);
    };

    const handleTeamCreated = () => {
        setEditingTeam(null);
        const fetchTeams = async () => {
            try {
                const response = await axiosInstance.get('teams/my_teams/');
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching user teams:', error);
            }
        };
        fetchTeams();
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white bg-opacity-90 text-gray-900 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Mis Equipos</h2>
            <div className="flex justify-between mb-4">
                <button
                    onClick={() => setEditingTeam({})}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-transform transform hover:scale-105"
                >
                    Añadir Equipo
                </button>
            </div>
            {editingTeam && <TeamForm team={editingTeam} onTeamCreated={handleTeamCreated} />}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map(team => (
                    <li key={team.id} className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold">{team.name}</h3>
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={() => editTeam(team)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded-md transition-transform transform hover:scale-105"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => deleteTeam(team.id)}
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

export default MyTeams;
