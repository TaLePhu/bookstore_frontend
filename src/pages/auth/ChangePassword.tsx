import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:8080/account/change-password',
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Đổi mật khẩu thành công.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    };

    return (
        <div className="reset-container">
            <h2>Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit}  className="forgot-form">
                 <div className="password-wrapper">
                    <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="input-email-forgot"
                    />
                    <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                        className="eye-icon"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                </div>
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
                <button type="submit" className="forgot-btn">Xác nhận</button>
            </form>
        </div>
    );
};

export default ChangePassword;
