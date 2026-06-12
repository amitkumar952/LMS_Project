import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Play, Lock, CheckCircle, ArrowLeft, Loader2, Tag, CreditCard, Clock, Globe, ShieldCheck, FileText, Download, BookOpen, Star, X } from 'lucide-react';

const CourseDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [activeTab, setActiveTab] = useState('curriculum');
    const [activeVideo, setActiveVideo] = useState(null);

    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
        }
        if (url.includes('youtu.be/')) {
            const id = url.split('/').pop();
            return `https://www.youtube.com/embed/${id}`;
        }
        return url;
    };

    const handleDownloadNote = (note) => {
        const blob = new Blob([note.content || ''], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_practice.md`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${id}`);
                setCourse(data);
                setDiscountedPrice(data.price);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const { data } = await api.post('/coupons/validate', { code: couponCode });
            const discount = (course.price * data.discountPercentage) / 100;
            setDiscountedPrice(course.price - discount);
            setCouponMessage({ text: `SUCCESS: ${data.discountPercentage}% REDUCTION APPLIED`, type: 'success' });
        } catch (error) {
            setCouponMessage({ text: error.response?.data?.message || 'INVALID CIPHER', type: 'error' });
            setDiscountedPrice(course.price);
        }
    };

    const handleEnroll = async () => {
        if (!user) { navigate('/login'); return; }
        setIsPurchasing(true);
        try {
            const { data } = await api.post('/payments/create-checkout-session', {
                courseId: id,
                couponCode: couponMessage.type === 'success' ? couponCode : null
            });
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            setIsPurchasing(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <Loader2 className="animate-spin text-primary" size={64} />
            <span className="text-xl font-bold text-text-secondary animate-pulse">Initializing course environment...</span>
        </div>
    );
    if (!course) return <div className="container py-40 text-center font-bold text-3xl">COURSE NOT FOUND</div>;

    const isEnrolled = user?.enrolledCourses?.includes(id);

    return (
        <div className="pt-32 pb-20 overflow-hidden">
            <div className="container animate-up">
                <Link to="/courses" className="flex items-center gap-3 text-text-secondary hover:text-white mb-10 no-underline font-bold transition-all group w-fit">
                    <div className="p-2 glass rounded-lg group-hover:-translate-x-1 transition-transform">
                        <ArrowLeft size={20} />
                    </div>
                    RETURN TO CATALOG
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8 flex flex-col gap-12">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="glass-card overflow-hidden h-[500px] relative z-10 border-bright">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-main to-transparent opacity-60"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="glass px-4 py-1.5 text-xs font-black text-primary-hover uppercase border-bright">{course.category}</span>
                                        <div className="flex items-center gap-2 text-white font-bold">
                                            <Star size={18} className="text-primary" fill="currentColor" />
                                            4.9 (1,200+ Reviews)
                                        </div>
                                    </div>
                                    <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">{course.title}</h1>
                                    <div className="flex flex-wrap gap-8 text-text-secondary font-bold">
                                        <div className="flex items-center gap-2"><Clock size={18} /> {course.duration || '12.5 Hours'}</div>
                                        <div className="flex items-center gap-2"><Globe size={18} /> English</div>
                                        <div className="flex items-center gap-2"><ShieldCheck size={18} /> Lifetime Access</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h2 className="text-3xl font-black tracking-tight">Executive Summary</h2>
                            <p className="text-text-secondary text-xl leading-relaxed font-medium">{course.description}</p>
                        </div>

                        {/* Interactive Tabs Menu */}
                        <div className="flex border-b border-white/10 gap-8 mb-4">
                            <button
                                onClick={() => setActiveTab('curriculum')}
                                className={`pb-4 text-xl font-black tracking-wider uppercase border-b-2 transition-all duration-300 ${
                                    activeTab === 'curriculum'
                                        ? 'border-primary text-white'
                                        : 'border-transparent text-text-secondary hover:text-white'
                                }`}
                            >
                                Curriculum Architecture
                            </button>
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`pb-4 text-xl font-black tracking-wider uppercase border-b-2 transition-all duration-300 flex items-center gap-2 ${
                                    activeTab === 'notes'
                                        ? 'border-primary text-white'
                                        : 'border-transparent text-text-secondary hover:text-white'
                                }`}
                            >
                                Practice Notes & Exercises
                                {course.practiceNotes && course.practiceNotes.length > 0 && (
                                    <span className="bg-primary/20 text-primary-hover px-2 py-0.5 rounded-full text-xs">
                                        {course.practiceNotes.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {activeTab === 'curriculum' ? (
                            <div className="glass-card p-10 border-bright animate-up">
                                <div className="flex flex-col gap-4">
                                    {course.lectures && course.lectures.map((lecture, index) => {
                                        const allowed = isEnrolled || lecture.freePreview;
                                        return (
                                            <div 
                                                key={lecture._id} 
                                                onClick={() => allowed && setActiveVideo(lecture)}
                                                className={`glass p-6 flex items-center justify-between group transition-all border-bright rounded-2xl ${
                                                    allowed ? 'cursor-pointer hover:bg-white/5 hover:border-primary/40' : 'cursor-not-allowed'
                                                }`}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center font-black text-primary text-lg">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-xl font-bold transition-colors ${allowed ? 'group-hover:text-primary' : 'text-text-secondary'}`}>{lecture.title}</h4>
                                                        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{lecture.duration || '05:00'} • {lecture.freePreview ? 'FREE PREVIEW' : 'SECURE'}</span>
                                                    </div>
                                                </div>
                                                {allowed ? (
                                                    <div className="btn btn-primary p-3 rounded-full shadow-glow">
                                                        <Play size={20} fill="currentColor" />
                                                    </div>
                                                ) : (
                                                    <div className="bg-white/5 p-3 rounded-full text-text-secondary">
                                                        <Lock size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-up">
                                {!isEnrolled ? (
                                    <div className="glass-card p-16 text-center border-bright relative overflow-hidden flex flex-col items-center gap-6 rounded-3xl">
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-main to-transparent opacity-95 z-0"></div>
                                        <div className="absolute inset-0 bg-primary/5 backdrop-blur-[6px] z-0"></div>
                                        
                                        <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-2 shadow-glow">
                                            <Lock className="text-primary animate-pulse" size={36} />
                                        </div>
                                        
                                        <h3 className="relative z-10 text-3xl font-black text-white">Unlock Premium Practice Materials</h3>
                                        <p className="relative z-10 text-text-secondary text-lg max-w-lg font-medium leading-relaxed">
                                            Become an enrolled student to unlock detailed element cheat sheets, structured coding exercises, and downloadable reference materials.
                                        </p>
                                        
                                        <button 
                                            onClick={() => {
                                                const secureCard = document.getElementById('enroll-sidebar-card');
                                                if (secureCard) {
                                                    secureCard.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className="relative z-10 btn btn-primary py-4 px-10 text-sm font-black tracking-widest shadow-glow"
                                        >
                                            INITIALIZE ACCESS TO UNLOCK
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-8">
                                        {course.practiceNotes && course.practiceNotes.length > 0 ? (
                                            course.practiceNotes.map((note, idx) => (
                                                <div key={note._id || idx} className="glass-card p-8 border-bright flex flex-col gap-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-glow">
                                                                <FileText size={24} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-2xl font-black text-white">{note.title}</h3>
                                                                <p className="text-sm font-bold text-text-secondary">{note.description || 'Practice guide and cheat sheet'}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDownloadNote(note)}
                                                            className="btn btn-outline py-2 px-5 text-xs font-black tracking-wider flex items-center gap-2 hover:bg-primary/20 hover:text-white"
                                                        >
                                                            <Download size={14} /> DOWNLOAD RESOURCE
                                                        </button>
                                                    </div>

                                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 overflow-x-auto">
                                                        <pre className="text-text-secondary text-sm font-medium leading-relaxed font-mono whitespace-pre-wrap">
                                                            {note.content}
                                                        </pre>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="glass-card p-16 text-center border-dashed border-2 opacity-60">
                                                <BookOpen className="mx-auto mb-6 text-text-secondary opacity-30" size={60} />
                                                <h3 className="text-2xl font-bold mb-2">No Practice Notes Found</h3>
                                                <p className="text-text-secondary font-medium">This course focuses heavily on the video modules. Check back for resources soon!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Enrollment */}
                    <div className="lg:col-span-4">
                        <div id="enroll-sidebar-card" className="glass-card p-10 sticky top-32 flex flex-col gap-8 border-bright shadow-glow">
                            {isEnrolled ? (
                                <div className="flex flex-col gap-6 text-center">
                                    <div className="bg-primary/20 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-glow">
                                        <CheckCircle className="text-primary" size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">ACCESS GRANTED</h3>
                                    <p className="text-text-secondary font-medium italic">"The beautiful thing about learning is that no one can take it away from you."</p>
                                    <Link to="/dashboard" className="btn btn-primary py-5 text-lg font-black tracking-widest no-underline text-white">
                                        CONTINUE LEARNING
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-black text-text-secondary tracking-[0.2em] uppercase">SECURE INVESTMENT</span>
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-5xl font-black text-white tracking-tighter">
                                                ${discountedPrice !== null ? discountedPrice.toFixed(2) : (course.price ? course.price.toFixed(2) : '0.00')}
                                            </span>
                                            {discountedPrice !== null && discountedPrice < course.price && (
                                                <span className="text-2xl text-text-secondary line-through font-bold">${course.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="relative group">
                                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                                            <input 
                                                type="text" 
                                                placeholder="DISCOUNT CIPHER" 
                                                className="w-full glass bg-white/5 py-4 pl-14 pr-24 outline-none border-border-light focus:border-primary transition-all text-sm font-bold tracking-widest"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button 
                                                onClick={handleApplyCoupon}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary py-2 px-6 text-xs font-black shadow-none border-none"
                                            >
                                                APPLY
                                            </button>
                                        </div>
                                        {couponMessage.text && (
                                            <p className={`text-xs font-black tracking-wider text-center ${couponMessage.type === 'success' ? 'text-secondary' : 'text-danger'}`}>
                                                {couponMessage.text}
                                            </p>
                                        )}
                                    </div>

                                    <button 
                                        onClick={handleEnroll} 
                                        className="btn btn-primary w-full py-5 flex items-center justify-center gap-4 text-xl font-black tracking-[0.1em] shadow-glow"
                                        disabled={isPurchasing}
                                    >
                                        {isPurchasing ? <Loader2 className="animate-spin" /> : <><CreditCard size={24} /> INITIALIZE ACCESS</>}
                                    </button>

                                    <div className="flex flex-col gap-4 pt-6 border-t border-border-light">
                                        <div className="flex items-center gap-4 text-sm font-bold text-text-secondary">
                                            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center"><CheckCircle size={14} className="text-secondary" /></div>
                                            30-Day Money Back Guarantee
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-bold text-text-secondary">
                                            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center"><CheckCircle size={14} className="text-secondary" /></div>
                                            Full Certification Included
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Player Modal */}
            {activeVideo && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-card max-w-5xl w-full border-bright overflow-hidden rounded-3xl animate-up">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/2">
                            <div>
                                <span className="text-xs font-black text-primary uppercase tracking-widest">Now playing</span>
                                <h3 className="text-xl font-bold text-white mt-1">{activeVideo.title}</h3>
                            </div>
                            <button 
                                onClick={() => setActiveVideo(null)}
                                className="btn btn-outline p-2.5 rounded-full hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative aspect-video w-full">
                            <iframe
                                src={getEmbedUrl(activeVideo.videoUrl)}
                                title={activeVideo.title}
                                className="absolute inset-0 w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
