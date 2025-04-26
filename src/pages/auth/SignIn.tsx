import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/LoginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notify, setNotify] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const loginRequest = {
            username: username,
            password: password,
        };

        fetch('http://localhost:8080/account/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginRequest),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Đăng nhập thất bại!');
                }
            })
            .then((data) => {
                // Xử lý đăng nhập thành công
                const { jwt } = data;
                // Lưu token vào localStorage hoặc cookie
                localStorage.setItem('token', jwt);
                // Điều hướng đến trang chính hoặc thực hiện các tác vụ sau đăng nhập thành công
                setNotify('Đăng nhập thành công!');
            })
            .catch((error) => {
                // Xử lý lỗi đăng nhập
                console.error('Đăng nhập thất bại: ', error);
                setNotify('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
            });
    };

    return (
        <div
            className="login-container"
            style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '5px',
            }}
        >
            <h2>ĐĂNG NHẬP</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Tên đăng nhập*"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Mật khẩu*"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="footer-links">
                    <p>
                        Bạn chưa có tài khoản? <Link to="/auth/dang-ky">Đăng ký</Link>
                    </p>
                </div>
                <button type="submit" className="login-btn">
                    ĐĂNG NHẬP
                </button>
            </form>
            {notify && <div style={{ color: 'red' }}>{notify}</div>}
            <div className="footer-links">
                <p>
                    <a href="#">Quên mật khẩu</a>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
