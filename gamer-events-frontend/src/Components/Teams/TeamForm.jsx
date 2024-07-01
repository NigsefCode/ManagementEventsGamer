import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosInstance from '../../Axios/Axios';

const TeamForm = ({ team, onTeamCreated }) => {
    const [formData, setFormData] = useState({
        name: team?.name || '',
        members: team?.members?.map(member => ({ value: member.id, label: member.username })) || [],
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('users/');
                setUsers(response.data.map(user => ({ value: user.id, label: user.username })));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (team) {
            setFormData({
                name: team.name || '',
                members: team.members?.map(member => ({ value: member.id, label: member.username })) || [],
            });
        }
    }, [team]);

    const handleChange = (selectedOptions) => {
        setFormData({ ...formData, members: selectedOptions });
    };

    const handleNameChange = (e) => {
        setFormData({ ...formData, name: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const memberIds = formData.members.map(member => member.value);
            const dataToSend = {
                name: formData.name,
                member_ids: memberIds,
                creator: localStorage.getItem('user_id') // Obtén el ID del usuario autenticado
            };
            if (team && team.id) {
                await axiosInstance.put(`teams/${team.id}/`, dataToSend);
            } else {
                await axiosInstance.post('teams/', dataToSend);
            }
            onTeamCreated();
        } catch (error) {
            console.error('Error submitting team:', error);
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{team && team.id ? 'Editar Equipo' : 'Añadir Equipo'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre del Equipo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Miembros</label>
                        <Select
                            isMulti
                            name="members"
                            options={users}
                            value={formData.members}
                            onChange={handleChange}
                            className="basic-multi-select bg-white text-black"
                            classNamePrefix="select"
                            isSearchable={true}
                            placeholder="Buscar usuarios por nombre..."
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Seleccionar Miembros</h3>
                        <ul className="list-disc list-inside">
                            {formData.members.map(member => (
                                <li key={member.value}>{member.label}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => onTeamCreated()}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            {team && team.id ? 'Actualizar Equipo' : 'Crear Equipo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamForm;
