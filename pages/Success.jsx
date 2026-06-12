import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { CheckCircle, Loader2, PlayCircle, LogIn, ChevronRight, Sparkles } from 'lucide-react';

const Success = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [courseId, setCourseId] = useState(null);

    useEffect(() => {
        const confirm = async () => {
            try {
                const { data } = await api.post('/payments/confirm-payment', { sessionId });
                setCourseId(data.courseId);
                
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo) {
                    if (!userInfo.enrolledCourses) userInfo.enrolledCourses = [];
                    if (!userInfo.enrolledCourses.includes(data.courseId)) {
                        userInfo.enrolledCourses.push(data.courseId);
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Verification link expired or invalid.');
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) confirm();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="container py-40 flex flex-col items-center gap-10 animate-up text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 blur-[60px] animate-pulse rounded-full"></div>
                    <Loader2 className="animate-spin text-primary relative z-10" size={100} strokeWidth={1} />
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl font-black tracking-tighter">SYNCHRONIZING ACCESS...</h2>
                    <p className="text-text-secondary text-xl font-medium max-w-md mx-auto">Please maintain the connection while we authorize your learning protocol on the nexus.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-40 flex flex-col items-center gap-10 animate-up text-center">
                <div className="bg-danger/10 p-10 rounded-full text-danger border border-danger/20 shadow-2xl">
                    <LogIn size={80} />
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl font-black tracking-tighter">PROTOCOL FAILURE</h2>
                    <p className="text-text-secondary text-xl font-medium max-w-sm mx-auto">{error}</p>
                </div>
                <Link to="/courses" className="btn btn-primary px-12 py-5 text-lg font-black no-underline text-white">RETRY ACCESS</Link>
            </div>
        );
    }

    return (
        <div className="container py-32 flex flex-col items-center gap-12 animate-up text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[160px] z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="bg-primary/20 p-10 rounded-full text-primary shadow-glow border border-primary/40 animate-bounce">
                    <Sparkles size={80} />
                </div>
                
                <div className="flex flex-col gap-4">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gradient-primary">ACCESS GRANTED</h1>
                    <p className="text-2xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
                        The neural link is established. You are now officially enrolled and have full executive access to every module in the curriculum.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 mt-6">
                    <Link to={`/course/${courseId}`} className="btn btn-primary px-16 py-6 text-xl font-black no-underline text-white shadow-glow">
                        START LEARNING <PlayCircle size={28} />
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline px-16 py-6 text-xl font-black no-underline text-white">
                        DASHBOARD <ChevronRight size={28} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Success;
