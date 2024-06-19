import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axios/Axios';

const ParticipateForm = ({ event, onParticipationCreated }) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const userId = localStorage.getItem('user_id'); // Obtén el ID del usuario autenticado

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axiosInstance.get('teams/my_teams/');
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, [userId]);

    const handleTeamChange = (e) => {
        setSelectedTeamId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTeamId) {
            console.error('No team selected');
            return;
        }

        try {
            const dataToSend = {
                event_id: event.id,
                team: selectedTeamId,
                user: userId
            };
            await axiosInstance.post('participate/', dataToSend);
            onParticipationCreated();
        } catch (error) {
            console.error('Error registering for event:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Inscripción al Evento</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Equipo</label>
                        <select
                            name="team"
                            value={selectedTeamId}
                            onChange={handleTeamChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        >
                            <option value="">Seleccionar Equipo</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id.toString()}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => onParticipationCreated()}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Participar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ParticipateForm;
