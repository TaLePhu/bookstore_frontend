import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/LoginForm.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'antd/dist/reset.css';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notify, setNotify] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [cooldown, setCooldown] = useState(0);     // thời gian đếm ngược
    const [isBlocked, setIsBlocked] = useState(false); // chặn nút

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
            const { jwt, role } = response.data;
            console.log('Token nhận được sau login:', jwt);
            localStorage.setItem('token', jwt);
            const decoded: any = jwtDecode(jwt);
            localStorage.setItem('user', JSON.stringify(decoded));

            toast.success('Đăng nhập thành công!')
            if (role === 'ADMIN' || role === 'STAFF') {
                navigate('/admin');
            } else {
                navigate('/');
            }
            window.location.reload();
        })
        .catch((error) => {
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                toast.error('Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 60 giây.');
                setIsBlocked(true);
                setCooldown(30); 

                const interval = setInterval(() => {
                    setCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setIsBlocked(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
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
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="Mật khẩu*"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <div className="footer-links">
                    <p>
                        Bạn chưa có tài khoản? <Link to="/auth/dang-ky">Đăng ký</Link>
                    </p>
                </div>
                <button type="submit" className="login-btn" disabled={isBlocked}>
                    {isBlocked ? `Vui lòng chờ ${cooldown}s` : 'ĐĂNG NHẬP'}
                </button>
            </form>
            {notify && <div style={{ color: 'red' }}>{notify}</div>}
            <div className="footer-links">
                <p>
                    <a href="/auth/quen-mat-khau">Quên mật khẩu</a>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
