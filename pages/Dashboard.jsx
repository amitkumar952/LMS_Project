import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { BookOpen, Award, Clock, ArrowRight, Play, Loader2, PlusCircle, Layout, User as UserIcon, Zap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookedSessions, setBookedSessions] = useState([]);

    useEffect(() => {
        const fetchEnrolled = async () => {
            try {
                const { data } = await api.get('/courses');
                const filtered = data.filter(c => user?.enrolledCourses?.includes(c._id));
                setEnrolledCourses(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchEnrolled();

        const fetchSessions = () => {
            const sessions = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
            setBookedSessions(sessions);
        };
        fetchSessions();
    }, [user]);

    const handleCancelSession = (sessionId) => {
        if (!window.confirm("Are you sure you want to cancel this mentorship session?")) return;
        const sessions = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
        const updated = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem('bookedSessions', JSON.stringify(updated));
        setBookedSessions(updated);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <Loader2 className="animate-spin text-primary" size={64} />
            <span className="text-xl font-bold text-text-secondary animate-pulse">Syncing your stellar library...</span>
        </div>
    );

    return (
        <div className="pt-32 pb-20">
            <div className="container animate-up">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                    <div className="flex gap-8 items-center">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-accent p-1 shadow-glow">
                            <div className="w-full h-full bg-bg-main rounded-[20px] flex items-center justify-center text-3xl font-black">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 text-primary font-bold mb-2">
                                <Zap size={18} /> CITIZEN OF STELLAR
                            </div>
                            <h1 className="text-5xl font-black tracking-tight tracking-tighter">Welcome Back, {user?.name.split(' ')[0]}</h1>
                            <p className="text-text-secondary text-lg font-medium">Your learning journey is 35% complete. The path ahead looks bright.</p>
                        </div>
                    </div>
                    {user?.role === 'instructor' && (
                        <Link to="/create-course" className="btn btn-primary px-8 py-4 text-lg shadow-glow no-underline text-white">
                            <PlusCircle size={24} /> CREATE NEW COURSE
                        </Link>
                    )}
                </header>

                {/* Stats Command Center */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: "COURSES IN LIBRARY", val: enrolledCourses.length, color: "var(--primary)" },
                        { label: "COMPLETED MODULES", val: "12", color: "var(--secondary)" },
                        { label: "CERTIFICATES EARNED", val: "0", color: "var(--accent)" },
                        { label: "LEARNING STREAK", val: "5 DAYS", color: "var(--primary)" }
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-card p-8 border-bright flex flex-col gap-2">
                            <span className="text-xs font-black text-text-secondary tracking-[0.2em]">{stat.label}</span>
                            <span className="text-4xl font-black" style={{ color: stat.color }}>{stat.val}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-4 mb-10">
                    <Layout className="text-primary" size={28} />
                    <h2 className="text-3xl font-black tracking-tight">Active Curriculums</h2>
                </div>
                
                {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {enrolledCourses.map(course => (
                            <div key={course._id} className="glass-card group overflow-hidden flex flex-col hover:border-primary/50">
                                <div className="relative h-44 overflow-hidden">
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-[2px]">
                                        <div className="bg-primary p-4 rounded-full shadow-glow transform scale-75 group-hover:scale-100 transition-transform">
                                            <Play size={28} fill="currentColor" className="text-white" />
                                        </div>
                                    </div>
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="glass px-3 py-1 rounded text-[10px] font-black uppercase text-primary-hover border-bright">{course.category}</span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-6 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                                    
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-black text-text-secondary">ESTIMATED PROGRESS</span>
                                            <span className="text-sm font-black text-white">35%</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-border-light">
                                            <div className="bg-primary h-full w-[35%] rounded-full shadow-glow"></div>
                                        </div>
                                    </div>

                                    <Link to={`/course/${course._id}`} className="mt-8 btn btn-outline w-full justify-center text-sm font-black tracking-widest no-underline">
                                        RESUME NEURAL LINK <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-32 text-center flex flex-col items-center gap-8 border-dashed border-2 opacity-80">
                        <div className="bg-white/5 p-8 rounded-full border border-border-light shadow-xl">
                            <Zap size={64} className="text-text-secondary" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="text-3xl font-black">Archive Empty</h3>
                            <p className="text-text-secondary text-xl max-w-sm mx-auto font-medium">Your path to mastery hasn't started yet. Initialize your first module now.</p>
                        </div>
                        <Link to="/courses" className="btn btn-primary px-12 py-5 text-lg font-black tracking-widest no-underline text-white shadow-glow">
                            BROWSE NEXUS
                        </Link>
                    </div>
                )}

                {/* Booked Mentor Sessions Section */}
                <div className="mt-20 flex flex-col gap-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                            <Clock className="text-secondary" size={28} />
                            <h2 className="text-3xl font-black tracking-tight">Mentorship Consultations</h2>
                        </div>
                        <span className="glass px-3 py-1 rounded-full text-xs font-black text-secondary border-secondary/20">
                            {bookedSessions.length} SESSIONS SCHEDULED
                        </span>
                    </div>

                    {bookedSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {bookedSessions.map((session) => (
                                <div key={session.id} className="glass-card p-8 border-bright flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-secondary/40 animate-up">
                                    <div className="flex items-center gap-6 text-left w-full">
                                        <img 
                                            src={session.mentorAvatar} 
                                            alt={session.mentorName} 
                                            className="w-16 h-16 rounded-full object-cover border border-white/10" 
                                        />
                                        <div>
                                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{session.company} • {session.mentorRole}</span>
                                            <h3 className="text-xl font-black text-white mt-1">{session.mentorName}</h3>
                                            <div className="flex flex-wrap gap-4 text-xs font-bold text-text-secondary mt-2">
                                                <span className="flex items-center gap-1.5"><Calendar size={14} /> {session.date}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={14} /> {session.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
                                        <a 
                                            href={session.meetUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn btn-primary py-3 px-6 text-xs font-black tracking-wider w-full justify-center shadow-glow no-underline text-white"
                                        >
                                            JOIN MEETING
                                        </a>
                                        <button 
                                            onClick={() => handleCancelSession(session.id)}
                                            className="btn btn-outline py-3 px-6 text-xs font-bold w-full justify-center hover:bg-danger/10 hover:text-danger hover:border-danger/30"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-12 text-center border-dashed border-2 opacity-75 flex flex-col items-center gap-4">
                            <BookOpen className="text-text-secondary opacity-30" size={40} />
                            <h3 className="text-lg font-bold text-white">No Consultations Slotted</h3>
                            <p className="text-text-secondary text-sm font-semibold max-w-xs mx-auto">
                                Schedule a 1:1 consultation slot with an industry director to review engineering parameters.
                            </p>
                            <Link to="/mentors" className="btn btn-outline py-2 px-6 text-xs font-black tracking-widest mt-2 no-underline text-white">
                                BROWSE FACULTY
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
