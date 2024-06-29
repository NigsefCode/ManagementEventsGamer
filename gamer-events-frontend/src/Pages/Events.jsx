import React, { useState } from 'react';
import EventList from '../Components/Events/EventList';
import MyEvents from '../Components/Events/MyEvents';
import PopularEvents from '../Components/Events/PopularEvents';
import './transitions.css';

const Events = () => {
    const [view, setView] = useState('all');

    return (
        <div className="content px-6 lg:px-8 flex items-center justify-center min-h-screen pt-28">
            <div className="bg-white bg-opacity-70 p-12 rounded-lg shadow-lg mx-auto text-center max-w-6xl w-full">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Eventos</h1>
                <div className="mt-10 flex justify-center gap-x-6">
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${view === 'all' ? 'bg-purple-600 text-white hover:bg-purple-500 focus-visible:outline-purple-600' : 'bg-gray-300 text-gray-900'}`}
                        onClick={() => setView('all')}
                    >
                        Todos los Eventos
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${view === 'my' ? 'bg-purple-600 text-white hover:bg-purple-500 focus-visible:outline-purple-600' : 'bg-gray-300 text-gray-900'}`}
                        onClick={() => setView('my')}
                    >
                        Mis Eventos
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${view === 'popular' ? 'bg-purple-600 text-white hover:bg-purple-500 focus-visible:outline-purple-600' : 'bg-gray-300 text-gray-900'}`}
                        onClick={() => setView('popular')}
                    >
                        Eventos Populares
                    </button>
                </div>
                <div className="mt-10">
                    {view === 'all' && <EventList />}
                    {view === 'my' && <MyEvents />}
                    {view === 'popular' && <PopularEvents />}
                </div>
            </div>
        </div>
    );
};

export default Events;
