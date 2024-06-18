import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../Axios/Axios';

const CategoryForm = ({ category, onCategoryCreatedOrUpdated }) => {
    const [formData, setFormData] = useState({
        name: category?.name || ''
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || ''
            });
        }
    }, [category]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (category && category.id) {
                await axiosInstance.put(`categories/${category.id}/`, formData);
            } else {
                await axiosInstance.post('categories/', formData);
            }
            onCategoryCreatedOrUpdated();
        } catch (error) {
            console.error('Error submitting category:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{category && category.id ? 'Editar Categoría' : 'Crear Categoría'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre de la Categoría</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white text-black"
                        />
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => onCategoryCreatedOrUpdated()}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            {category && category.id ? 'Actualizar Categoría' : 'Crear Categoría'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
