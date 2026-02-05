import { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    Search,
    Mail,
    Phone,
    MapPin,
    Calendar,
    UserCheck,
    UserX,
    Loader2
} from 'lucide-react';
import { authAPI } from '../../services/api';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await authAPI.getAllUsers();
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="admin-users-loading">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="admin-users">
            <header className="admin-users__header">
                <div className="admin-users__header-text">
                    <h1>User Management</h1>
                    <p>View and manage all registered customers</p>
                </div>
                <div className="admin-users__stats">
                    <div className="admin-users__stat-card">
                        <UsersIcon size={24} />
                        <div>
                            <span className="count">{users.length}</span>
                            <span className="label">Total Users</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="admin-users__controls">
                <div className="admin-users__search">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="admin-users__error">{error}</div>}

            <div className="admin-users__table-container">
                <table className="admin-users__table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="user-text">
                                                <span className="name">{user.name}</span>
                                                <span className="id">ID: {user.id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <div className="item">
                                                <Phone size={14} />
                                                <span>{user.mobile}</span>
                                            </div>
                                            {user.email && (
                                                <div className="item">
                                                    <Mail size={14} />
                                                    <span>{user.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="address-info">
                                            <MapPin size={14} />
                                            <span>{user.address || 'No address provided'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.isMember ? 'member' : 'guest'}`}>
                                            {user.isMember ? (
                                                <><UserCheck size={14} /> Member</>
                                            ) : (
                                                <><UserX size={14} /> Guest</>
                                            )}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="join-info">
                                            <Calendar size={14} />
                                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-results">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
