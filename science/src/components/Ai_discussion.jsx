import React, { useState, useEffect, useRef } from 'react';

export default function Ai_discussion({ user, onNavigate, onLogout }) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const [mode, setMode] = useState('select');
    const [topic, setTopic] = useState('');
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const [currentTopic, setCurrentTopic] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const messagesEndRef = useRef(null);

    const exampleQuestions = [
        {
            topic: "주기율표가 18족으로 나뉘는 이유는 무엇인가요?"
        },
        {
            topic: "원자 번호가 원소의 어떤 특성을 나타내나요?"
        },
        {
            topic: "같은 족의 원소들은 왜 비슷한 화학적 성질을 가지나요?"
        },
        {
            topic: "멘델레예프가 주기율표를 만들 때 어떤 규칙을 발견했나요?"
        }
    ];

    const exampleDiscussions = [
        {
            topic: "탄소가 다른 원소들보다 생명체 구성에 적합한 이유는 무엇인가요?"
        },
        {
            topic: "리튬, 코발트 같은 희귀 원소 채굴이 환경에 미치는 영향은?"
        },
        {
            topic: "금속 원소와 비금속 원소의 근본적인 차이는 무엇인가요?"
        },
        {
            topic: "우라늄이나 플루토늄 같은 방사성 원소를 어떻게 안전하게 다뤄야 할까요?"
        }
    ];

    const handleExampleClick = (example) => {
        setTopic(example.topic);
        setQuestion(example.topic); // topic과 question 통일
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const callAI = async (userQuestion, systemPrompt, conversationHistory = []) => {
        try {
            let fullPrompt = systemPrompt + '\n\n';

            if (conversationHistory.length > 0) {
                fullPrompt += '이전 대화 내역:\n';
                conversationHistory.forEach(msg => {
                    fullPrompt += `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}\n`;
                });
                fullPrompt += '\n';
            }

            fullPrompt += `사용자 질문: ${userQuestion}`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API 응답 오류:', errorData);
                throw new Error(`API 오류: ${response.status} - ${errorData.error?.message || '알 수 없는 오류'}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('응답 형식 오류');
            }
        } catch (error) {
            console.error('AI API 호출 오류:', error);
            throw error;
        }
    };

    const handleStartQuestion = async () => {
        if (!question.trim()) {
            alert('질문을 입력해주세요.');
            return;
        }

        setCurrentTopic(question); // topic과 question 통일
        setCurrentQuestion(question);
        setIsChatActive(true);
        setIsLoading(true);

        const userMessage = {
            role: 'user',
            content: question
        };

        setMessages([userMessage]);

        try {
            const systemPrompt = `당신은 주기율표에 대한 전문적인 지식을 가진 교육 AI입니다.
                
**중요 규칙:**
1. 반드시 주기율표와 관련된 질문에만 답변하세요.
2. 주제와 무관한 질문이 들어오면 "죄송하지만, 주기율표와 관련된 질문에만 답변할 수 있습니다."라고 답변하세요.
3. 명확하고 이해하기 쉽게 설명하세요.
4. 필요하면 예시를 들어 설명하세요.
5. 과학적으로 정확한 정보를 제공하세요.
6. 한국어로 답변하세요.(마크다운 형식으로)`;

            const aiResponse = await callAI(question, systemPrompt);

            const aiMessage = {
                role: 'assistant',
                content: aiResponse
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다. API 키를 확인해주세요.');
            setIsChatActive(false);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartDiscussion = async () => {
        if (!topic.trim()) {
            alert('토론 주제를 입력해주세요.');
            return;
        }

        setCurrentTopic(topic);
        setCurrentQuestion(topic); // topic과 question 통일
        setIsChatActive(true);
        setIsLoading(true);

        const userMessage = {
            role: 'user',
            content: topic
        };

        setMessages([userMessage]);

        try {
            const systemPrompt = `당신은 다양한 주제에 대해 토론할 수 있는 AI 토론 파트너입니다.
현재 토론 주제: "${topic}"

**중요 규칙:**
1. 반드시 현재 토론 주제("${topic}")와 관련된 질문에만 답변하세요.
2. 주제와 무관한 질문(예: 날씨, 음식, 일상 대화 등)이 들어오면 "죄송하지만, 현재 토론 주제인 '${topic}'와 관련 없는 질문입니다. 주제와 관련된 질문을 해주세요."라고 답변하세요.
3. 토론하는 느낌으로 답변하세요. 단순히 정보를 나열하지 말고, 의견을 제시하고 근거를 들어 설명하세요.
4. 상대방의 의견에 동의하거나 반박하는 식으로 대화를 이어가세요.
5. "그 점에 대해서는 이렇게 생각합니다", "흥미로운 질문이네요", "그 부분에 대해 좀 더 깊이 생각해볼까요?" 같은 표현을 사용하세요.
6. 먼저 주제에 관해 간단히 소개하고, 질문에 대해 답변하세요.
7. 한국어로 답변하세요.(마크다운 형식으로)`;

            const aiResponse = await callAI(topic, systemPrompt);

            const aiMessage = {
                role: 'assistant',
                content: aiResponse
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다. API 키를 확인해주세요.');
            setIsChatActive(false);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: inputMessage
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const systemPrompt = mode === 'question'
                ? `당신은 주기율표에 대한 전문적인 지식을 가진 교육 AI입니다.
                   
**중요 규칙:**
1. 반드시 주기율표와 관련된 질문에만 답변하세요.
2. 명확하고 이해하기 쉽게 설명하세요.
3. 과학적으로 정확한 정보를 제공하세요.
4. 한국어로 답변하세요.`
                : `당신은 다양한 주제에 대해 토론할 수 있는 AI 토론 파트너입니다.
현재 토론 주제: "${currentTopic}"

**중요 규칙:**
1. 반드시 현재 토론 주제("${currentTopic}")와 관련된 질문에만 답변하세요.
2. 주제와 무관한 질문이 들어오면 "죄송하지만, 현재 토론 주제인 '${currentTopic}'와 관련 없는 질문입니다."라고 답변하세요.
3. 토론하는 느낌으로 답변하세요.
4. 상대방의 의견에 동의하거나 반박하는 식으로 대화를 이어가세요.
5. 한국어로 답변하세요.`;

            const conversationHistory = messages;
            const aiResponse = await callAI(inputMessage, systemPrompt, conversationHistory);

            const aiMessage = {
                role: 'assistant',
                content: aiResponse
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (messages.length === 0) {
            alert('저장할 내용이 없습니다.');
            return;
        }

        try {
            setIsLoading(true);

            // AI에게 대화 요약 요청
            const conversationText = messages.map(msg =>
                `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`
            ).join('\n\n');

            const summaryPrompt = mode === 'question'
                ? `다음은 주기율표에 대한 질문과 답변입니다. 이 대화의 핵심 내용을 3-5문장으로 요약해주세요.\n\n${conversationText}`
                : `다음은 "${currentTopic}"에 대한 토론 내용입니다. 이 토론의 주요 논점과 결론을 3-5문장으로 요약해주세요.\n\n${conversationText}`;

            const aiSummary = await callAI(summaryPrompt, '당신은 대화 내용을 명확하고 간결하게 요약하는 AI입니다. 한국어로 답변하세요.');

            const data = {
                talk_type: mode === 'question' ? 'question' : 'debate',
                topic: currentTopic, // topic과 question 통일
                ai_response: aiSummary,
                uid: user.id
            };

            const response = await fetch('http://localhost:3000/api/AITalk/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('서버 저장 실패');
            }

            const result = await response.json();

            if (result.success) {
                alert(mode === 'question' ? '질문이 저장되었습니다!' : '토론이 저장되었습니다!');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (isChatActive) {
            setIsChatActive(false);
            setMessages([]);
            setQuestion('');
            setTopic('');
        } else {
            setMode('select');
            setQuestion('');
            setTopic('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isChatActive) {
                handleSendMessage();
            } else if (mode === 'question') {
                handleStartQuestion();
            } else if (mode === 'discussion') {
                handleStartDiscussion();
            }
        }
    };

    if (mode === 'select') {
        return (
            <div className="ai-discussion-page">
                <header>
                    <div className="logo">JuJu</div>
                    <div className="login-join">
                        {user ? (
                            <>
                                <span className="status">{user.name}님</span>
                                <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>로그아웃</a>
                            </>
                        ) : (
                            <>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>SIGN IN</a>
                                <span>|</span>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('logup'); }}>SIGN UP</a>
                            </>
                        )}
                    </div>
                </header>

                <nav className="nav-tabs">
                    <div className="active" onClick={() => onNavigate('main')}>메인 페이지</div>
                    <div className="active" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>AI와 토론</div>
                    <div className="active" onClick={() => onNavigate('mypage')}>개인 페이지</div>
                </nav>

                <main className="discussion-main">
                    <div className="mode-select-container">
                        <h1 className="mode-select-title">AI와 함께하는 학습</h1>
                        <p className="mode-select-subtitle">원하는 학습 방식을 선택해주세요</p>

                        <div className="mode-cards">
                            <div className="mode-card" onClick={() => setMode('question')}>
                                <h2 className="mode-title">질문하기</h2>
                                <p className="mode-description">
                                    주기율표에 대한 궁금한 점을<br />
                                    질문하고 명확한 답변을 받아보세요
                                </p>
                                <ul className="mode-features">
                                    <li>✓ 빠른 답변</li>
                                    <li>✓ 명확한 설명</li>
                                    <li>✓ 추가 질문 가능</li>
                                </ul>
                            </div>

                            <div className="mode-card" onClick={() => setMode('discussion')}>
                                <h2 className="mode-title">토론하기</h2>
                                <p className="mode-description">
                                    주제에 대해 AI와 심도있는<br />
                                    토론을 나눠보세요
                                </p>
                                <ul className="mode-features">
                                    <li>✓ 다양한 관점</li>
                                    <li>✓ 깊이있는 대화</li>
                                    <li>✓ 비판적 사고</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (mode === 'question' && !isChatActive) {
        return (
            <div className="ai-discussion-page">
                <header>
                    <div className="logo">JuJu</div>
                    <div className="login-join">
                        {user ? (
                            <>
                                <span className="status">{user.name}님</span>
                                <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>로그아웃</a>
                            </>
                        ) : (
                            <>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>SIGN IN</a>
                                <span>|</span>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('logup'); }}>SIGN UP</a>
                            </>
                        )}
                    </div>
                </header>

                <nav className="nav-tabs">
                    <div className="active" onClick={() => onNavigate('main')}>메인 페이지</div>
                    <div className="active" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>AI와 토론</div>
                    <div className="active" onClick={() => onNavigate('mypage')}>개인 페이지</div>
                </nav>

                <main className="discussion-main">
                    <div className="topic-input-container">
                        <button className="back-btn" onClick={handleBack}>← 뒤로가기</button>

                        <h1 className="topic-heading">주기율표 질문하기</h1>

                        <div className="chat-preview-area">
                            <div className="preview-message ai-preview">
                                주기율표에 대한 궁금한 점을 질문해주세요
                            </div>
                            <div className="preview-message user-preview">
                                명확하고 자세한 답변을 드리겠습니다
                            </div>
                        </div>

                        <div className="examples-section">
                            <h3 className="examples-title">인기 질문 예시</h3>
                            <div className="examples-grid">
                                {exampleQuestions.map((example, index) => (
                                    <div
                                        key={index}
                                        className="example-card"
                                        onClick={() => handleExampleClick(example)}
                                    >
                                        <div className="example-question">{example.topic}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="topic-input-area">
                            <div className="input-group">
                                <label className="input-label">질문</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        className="question-input-field"
                                        placeholder="주기율표에 대해 궁금한 점을 질문하세요"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                            </div>

                            <button
                                className="start-btn"
                                onClick={handleStartQuestion}
                                disabled={!question.trim()}
                            >
                                질문하기
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // 토론하기 모드
    if (mode === 'discussion' && !isChatActive) {
        return (
            <div className="ai-discussion-page">
                <header>
                    <div className="logo">JuJu</div>
                    <div className="login-join">
                        {user ? (
                            <>
                                <span className="status">{user.name}님</span>
                                <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>로그아웃</a>
                            </>
                        ) : (
                            <>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>SIGN IN</a>
                                <span>|</span>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('logup'); }}>SIGN UP</a>
                            </>
                        )}
                    </div>
                </header>

                <nav className="nav-tabs">
                    <div className="active" onClick={() => onNavigate('main')}>메인 페이지</div>
                    <div className="active" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>AI와 토론</div>
                    <div className="active" onClick={() => onNavigate('mypage')}>개인 페이지</div>
                </nav>

                <main className="discussion-main">
                    <div className="topic-input-container">
                        <button className="back-btn" onClick={handleBack}>← 뒤로가기</button>

                        <h1 className="topic-heading">AI와 토론하기</h1>

                        <div className="chat-preview-area">
                            <div className="preview-message ai-preview">
                                다양한 관점에서 깊이있는 대화를 나눠보세요
                            </div>
                            <div className="preview-message user-preview">
                                주제를 선택하고 토론을 시작하세요
                            </div>
                        </div>

                        <div className="examples-section">
                            <h3 className="examples-title">인기 토론 주제</h3>
                            <div className="examples-grid">
                                {exampleDiscussions.map((example, index) => (
                                    <div
                                        key={index}
                                        className="example-card"
                                        onClick={() => handleExampleClick(example)}
                                    >
                                        <div className="example-question">{example.topic}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="topic-input-area">
                            <div className="input-group">
                                <label className="input-label">토론 주제</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        className="topic-input-field"
                                        placeholder="토론 주제를 입력하세요"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                            </div>

                            <button
                                className="start-btn"
                                onClick={handleStartDiscussion}
                                disabled={!topic.trim()}
                            >
                                토론 시작하기
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // 채팅 활성화 화면
    return (
        <div className="ai-discussion-page">
            <header>
                <div className="logo">JuJu</div>
                <div className="login-join">
                    {user ? (
                        <>
                            <span className="status">{user.name}님</span>
                            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>로그아웃</a>
                        </>
                    ) : (
                        <>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>SIGN IN</a>
                            <span>|</span>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('logup'); }}>SIGN UP</a>
                        </>
                    )}
                </div>
            </header>

            <nav className="nav-tabs">
                <div className="active" onClick={() => onNavigate('main')}>메인 페이지</div>
                <div className="active" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>AI와 토론</div>
                <div className="active" onClick={() => onNavigate('mypage')}>개인 페이지</div>
            </nav>

            <main className="discussion-main">
                <div className="chat-active-container">
                    <div className="chat-header-bar">
                        <div>
                            <div className="mode-badge">{mode === 'question' ? '질문' : '토론'}</div>
                            <h2 className="current-topic">{currentTopic}</h2>
                        </div>
                        <div className="header-actions">
                            <button className="save-discussion-btn" onClick={handleSave}>
                                저장
                            </button>
                            <button className="change-topic-btn" onClick={handleBack}>
                                {mode === 'question' ? '질문 변경' : '주제 변경'}
                            </button>
                        </div>
                    </div>

                    <div className="messages-area">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chat-message ${message.role === 'user' ? 'user-msg' : 'ai-msg'}`}
                            >
                                <div className="message-content">
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message ai-msg">
                                <div className="message-content loading-msg">
                                    AI가 답변을 생성하고 있습니다...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            className="chat-input-field"
                            placeholder="메시지를 입력하세요..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <div className="input-actions">
                            <button
                                className="action-btn submit-btn"
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                title="전송"
                            >
                                전송
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}