import React, { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            const scrollTop = document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollTop + windowHeight >= sectionTop + sectionHeight / 3 && scrollTop <= sectionTop + sectionHeight / 3 * 2) {
                    section.querySelector('.section-content').classList.add('visible');
                    section.querySelector('.section-content').classList.remove('opacity-0');
                } else {
                    section.querySelector('.section-content').classList.add('opacity-0');
                    section.querySelector('.section-content').classList.remove('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <section className="bg-gradient flex items-center justify-center min-h-screen p-6">
                <div className="section-content text-center max-w-4xl mx-auto transition-opacity duration-500 opacity-0">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Gestiona y Participa en Eventos Gamer
                    </h1>
                    <p className="mt-6 text-xl leading-8 text-white">
                        Nuestra plataforma te permite crear eventos, unirte a competiciones y participar individualmente o en equipos.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="/events"
                            className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        >
                            Comenzar
                        </a>
                    </div>
                </div>
            </section>
            <section className="bg-gradient flex items-center justify-center min-h-screen p-6">
                <div className="section-content text-center max-w-4xl mx-auto transition-opacity duration-500 opacity-0">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Nosotros</h1>
                    <p className="mt-4 text-xl text-white">
                        Nuestra plataforma está diseñada para los gamers. Aquí puedes gestionar y participar en eventos, crear equipos y mucho más.
                    </p>
                </div>
            </section>
            <section className="bg-gradient flex items-center justify-center min-h-screen p-6">
                <div className="section-content text-center max-w-4xl mx-auto transition-opacity duration-500 opacity-0">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Eventos</h1>
                    <p className="mt-4 text-xl text-white">
                        Organiza y gestiona eventos gamer personalizados. Establece las reglas, invita a jugadores y controla todo el proceso.
                    </p>
                </div>
            </section>
            <section className="bg-gradient flex items-center justify-center min-h-screen p-6">
                <div className="section-content text-center max-w-4xl mx-auto transition-opacity duration-500 opacity-0">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Crear Equipos</h1>
                    <p className="mt-4 text-xl text-white">
                        Forma equipos, compite y gana. Nuestra plataforma soporta tanto competiciones individuales como en equipo.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
