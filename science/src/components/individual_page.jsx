import React, { useState, useEffect } from 'react';

const Individual_page = ({ user, onNavigate, onLogout }) => {
    const [activeTab, setActiveTab] = useState('questions'); // 'questions' or 'discussions'
    const [questions, setQuestions] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            onNavigate('login');
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = () => {
        try {
            setLoading(true);

            // localStorage에서 질문 데이터 가져오기
            const savedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
            const userQuestions = savedQuestions.filter(q => q.userId === user.id);
            setQuestions(userQuestions);

            // localStorage에서 토론 데이터 가져오기
            const savedDiscussions = JSON.parse(localStorage.getItem('discussions') || '[]');
            const userDiscussions = savedDiscussions.filter(d => d.userId === user.id);
            setDiscussions(userDiscussions);
        } catch (err) {
            console.error('데이터 로딩 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id, type) => {
        if (!window.confirm(`이 ${type === 'questions' ? '질문' : '토론'} 내역을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const storageKey = type;
            const savedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const updatedItems = savedItems.filter((item, index) => {
                // id가 없는 경우 index로 비교
                if (item.id) {
                    return item.id !== id;
                }
                return index !== id;
            });

            localStorage.setItem(storageKey, JSON.stringify(updatedItems));

            alert(`${type === 'questions' ? '질문' : '토론'} 내역이 삭제되었습니다.`);
            fetchData();

            if (selectedItem && (selectedItem.id === id || selectedItem.index === id)) {
                setSelectedItem(null);
            }
        } catch (err) {
            alert('삭제 중 오류가 발생했습니다.');
            console.error('삭제 에러:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const currentData = activeTab === 'questions' ? questions : discussions;

    if (!user) {
        return null;
    }

    return (
        <div className="individual-page">
            <header>
                <div className="logo">JuJu</div>
                <div className="login-join">
                    <span className="status">{user.name}님</span>
                    <button onClick={onLogout} style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}>
                        로그아웃
                    </button>
                </div>
            </header>

            <div className="nav-tabs">
                <div className="active" onClick={() => onNavigate('main')}>메인 페이지</div>
                <div className="active" onClick={() => onNavigate('ai')}>AI와 토론</div>
                <div className="active" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                    개인 페이지
                </div>
            </div>

            <main className="individual-main">
                <div className="profile-section">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <h2 className="profile-name">{user.name}</h2>
                    <p className="profile-email">{user.email}</p>
                </div>

                <div className="content-section">
                    <div className="section-header">
                        <div className="tabs-container">
                            <button
                                className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab('questions');
                                    setSelectedItem(null);
                                }}
                            >
                                ❓ 질문 내역
                                <span className="count-badge">{questions.length}</span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab('discussions');
                                    setSelectedItem(null);
                                }}
                            >
                                💬 토론 내역
                                <span className="count-badge">{discussions.length}</span>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>내역을 불러오는 중...</p>
                        </div>
                    ) : currentData.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                {activeTab === 'questions' ? '❓' : '💬'}
                            </div>
                            <h3>아직 {activeTab === 'questions' ? '질문' : '토론'} 내역이 없습니다</h3>
                            <p>AI와 {activeTab === 'questions' ? '질문을' : '토론을'} 시작해보세요!</p>
                            <button
                                className="start-btn"
                                onClick={() => onNavigate('ai')}
                            >
                                {activeTab === 'questions' ? '질문하러 가기' : '토론 시작하기'}
                            </button>
                        </div>
                    ) : (
                        <div className="items-container">
                            <div className="items-list">
                                {currentData.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className={`item-card ${selectedItem?.id === item.id || selectedItem?.index === index ? 'selected' : ''}`}
                                        onClick={() => setSelectedItem({ ...item, id: item.id || index, index })}
                                    >
                                        <div className="item-header">
                                            <h4 className="item-topic">{item.topic}</h4>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(item.id || index, activeTab);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="item-question">{item.question}</p>
                                        <div className="item-meta">
                                            <span className="message-count">
                                                💬 {item.messages?.length || 0}개의 메시지
                                            </span>
                                            <span className="item-date">
                                                {formatDate(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedItem && (
                                <div className="item-detail">
                                    <div className="detail-header">
                                        <div>
                                            <div className="detail-badge">
                                                {activeTab === 'questions' ? '❓ 질문' : '💬 토론'}
                                            </div>
                                            <h3>{selectedItem.topic}</h3>
                                            <p className="detail-question">{selectedItem.question}</p>
                                        </div>
                                        <button
                                            className="close-detail-btn"
                                            onClick={() => setSelectedItem(null)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="messages-container">
                                        {selectedItem.messages?.map((message, idx) => (
                                            <div
                                                key={idx}
                                                className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                                            >
                                                <div className="message-bubble">
                                                    {message.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Individual_page;