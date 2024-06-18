import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../Axios/Axios';
import CategoryForm from './CategoryForm';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('categories/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setShowForm(true);
    };

    const handleCreateCategory = () => {
        setSelectedCategory(null);
        setShowForm(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axiosInstance.delete(`categories/${categoryId}/`);
            fetchCategories(); // Refresh the category list
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleCategoryCreatedOrUpdated = () => {
        fetchCategories();
        setShowForm(false);
    };

    return (
        <div className="content px-6 lg:px-8 flex items-center justify-center min-h-screen pt-28">
            <div className="bg-white bg-opacity-70 p-12 rounded-lg shadow-lg mx-auto text-center max-w-6xl w-full">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Gestión de Categorías</h1>
                <div className="mt-10 flex justify-center gap-x-6">
                    <button
                        onClick={handleCreateCategory}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mb-4"
                    >
                        Crear Categoría
                    </button>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                    {categories.map(category => (
                        <li key={category.id} className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                            <h3 className="text-xl font-semibold">{category.name}</h3>
                            <button
                                onClick={() => handleEditCategory(category)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md mt-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md mt-2 ml-2"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
                {showForm && (
                    <CategoryForm category={selectedCategory} onCategoryCreatedOrUpdated={handleCategoryCreatedOrUpdated} />
                )}
            </div>
        </div>
    );
};

export default CategoryList;
