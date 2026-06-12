import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Briefcase, GraduationCap, Loader2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(name, email, password, role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 container min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/10 rounded-full blur-[140px] z-0"></div>
            
            <div className="glass-card p-12 w-full max-w-4xl relative z-10 animate-up">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Begin Your Journey</h2>
                    <p className="text-text-secondary text-lg font-medium">Join 50,000+ pioneers mastering the future of tech.</p>
                </div>

                {error && <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-xl text-sm font-bold mb-8 animate-pulse text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">Identity (Full Name)</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Master Amit Katiyar"
                                className="w-full glass bg-white/5 py-4 pl-14 pr-6 rounded-2xl outline-none border-border-light focus:border-primary transition-all text-lg font-medium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">Nexus Point (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                className="w-full glass bg-white/5 py-4 pl-14 pr-6 rounded-2xl outline-none border-border-light focus:border-primary transition-all text-lg font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold text-text-secondary uppercase tracking-widest ml-1">Access Cipher</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full glass bg-white/5 py-4 pl-14 pr-6 rounded-2xl outline-none border-border-light focus:border-primary transition-all text-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold text-text-secondary uppercase tracking-widest ml-1">Your Protocol</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all border-2 ${role === 'student' ? 'bg-primary border-primary text-white shadow-glow' : 'glass border-border-light text-text-secondary hover:text-white'}`}
                            >
                                <GraduationCap size={22} /> STUDENT
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('instructor')}
                                className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all border-2 ${role === 'instructor' ? 'bg-secondary border-secondary text-white shadow-glow' : 'glass border-border-light text-text-secondary hover:text-white'}`}
                            >
                                <Briefcase size={22} /> MENTOR
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="w-full btn btn-primary py-5 text-xl justify-center font-extrabold shadow-glow" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={24} /> INITIALIZE ACCOUNT</>}
                        </button>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-border-light text-center">
                    <p className="text-text-secondary font-medium">
                        Already part of the stellar network? <Link to="/login" className="text-primary font-bold no-underline hover:text-white transition-colors ml-2">ACCESS PORTAL</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
