import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = localStorage.getItem('forgotEmail');
        if (!email) return toast.error('Thiếu email. Hãy quay lại bước trước');

        if (newPassword !== confirmPassword) {
            return toast.error('Mật khẩu không khớp. Vui lòng kiểm tra lại.');
        }

        try {
            await axios.post('http://localhost:8080/account/reset-password', {
                email,
                otp,
                newPassword,
                confirmPassword
            });
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            navigate('/auth/dang-nhap');
        } catch (error) {
            console.error(error);
            toast.error('Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã OTP và mật khẩu.');
        }
    };

    return (
        <div className="reset-container">
            <h2>Đặt lại mật khẩu</h2>
            <form onSubmit={handleResetPassword} className="forgot-form">
                <input
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="input-email-forgot"
                />

                <div className="password-wrapper">
                    <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="input-email-forgot"
                    />
                    <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                        className="eye-icon"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                </div>

                <div className="password-wrapper">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="input-email-forgot"
                    />
                    <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="eye-icon"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </div>

                <button type="submit" className="forgot-btn">Đặt lại mật khẩu</button>
            </form>
            <a href='/auth/quen-mat-khau'>Quay lại bước gửi mã</a>
        </div>
    );
};

export default ResetPassword;
