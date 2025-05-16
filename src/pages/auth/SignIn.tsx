import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/LoginForm.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Alert, notification, message } from 'antd';
import axios from 'axios';
import 'antd/dist/reset.css';

notification.config({
  top: 100, // điều chỉnh sao cho thấp hơn navbar
});

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notify, setNotify] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const loginRequest = {
            username: username.trim(),
            password: password.trim(),
        };

        axios.post('http://localhost:8080/account/sign-in', loginRequest, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            const { jwt } = response.data;
            console.log('Token nhận được sau login:', jwt);
            localStorage.setItem('token', jwt);
            const decoded: any = jwtDecode(jwt);
            localStorage.setItem('user', JSON.stringify(decoded));

            setNotify('Đăng nhập thành công!');
            navigate('/profile');
            window.location.reload();
        })
        .catch((error) => {
            console.error('Đăng nhập thất bại:', error);
            setNotify('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');

            if (axios.isAxiosError(error) && error.response?.status === 429) {
                setNotify('Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút.');
            }
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
