import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../Axios/Axios';
import UserForm from './UserForm';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [roleDistribution, setRoleDistribution] = useState(null);
    const [showRoleDistribution, setShowRoleDistribution] = useState(false); // Estado para controlar la visibilidad

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchRoleDistribution = async () => {
        try {
            const response = await axiosInstance.get('user-roles-distribution/');
            setRoleDistribution(response.data);
            setShowRoleDistribution(true); // Mostrar el panel al obtener los datos
        } catch (error) {
            console.error('Error fetching role distribution:', error);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowForm(true);
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setShowForm(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axiosInstance.delete(`users/${userId}/`);
            fetchUsers(); // Actualizar la lista de usuarios
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUserCreatedOrUpdated = () => {
        fetchUsers();
        setShowForm(false);
    };

    const toggleRoleDistribution = () => {
        setShowRoleDistribution(!showRoleDistribution); // Alternar la visibilidad del panel
        if (!showRoleDistribution) {
            fetchRoleDistribution(); // Si se está mostrando y se oculta, cargar datos de distribución
        }
    };

    return (
        <div className="content px-6 lg:px-8 flex items-center justify-center min-h-screen pt-28">
            <div className="bg-white bg-opacity-70 p-12 rounded-lg shadow-lg mx-auto text-center max-w-6xl w-full">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Gestión de Usuarios</h1>
                <div className="mt-10 flex justify-center gap-x-6">
                    <button
                        onClick={handleCreateUser}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mb-4"
                    >
                        Crear Usuario
                    </button>
                    <button
                        onClick={toggleRoleDistribution} // Cambiar aquí al toggleRoleDistribution
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md mb-4"
                    >
                        {showRoleDistribution ? 'Cerrar Distribución de Roles' : 'Ver Distribución de Roles'}
                    </button>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                    {users.map(user => (
                        <li key={user.id} className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                            <h3 className="text-xl font-semibold">{user.username}</h3>
                            <p className="text-gray-300">{user.email}</p>
                            <button
                                onClick={() => handleEditUser(user)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md mt-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md mt-2 ml-2"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
                {showForm && (
                    <UserForm user={selectedUser} onUserCreatedOrUpdated={handleUserCreatedOrUpdated} />
                )}
                {showRoleDistribution && roleDistribution && (
                    <div className="mt-10 bg-white bg-opacity-70 p-12 rounded-lg shadow-lg mx-auto text-center max-w-6xl w-full">
                        <h2 className="text-2xl font-bold text-gray-900">Distribución de Roles</h2>
                        <p className="mt-2 text-gray-900">Usuarios totales registrados: {roleDistribution.total_users}</p>
                        <ul>
                            {roleDistribution.roles.map(role => (
                                <li key={role.role} className="mt-2 text-gray-900">
                                    {role.role}: {role.count}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;
