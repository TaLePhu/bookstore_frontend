import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../api/UserAPI';
import UserModel, { Role } from '../../models/UserModel';
import '../../assets/styles/UserList.css';
import { AxiosError } from 'axios';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('ALL');

    useEffect(() => {
        // Debug: Log all localStorage keys
        console.log('All localStorage keys:', Object.keys(localStorage));
        
        // Try different possible keys for user info
        const possibleKeys = ['userInfo', 'user', 'currentUser', 'authUser'];
        let foundUser = false;

        for (const key of possibleKeys) {
            const userData = localStorage.getItem(key);
            if (userData) {
                try {
                    const parsedData = JSON.parse(userData);
                    console.log(`Found data in ${key}:`, parsedData);
                    
                    // Check if the data contains userId
                    if (parsedData.userId) {
                        console.log('Setting current user ID:', parsedData.userId);
                        setCurrentUserId(parsedData.userId);
                        foundUser = true;
                        break;
                    }
                } catch (error) {
                    console.error(`Error parsing ${key}:`, error);
                }
            }
        }

        if (!foundUser) {
            console.log('No user ID found in localStorage');
        }

        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedRole === 'ALL') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user => 
                user.roles && user.roles.includes(selectedRole)
            );
            setFilteredUsers(filtered);
        }
    }, [selectedRole, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            console.log('User data from API:', data);
            setUsers(data);
            setError(null);
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response) {
                    const errorMessage = err.response.data?.message || err.response.data?.error || 'Không thể tải danh sách người dùng';
                    alert(errorMessage);
                } else if (err.request) {
                    alert('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối internet.');
                } else {
                    alert('Đã xảy ra lỗi khi thiết lập yêu cầu.');
                }
            } else {
                alert('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: UserModel) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (userId: number) => {
        const userToDelete = users.find(user => user.userId === userId);
        if (!userToDelete) return;

        // Hiển thị hộp thoại xác nhận
        const confirmDelete = window.confirm(
            `Bạn có chắc chắn muốn xóa người dùng "${userToDelete.username}" không?\n` +
            `Họ tên: ${userToDelete.firstName} ${userToDelete.lastName}\n` +
            `Email: ${userToDelete.email}`
        );

        if (!confirmDelete) return;

        try {
            // Thử xóa để kiểm tra ràng buộc
            await deleteUser(userId);
            // Nếu không có lỗi, xóa user khỏi danh sách
            setUsers(users.filter(user => user.userId !== userId));
            setError(null);
            alert('Xóa người dùng thành công');
        } catch (error: any) {
            console.error('Error deleting user:', error);
            let errorMessage = '';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message && (error.message.includes('đơn hàng') || error.message.includes('giỏ hàng'))) {
                errorMessage = error.message;
            } else {
                errorMessage = 'Không thể xóa người dùng này vì có dữ liệu liên quan. Vui lòng vô hiệu hóa tài khoản thay vì xóa.';
            }

            // Hiển thị thông báo lỗi trong alert
            alert(errorMessage);
            setError(errorMessage);
        }
    };

    const handleCloseEditModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            // Đảm bảo chỉ có một quyền được chọn
            const selectedRole = selectedUser.roles[0];
            if (!selectedRole) {
                alert('Vui lòng chọn một quyền cho người dùng');
                return;
            }

            const updatedUserData = {
                ...selectedUser,
                roles: [selectedRole]
            };

            const updatedUser = await updateUser(selectedUser.userId, updatedUserData);
            setUsers(users.map(user => 
                user.userId === updatedUser.userId ? updatedUser : user
            ));
            handleCloseEditModal();
            alert('Cập nhật quyền người dùng thành công');
        } catch (error: any) {
            console.error('Error updating user:', error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Không thể cập nhật quyền người dùng. Vui lòng thử lại sau.');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedUser) return;

        const { name, value, type, checked } = e.target;
        setSelectedUser({
            ...selectedUser,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleRoleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRole(e.target.value);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Đang tải danh sách người dùng...</p>
            </div>
        );
    }

    return (
        <div className="user-list-container">
            <div className="user-list-header">
                <h2>Quản lý người dùng</h2>
                <div className="header-actions">
                    <div className="role-filter">
                        <label className="role-filter-label">
                            <input
                                type="radio"
                                name="roleFilter"
                                value="ALL"
                                checked={selectedRole === 'ALL'}
                                onChange={handleRoleFilterChange}
                            />
                            Tất cả
                        </label>
                        <label className="role-filter-label">
                            <input
                                type="radio"
                                name="roleFilter"
                                value="ADMIN"
                                checked={selectedRole === 'ADMIN'}
                                onChange={handleRoleFilterChange}
                            />
                            Admin
                        </label>
                        <label className="role-filter-label">
                            <input
                                type="radio"
                                name="roleFilter"
                                value="STAFF"
                                checked={selectedRole === 'STAFF'}
                                onChange={handleRoleFilterChange}
                            />
                            Staff
                        </label>
                        <label className="role-filter-label">
                            <input
                                type="radio"
                                name="roleFilter"
                                value="USER"
                                checked={selectedRole === 'USER'}
                                onChange={handleRoleFilterChange}
                            />
                            User
                        </label>
                    </div>
                    <button className="refresh-button" onClick={fetchUsers}>
                        Làm mới danh sách
                    </button>
                </div>
            </div>

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên đăng nhập</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Quyền</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="no-data">
                                    Không tìm thấy người dùng nào
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => {
                                const isCurrentUser = user.userId === currentUserId;
                                return (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>{user.username}</td>
                                        <td>{`${user.firstName} ${user.lastName}`}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td>
                                            <div className="role-badges">
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.map((role, index) => (
                                                        <span key={index} className={`role-badge ${role.toLowerCase()}`}>
                                                            {role}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="role-badge user">USER</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="edit-btn-user"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Sửa
                                                </button>
                                                <button 
                                                    className={`delete-btn-user ${isCurrentUser ? 'disabled' : ''}`}
                                                    onClick={() => handleDelete(user.userId)}
                                                    disabled={isCurrentUser}
                                                    title={isCurrentUser ? 'Không thể xóa tài khoản đang đăng nhập' : 'Xóa người dùng'}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Phân quyền người dùng</h2>
                            <button className="close-btn" onClick={handleCloseEditModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Thông tin người dùng:</label>
                                    <div className="user-info">
                                        <p><strong>Tên đăng nhập:</strong> {selectedUser.username}</p>
                                        <p><strong>Họ và tên:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                                        <p><strong>Email:</strong> {selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Quyền người dùng</label>
                                    <div className="role-radio">
                                        <label className="role-radio-label">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="ADMIN"
                                                checked={selectedUser.roles.includes("ADMIN")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUser({
                                                            ...selectedUser,
                                                            roles: ["ADMIN"]
                                                        });
                                                    }
                                                }}
                                            />
                                            ADMIN
                                        </label>
                                        <label className="role-radio-label">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="STAFF"
                                                checked={selectedUser.roles.includes("STAFF")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUser({
                                                            ...selectedUser,
                                                            roles: ["STAFF"]
                                                        });
                                                    }
                                                }}
                                            />
                                            STAFF
                                        </label>
                                        <label className="role-radio-label">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="USER"
                                                checked={selectedUser.roles.includes("USER")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUser({
                                                            ...selectedUser,
                                                            roles: ["USER"]
                                                        });
                                                    }
                                                }}
                                            />
                                            USER
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-buttons">
                                    <button type="button" className="cancel-btn" onClick={handleCloseEditModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="save-btn">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
