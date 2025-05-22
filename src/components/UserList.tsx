import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../api/UserAPI';
import UserModel from '../models/UserModel';
import '../assets/styles/UserList.css';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: UserModel) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(user => user.userId !== userId));
                setError(null);
            } catch (err) {
                setError('Failed to delete user. Please try again later.');
                console.error('Error deleting user:', err);
            }
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
            const updatedUser = await updateUser(selectedUser.userId, selectedUser);
            setUsers(users.map(user => 
                user.userId === updatedUser.userId ? updatedUser : user
            ));
            handleCloseEditModal();
            setError(null);
        } catch (err) {
            setError('Failed to update user. Please try again later.');
            console.error('Error updating user:', err);
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

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button className="retry-button" onClick={fetchUsers}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="user-list-container">
            <div className="user-list-header">
                <h2>User Management</h2>
                <button className="refresh-button" onClick={fetchUsers}>
                    Refresh List
                </button>
            </div>

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="no-data">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td>{user.username}</td>
                                    <td>{`${user.firstName} ${user.lastName}`}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>
                                        <span className={`status-badge ${user.isActivated ? 'active' : 'inactive'}`}>
                                            {user.isActivated ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="edit-btn"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDelete(user.userId)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit User</h2>
                            <button className="close-btn" onClick={handleCloseEditModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={selectedUser.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={selectedUser.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Username:</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={selectedUser.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={selectedUser.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number:</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={selectedUser.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password (leave blank to keep current):</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={selectedUser.password || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="isActivated"
                                            checked={selectedUser.isActivated}
                                            onChange={handleInputChange}
                                        />
                                        Active
                                    </label>
                                </div>
                                <div className="modal-buttons">
                                    <button type="button" className="cancel-btn" onClick={handleCloseEditModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="save-btn">
                                        Save Changes
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