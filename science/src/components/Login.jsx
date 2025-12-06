import React, { useState } from 'react';

const API_URL = 'http://localhost:3000/api';

function SignIn({ onBack, onLogin }) {
  const [umail, setUmail] = useState('');
  const [upw, setUpw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ umail, upw }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('로그인 데이터:', data);
        const userData = {
          uid: data.user.uid,
          uname: data.user.uname,
          umail: data.user.umail
        };

        alert('로그인 성공!');
        onLogin(userData, data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다. 서버가 실행 중인지 확인하세요.');
      console.error('로그인 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2>로그인</h2>
          <p>계정에 로그인하세요</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            value={umail}
            onChange={(e) => setUmail(e.target.value)}
            placeholder="example@email.com"
            disabled={loading}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={upw}
            onChange={(e) => setUpw(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="input-field"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn-primary btn-full"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <button
          onClick={onBack}
          disabled={loading}
          className="btn btn-secondary btn-full"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

function SignUp({ onBack, onLogin }) {
  const [formData, setFormData] = useState({
    uname: '',
    umail: '',
    upw: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.uname.trim()) {
      setError('이름을 입력해주세요!');
      return;
    }

    if (!formData.umail.trim()) {
      setError('이메일을 입력해주세요!');
      return;
    }

    if (formData.upw !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다!');
      return;
    }

    if (formData.upw.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uname: formData.uname,
          umail: formData.umail,
          upw: formData.upw
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('회원가입 데이터:', data);

        const userData = {
          uid: data.user.uid,
          uname: data.user.uname,
          umail: data.user.umail
        };

        alert('회원가입 성공!');
        onLogin(userData, data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다. 서버가 실행 중인지 확인하세요.');
      console.error('회원가입 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2>회원가입</h2>
          <p>새 계정을 만드세요</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            value={formData.uname}
            onChange={(e) => handleChange('uname', e.target.value)}
            placeholder="홍길동"
            disabled={loading}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            value={formData.umail}
            onChange={(e) => handleChange('umail', e.target.value)}
            placeholder="example@email.com"
            disabled={loading}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={formData.upw}
            onChange={(e) => handleChange('upw', e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="input-field"
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn-success btn-full"
        >
          {loading ? '가입 중...' : '가입하기'}
        </button>

        <button
          onClick={onBack}
          disabled={loading}
          className="btn btn-secondary btn-full"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

function Login({ initialPage, onBack, onLogin }) {
  const [currentPage, setCurrentPage] = useState(initialPage || 'signin');

  if (currentPage === 'signup') {
    return <SignUp onBack={onBack} onLogin={onLogin} />;
  }

  return <SignIn onBack={onBack} onLogin={onLogin} />;
}

export default Login;