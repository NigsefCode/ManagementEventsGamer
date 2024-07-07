import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { FiX } from "react-icons/fi";
import axiosInstance from '../Axios/Axios';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const is_superuser = localStorage.getItem('is_superuser') === 'true';
        const is_staff = localStorage.getItem('is_staff') === 'true';
        setIsAdmin(is_superuser || is_staff);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="p-4 fixed w-full z-10 top-0 left-0 text-gray-900 bg-slate-100 opacity-95">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-gray-900 text-3xl p-2">
                    <Link to="/home" onClick={closeMobileMenu}>EventManager</Link>
                </div>
                <div className="hidden xl:flex space-x-4 text-xl">
                    <Link to="/home" className="text-gray-900 hover:text-gray-700 transition duration-150 ease-in-out hover:duration-150 hover:scale-110">Home</Link>
                    <Link to="/events" className="text-gray-900 hover:text-gray-700 transition duration-150 ease-in-out hover:duration-150 hover:scale-110">Eventos</Link>
                    <Link to="/teams" className="text-gray-900 hover:text-gray-700 transition duration-150 ease-in-out hover:duration-150 hover:scale-110">Equipos</Link>
                    <Link to="/my-participations" className="text-gray-900 hover:text-gray-700 transition duration-150 ease-in-out hover:duration-150 hover:scale-110">Participaciones</Link>
                    {isAdmin && (
                        <div className="relative">
                            <button onClick={toggleDropdown} className="flex items-center text-gray-900 hover:text-gray-700 transition duration-150 ease-in-out hover:duration-150 hover:scale-110">
                                Mantenedores
                                {isDropdownOpen ? (
                                    <FaArrowUp className="ml-2" />
                                ) : (
                                    <FaArrowDown className="ml-2" />
                                )}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 w-48 mt-2 py-2 bg-white border rounded shadow-xl">
                                    <Link to="/users" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => setIsDropdownOpen(false)}>Usuarios</Link>
                                    <Link to="/categories" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => setIsDropdownOpen(false)}>Categorias</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="hidden xl:flex">
                    <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600">Cerrar Sesión</button>
                </div>
                <div className="xl:hidden flex items-center">
                    <button onClick={toggleMobileMenu} className="outline-none mobile-menu-button bg-slate-100">
                        {isMobileMenuOpen ? <FiX className="w-6 h-6 text-black" /> : <GiHamburgerMenu className="w-6 h-6 text-black" />}
                    </button>
                </div>
            </div>
            <div
                className={`xl:hidden transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
                style={{ overflow: 'hidden' }}
            >
                <ul className="bg-slate-100 text-gray-900 text-xl">
                    <li className="border-t border-gray-200">
                        <Link to="/home" className="text-gray-900 block px-4 py-2 hover:bg-purple-400" onClick={closeMobileMenu}>Home</Link>
                    </li>
                    <li className="border-t border-gray-200">
                        <Link to="/events" className="text-gray-900 block px-4 py-2 hover:bg-purple-400" onClick={closeMobileMenu}>Eventos</Link>
                    </li>
                    <li className="border-t border-gray-200">
                        <Link to="/teams" className="text-gray-900 block px-4 py-2 hover:bg-purple-400" onClick={closeMobileMenu}>Equipos</Link>
                    </li>
                    <li className="border-t border-gray-200">
                        <Link to="/my-participations" className="text-gray-900 block px-4 py-2 hover:bg-purple-400" onClick={closeMobileMenu}>Participaciones</Link>
                    </li>
                    {isAdmin && (
                        <li className="border-t border-gray-200">
                            <button onClick={toggleDropdown} className="text-gray-900 block px-4 py-2 w-full hover:bg-purple-400">Mantenedores</button>
                            {isDropdownOpen && (
                                <ul className="bg-slate-100">
                                    <li className="border-t border-gray-200">
                                        <Link to="/users" className="text-gray-900 block px-4 py-2 hover:bg-purple-400" onClick={closeMobileMenu}>Usuarios</Link>
                                    </li>
                                    <li className="border-t border-gray-200">
                                        <Link to="/categories" className="text-gray-900 block px-4 py-2 hover:bg-purple-400" onClick={closeMobileMenu}>Categorias</Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    )}
                    <li className="border-t border-gray-200">
                        <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="mt-2 block bg-red-500 max-w-2xl text-white text-left px-4 py-2 hover:bg-red-600 rounded-full">Cerrar Sesión</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
