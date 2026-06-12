import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 container min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] z-0"></div>
            
            <div className="glass-card p-12 w-full max-w-xl relative z-10 animate-up">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Welcome Back</h2>
                    <p className="text-text-secondary text-lg font-medium">Continue your path to mastery on EduStellar.</p>
                </div>

                {error && <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-xl text-sm font-bold mb-8 animate-pulse text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">Identity (Email)</label>
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
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-black text-primary uppercase tracking-[0.2em]">Access Cipher (Password)</label>
                            <Link to="#" className="text-[10px] font-black text-text-secondary hover:text-white transition-colors no-underline tracking-widest">FORGOT PASSWORD?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full glass bg-white/5 py-4 pl-14 pr-6 rounded-2xl outline-none border-border-light focus:border-primary transition-all text-lg font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-6 py-5 text-xl justify-center font-extrabold shadow-glow" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={24} /> ACCESS DASHBOARD</>}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-border-light text-center">
                    <p className="text-text-secondary font-medium">
                        New to the stellar platform? <Link to="/register" className="text-primary font-bold no-underline hover:text-white transition-colors ml-2">CREATE ACCOUNT</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
