import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Shield, Calendar, BookOpen, Key, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (password && password !== confirmPassword) {
            return setMessage({ text: "Passwords do not match", type: 'error' });
        }

        setIsUpdating(true);
        try {
            const profileData = { name, email };
            if (password) profileData.password = password;

            await updateProfile(profileData);
            setMessage({ text: "Profile updated successfully!", type: 'success' });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update profile details', type: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) {
        return (
            <div className="container py-40 text-center font-bold text-2xl">
                Please log in to view your profile settings.
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
            {/* Background blur aura */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] z-0"></div>
            
            <div className="container mx-auto px-4 relative z-10 animate-up">
                <div className="max-w-4xl mx-auto flex flex-col gap-10">
                    <header className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-white/10">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-glow flex items-center justify-center">
                            <div className="w-full h-full bg-bg-main rounded-full flex items-center justify-center text-4xl font-black text-white">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white">{user.name}</h1>
                                <span className="glass px-3 py-1 rounded-full text-xs font-black tracking-widest text-primary uppercase border-bright">
                                    {user.role}
                                </span>
                            </div>
                            <p className="text-text-secondary text-lg font-medium">Manage your credentials, verify authorizations and review your catalog parameters.</p>
                        </div>
                    </header>

                    {message.text && (
                        <div className={`p-5 rounded-2xl border flex items-center gap-3 font-semibold ${
                            message.type === 'success' 
                                ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                                : 'bg-danger/10 border-danger/30 text-danger'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Summary panel */}
                        <div className="glass-card p-8 border-bright flex flex-col gap-6 h-fit">
                            <h3 className="text-xl font-bold border-b border-white/5 pb-4">Account Metadata</h3>
                            
                            <div className="flex items-center gap-4 text-sm font-semibold">
                                <Shield className="text-primary flex-shrink-0" size={18} />
                                <div>
                                    <div className="text-text-secondary text-xs uppercase tracking-wider">Access Authorization</div>
                                    <div className="text-white mt-0.5 capitalize">{user.role} Mode</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-semibold">
                                <Calendar className="text-primary flex-shrink-0" size={18} />
                                <div>
                                    <div className="text-text-secondary text-xs uppercase tracking-wider">Commissioned Date</div>
                                    <div className="text-white mt-0.5">
                                        {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-semibold">
                                <BookOpen className="text-primary flex-shrink-0" size={18} />
                                <div>
                                    <div className="text-text-secondary text-xs uppercase tracking-wider">Library Index</div>
                                    <div className="text-white mt-0.5">
                                        {user.enrolledCourses?.length || 0} Syllabus Units Enrolled
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit profile form */}
                        <div className="glass-card p-10 border-bright md:col-span-2">
                            <h3 className="text-2xl font-bold mb-8">Update Security Identity</h3>
                            
                            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Identity Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={16} />
                                            <input
                                                type="text"
                                                className="w-full glass bg-white/5 py-3.5 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-sm font-medium"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Nexus Endpoint (Email)</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={16} />
                                            <input
                                                type="email"
                                                className="w-full glass bg-white/5 py-3.5 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-sm font-medium"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-white/5 my-4 pt-6">
                                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary">
                                        <Key size={16} className="text-primary" /> Modify Cipher (Optional)
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">New Cipher Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={16} />
                                                <input
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    className="w-full glass bg-white/5 py-3.5 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-sm"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Verify Cipher Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={16} />
                                                <input
                                                    type="password"
                                                    placeholder="Verify new password"
                                                    className="w-full glass bg-white/5 py-3.5 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-sm"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-4 py-4 px-10 text-sm font-black tracking-widest justify-center shadow-glow"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" /> : 'SAVE CHANGES'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
