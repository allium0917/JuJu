import React, { useState, useEffect } from 'react';

const Individual_page = ({ user, onNavigate, onLogout }) => {
    const [activeTab, setActiveTab] = useState('questions');
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

    const fetchData = async () => {
        try {
            setLoading(true);

            const questionsResponse = await fetch(`https://juju-be.onrender.com/api/AITalk?uid=${user.uid}&type=question`);
            const questionsData = await questionsResponse.json();
            setQuestions(questionsData.data || []);

            const discussionsResponse = await fetch(`https://juju-be.onrender.com/api/AITalk?uid=${user.uid}&type=debate`);
            const discussionsData = await discussionsResponse.json();
            setDiscussions(discussionsData.data || []);

        } catch (err) {
            console.error('데이터 로딩 에러:', err);
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (tid, type) => {
        if (!window.confirm(`이 ${type === 'question' ? '질문' : '토론'} 내역을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const response = await fetch(`https://juju-be.onrender.com/api/AITalk/${tid}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('삭제 실패');
            }

            alert(`${type === 'question' ? '질문' : '토론'} 내역이 삭제되었습니다.`);
            fetchData();

            if (selectedItem && selectedItem.tid === tid) {
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
                    <span className="status">{user.uname}님</span>
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

                    <h2 className="profile-name">{user.uname} 님</h2>
                    <p className="profile-email">{user.umail}</p>
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
                                질문 내역
                                <span className="count-badge">{questions.length}</span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab('discussions');
                                    setSelectedItem(null);
                                }}
                            >
                                토론 내역
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
                                {currentData.map((item) => (
                                    <div
                                        key={item.tid}
                                        className={`item-card ${selectedItem?.tid === item.tid ? 'selected' : ''}`}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <div className="item-header">
                                            <h4 className="item-topic">{item.topic}</h4>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(item.tid, item.talk_type);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="item-question">{item.topic}</p>
                                        <div className="item-meta">
                                            <span className="summary-badge">📝 요약</span>
                                            <span className="item-date">
                                                {formatDate(item.created_at)}
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
                                                {activeTab === 'questions' ? '질문' : '토론'}
                                            </div>
                                            <h3>{selectedItem.topic}</h3>
                                            <p className="detail-question">{selectedItem.topic}</p>
                                        </div>
                                        <button
                                            className="close-detail-btn"
                                            onClick={() => setSelectedItem(null)}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="summary-section">
                                        <h4 className="summary-title">AI 요약</h4>
                                        <div className="summary-content">
                                            {selectedItem.ai_response}
                                        </div>
                                    </div>

                                    <div className="messages-section">
                                        <h4 className="messages-title">전체 대화 내역</h4>
                                        <div className="messages-container">
                                            <p>전체 대화 내역 기능은 아직 지원되지 않습니다.</p>
                                        </div>
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