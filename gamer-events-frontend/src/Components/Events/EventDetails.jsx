import React from 'react';

const EventDetails = ({ event, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{event.name}</h2>
                <p><strong>Categoría:</strong> {event.category.name}</p>
                <p><strong>Fecha de inicio:</strong> {new Date(event.start_time).toLocaleString()}</p>
                <p><strong>Fecha de finalización:</strong> {new Date(event.end_time).toLocaleString()}</p>
                <p><strong>Fecha límite de registro:</strong> {new Date(event.registration_deadline).toLocaleString()}</p>
                <p><strong>Creador:</strong> {event.creator_username}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default EventDetails;
