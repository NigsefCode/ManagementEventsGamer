import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Components/Home';
import Events from './Pages/Events';
import Teams from './Pages/Teams';
import Navbar from './Components/Navbar';
import UserList from './Components/AdminPanel/Users/UserList';
import CategoryList from './Components/AdminPanel/Category/CategoryList';
import ParticipationList from './Components/Participation/ParticipationList';
import PrivateRoute from './Components/PrivateRoute';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

    return (
        <Router>
            <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        </Router>
    );
}

function AppContent({ isAuthenticated, setIsAuthenticated }) {
    const location = useLocation();
    const showNavbar = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register';

    return (
        <div className="w-full bg-gradient">
            {showNavbar && <Navbar />}
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/home" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Home />
                    </PrivateRoute>
                } />
                <Route path="/events" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Events />
                    </PrivateRoute>
                } />
                <Route path="/teams" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Teams />
                    </PrivateRoute>
                } />
                <Route path="/users" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <UserList />
                    </PrivateRoute>
                } />
                <Route path="/categories" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <CategoryList />
                    </PrivateRoute>
                } />
                <Route path="/my-participations" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <ParticipationList />
                    </PrivateRoute>
                } />
            </Routes>
        </div>
    );
}

export default App;
