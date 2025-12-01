import React, { useState, useEffect } from 'react';
import Main from "./components/Main.jsx";
import Login from "./components/Login.jsx";
import Ai_discussion from "./components/Ai_discussion.jsx";
import Individual_page from "./components/individual_page.jsx";
import "./App.css";
import "./Login.css";
import "./Ai_discussion.css";
import "./individual_page.css";

export default function App() {
    const [currentPage, setCurrentPage] = useState('main');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = sessionStorage.getItem('token');
        const savedUser = sessionStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        sessionStorage.setItem('token', authToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
        setCurrentPage('main');
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setCurrentPage('main');
    };

    const handleNavigate = (page) => {
        if (page === 'mypage' && !user) {
            alert('로그인이 필요합니다.');
            setCurrentPage('login');
            return;
        }
        setCurrentPage(page);
    };

    if (currentPage === 'login') {
        return <Login initialPage="signin" onBack={() => setCurrentPage('main')} onLogin={handleLogin} />;
    }

    if (currentPage === 'logup') {
        return <Login initialPage="signup" onBack={() => setCurrentPage('main')} onLogin={handleLogin} />;
    }

    if (currentPage === 'ai') {
        return <Ai_discussion user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
    }

    if (currentPage === 'mypage') {
        return <Individual_page user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
    }

    return <Main user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
}