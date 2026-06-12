import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Users, User, Shield, AlertTriangle, Trash2, Check, RefreshCw, Loader2 } from 'lucide-react';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/auth/users');
            setUsers(data);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to sync users index.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleRoleChange = async (userId, newRole) => {
        setActionLoading(userId);
        setMessage({ text: '', type: '' });
        try {
            await api.put(`/auth/users/${userId}/role`, { role: newRole });
            setMessage({ text: 'User authorization level updated!', type: 'success' });
            // Update local state
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to modify role parameters.', type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you absolutely sure you want to terminate this user session? This will remove all their enrollments and data!")) return;
        
        setActionLoading(userId);
        setMessage({ text: '', type: '' });
        try {
            await api.delete(`/auth/users/${userId}`);
            setMessage({ text: 'User removed from network successfully.', type: 'success' });
            // Update local state
            setUsers(users.filter(u => u._id !== userId));
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to terminate user account.', type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    if (currentUser?.role !== 'admin' && currentUser?.role !== 'instructor') {
        return (
            <div className="container py-40 text-center font-bold text-2xl text-danger">
                ACCESS VIOLATION: Requires administrator credentials.
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
            {/* Background auroras */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[160px] z-0"></div>
            
            <div className="container mx-auto px-4 relative z-10 animate-up">
                <div className="flex flex-col gap-10">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
                        <div className="flex items-center gap-5">
                            <div className="bg-primary/20 p-4 rounded-2xl text-primary shadow-glow">
                                <Users size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white">Users Security Console</h1>
                                <p className="text-text-secondary text-sm font-semibold mt-1">
                                    Monitor system accounts, alter authentication levels, and decommission credentials.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={fetchUsers} 
                            className="btn btn-outline py-3 px-6 text-sm font-bold flex items-center gap-2"
                            disabled={loading}
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            REFRESH INDEX
                        </button>
                    </header>

                    {message.text && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 font-semibold ${
                            message.type === 'success' 
                                ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                                : 'bg-danger/10 border-danger/30 text-danger'
                        }`}>
                            <AlertTriangle size={18} />
                            {message.text}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <Loader2 className="animate-spin text-primary" size={48} />
                            <span className="text-text-secondary font-bold">Querying Stellar Directories...</span>
                        </div>
                    ) : (
                        <div className="glass-card border-bright overflow-hidden">
                            <div className="overflow-x-auto w-full">
                                <table className="w-full border-collapse text-left text-sm text-text-secondary">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5 font-black text-white text-xs uppercase tracking-widest">
                                            <th className="py-5 px-8">IDENTITY</th>
                                            <th className="py-5 px-8">CONTACT</th>
                                            <th className="py-5 px-8">ACCESS ROLE</th>
                                            <th className="py-5 px-8">COMMISSION DATE</th>
                                            {currentUser?.role === 'admin' && <th className="py-5 px-8 text-right">OPERATIONS</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(targetUser => (
                                            <tr key={targetUser._id} className="hover:bg-white/2 transition-colors">
                                                <td className="py-5 px-8 font-bold text-white flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/30 to-secondary/30 flex items-center justify-center font-extrabold text-sm border border-white/5">
                                                        {targetUser.name.charAt(0)}
                                                    </div>
                                                    {targetUser.name}
                                                    {targetUser._id === currentUser._id && (
                                                        <span className="glass px-2 py-0.5 rounded text-[10px] font-black text-secondary uppercase border-secondary/20">YOU</span>
                                                    )}
                                                </td>
                                                <td className="py-5 px-8 font-medium">{targetUser.email}</td>
                                                <td className="py-5 px-8 font-bold">
                                                    {currentUser.role === 'admin' && targetUser._id !== currentUser._id ? (
                                                        <div className="relative w-fit">
                                                            <select
                                                                value={targetUser.role}
                                                                onChange={(e) => handleRoleChange(targetUser._id, e.target.value)}
                                                                className="glass bg-bg-main outline-none text-xs font-black uppercase text-white py-1.5 pl-3 pr-8 rounded border-border-light focus:border-primary cursor-pointer tracking-wider"
                                                                disabled={actionLoading === targetUser._id}
                                                            >
                                                                <option value="student">Student</option>
                                                                <option value="instructor">Instructor</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                            {actionLoading === targetUser._id && (
                                                                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                                                                    <Loader2 className="animate-spin text-primary" size={12} />
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${
                                                            targetUser.role === 'admin' ? 'bg-danger/20 text-danger' : 
                                                            targetUser.role === 'instructor' ? 'bg-secondary/20 text-secondary' : 
                                                            'bg-primary/20 text-primary-hover'
                                                        }`}>
                                                            {targetUser.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-5 px-8 font-medium">
                                                    {new Date(targetUser.createdAt || Date.now()).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                {currentUser?.role === 'admin' && (
                                                    <td className="py-5 px-8 text-right">
                                                        <button
                                                            onClick={() => handleDeleteUser(targetUser._id)}
                                                            className="text-text-secondary hover:text-danger p-2 rounded-lg hover:bg-danger/10 transition-all border-none cursor-pointer"
                                                            disabled={targetUser._id === currentUser._id || actionLoading === targetUser._id}
                                                            title={targetUser._id === currentUser._id ? "You cannot decommission yourself" : "Decommission Account"}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {users.length === 0 && (
                                <div className="py-20 text-center font-bold text-text-secondary">
                                    No records present.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
