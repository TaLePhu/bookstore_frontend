import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/ForgotPassword.css';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/account/forgot-password', { email });
            toast.success('Mã OTP đã được gửi đến email của bạn.');
            localStorage.setItem('forgotEmail', email);
            navigate('/reset-password');
        } catch (error) {
            toast.error('Gửi mã OTP thất bại. Vui lòng kiểm tra lại email.');
        }
    };

    return (
        <div className="forgot-container">
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleSendOtp} className="forgot-form">
                <input
                    type="email"
                    placeholder="Nhập email đăng ký"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-email-forgot"
                />
                <button type="submit" className="forgot-btn">Gửi mã OTP</button>
            </form>
            <a href='/auth/dang-nhap' >Quay lại đăng nhập</a>
        </div>
    );
};

export default ForgotPassword;
