import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { CreditCard, ShieldCheck, Tag, Loader2, ArrowLeft, Calendar, User, Key, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MockCheckout = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    
    // Payment and course data from session
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Card state
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    
    // Animation/UI State
    const [isFlipped, setIsFlipped] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data } = await api.get(`/payments/session/${sessionId}`);
                setSessionData(data);
            } catch (err) {
                console.error(err);
                setError('Could not authorize payment session. Return to catalog.');
            } finally {
                setLoading(false);
            }
        };
        if (sessionId) fetchSession();
    }, [sessionId]);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length > 0) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic card validation
        if (cardNumber.replace(/\s+/g, '').length !== 16) {
            return setError('Card number must be 16 digits.');
        }
        if (cardExpiry.length !== 5) {
            return setError('Expiration date must be MM/YY.');
        }
        if (cardCvv.length < 3) {
            return setError('CVV must be 3 or 4 digits.');
        }
        if (!cardName.trim()) {
            return setError('Cardholder name is required.');
        }

        setIsProcessing(true);
        try {
            // Confirm mock payment on backend
            await api.post('/payments/confirm-payment', { sessionId });
            
            // Sync local storage state
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && sessionData) {
                if (!userInfo.enrolledCourses) userInfo.enrolledCourses = [];
                if (!userInfo.enrolledCourses.includes(sessionData.course._id)) {
                    userInfo.enrolledCourses.push(sessionData.course._id);
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                }
            }

            // Redirect to success
            setTimeout(() => {
                navigate(`/success/${sessionId}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction authorization failed.');
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <Loader2 className="animate-spin text-primary" size={64} />
                <span className="text-xl font-bold text-text-secondary animate-pulse">Establishing Secure Payment Channel...</span>
            </div>
        );
    }

    if (error && !sessionData) {
        return (
            <div className="container py-40 text-center flex flex-col items-center gap-6">
                <div className="bg-danger/10 p-6 rounded-full text-danger border border-danger/20 mb-4">
                    <ShieldCheck size={48} />
                </div>
                <h2 className="text-3xl font-black">{error}</h2>
                <Link to="/courses" className="btn btn-primary px-8 py-3 no-underline text-white mt-4">Browse Courses</Link>
            </div>
        );
    }

    const course = sessionData?.course;
    const finalAmount = sessionData?.amount || 0;

    return (
        <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[160px] z-0"></div>
            
            <div className="container mx-auto px-4 relative z-10 animate-up">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Payment Invoice/Breakdown */}
                    <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
                        <div className="glass-card p-8 border-bright flex flex-col gap-6">
                            <h3 className="text-xl font-black text-white pb-4 border-b border-white/5 uppercase tracking-wider">Purchase Overview</h3>
                            
                            {course && (
                                <div className="flex items-center gap-4">
                                    <img src={course.thumbnail} alt={course.title} className="w-20 h-16 object-cover rounded-lg border border-white/10" />
                                    <div>
                                        <h4 className="text-sm font-bold text-white line-clamp-1">{course.title}</h4>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{course.category}</span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-3 pt-4 border-t border-white/5 text-sm font-semibold">
                                <div className="flex justify-between items-center text-text-secondary">
                                    <span>Base Tuition:</span>
                                    <span>${course?.price?.toFixed(2)}</span>
                                </div>
                                {sessionData?.couponUsed && (
                                    <div className="flex justify-between items-center text-secondary">
                                        <span className="flex items-center gap-1.5"><Tag size={14} /> Coupon Applied:</span>
                                        <span>- ${(course.price - finalAmount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-lg font-black text-white pt-3 border-t border-white/5">
                                    <span>Total Payable:</span>
                                    <span className="text-2xl text-gradient-primary">${finalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 border-bright text-xs font-semibold text-text-secondary flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-secondary font-black">
                                <ShieldCheck size={18} /> SECURE MOCK SANDBOX ACTIVE
                            </div>
                            <p className="leading-relaxed">
                                This local sandbox environment operates under safe evaluation constraints. No physical funds are moved, and card details are processed entirely in memory.
                            </p>
                        </div>
                    </div>

                    {/* Credit Card Input Form */}
                    <div className="lg:col-span-7 flex flex-col gap-10 order-1 lg:order-2">
                        {error && (
                            <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-xl text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-10">
                            {/* Visual Card Display */}
                            <div className="w-[380px] h-[220px] relative perspective-1000 select-none">
                                <div className={`w-full h-full rounded-[20px] transition-transform duration-700 transform-style-3d relative cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                                    
                                    {/* Front Side */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1e1e38] to-[#3b3b6e] border border-white/10 rounded-[20px] p-6 flex flex-col justify-between backface-hidden shadow-2xl">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[8px] font-black uppercase text-primary tracking-widest">EduStellar Nexus Card</span>
                                                <div className="w-10 h-8 bg-amber-500/20 rounded-md border border-amber-500/40 relative overflow-hidden flex items-center justify-center">
                                                    <div className="w-6 h-5 border border-amber-500/30 rounded-sm"></div>
                                                </div>
                                            </div>
                                            <CreditCard className="text-white/40" size={32} />
                                        </div>

                                        <div className="text-xl font-mono text-white tracking-[0.15em] py-2">
                                            {cardNumber || '•••• •••• •••• ••••'}
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black uppercase text-text-secondary">Cardholder Name</span>
                                                <span className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1">{cardName || 'YOUR IDENTITY'}</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[7px] font-black uppercase text-text-secondary">Expiry Date</span>
                                                <span className="text-xs font-bold text-white tracking-wider">{cardExpiry || 'MM/YY'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back Side */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0f0f20] to-[#1e1e3b] border border-white/10 rounded-[20px] py-6 flex flex-col justify-between rotate-y-180 backface-hidden shadow-2xl">
                                        <div className="w-full h-10 bg-black mt-2"></div>
                                        
                                        <div className="px-6 flex flex-col gap-4">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-[7px] font-black uppercase text-text-secondary mr-2">CVV Code</span>
                                                <div className="flex items-center w-full bg-white/10 rounded h-8 pr-3 pl-2 justify-end border border-white/5">
                                                    <span className="text-sm font-mono text-white italic tracking-wider">{cardCvv || '•••'}</span>
                                                </div>
                                            </div>
                                            <p className="text-[7px] text-text-secondary leading-relaxed italic">
                                                This card signature establishes authorization protocols for node deployment on the EduStellar LMS network.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card inputs form */}
                            <form onSubmit={handleSubmit} className="glass-card p-10 border-bright w-full flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Cardholder Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Amit Katiyar"
                                            className="w-full glass bg-white/5 py-3 px-12 outline-none border-border-light focus:border-primary text-sm font-bold text-white uppercase"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            onFocus={() => setIsFlipped(false)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Card Number</label>
                                    <div className="relative group">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={16} />
                                        <input
                                            type="text"
                                            placeholder="4111 2222 3333 4444"
                                            className="w-full glass bg-white/5 py-3 px-12 outline-none border-border-light focus:border-primary text-sm font-bold text-white font-mono"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            onFocus={() => setIsFlipped(false)}
                                            maxLength={19}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Expiration Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={16} />
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full glass bg-white/5 py-3 px-12 outline-none border-border-light focus:border-primary text-sm font-bold text-white font-mono"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                                onFocus={() => setIsFlipped(false)}
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">CVV Code</label>
                                        <div className="relative group">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={16} />
                                            <input
                                                type="password"
                                                placeholder="•••"
                                                className="w-full glass bg-white/5 py-3 px-12 outline-none border-border-light focus:border-primary text-sm font-bold text-white font-mono"
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                                onFocus={() => setIsFlipped(true)}
                                                maxLength={4}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary py-4 mt-4 text-sm font-black tracking-widest justify-center shadow-glow"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <><Loader2 className="animate-spin" /> ESTABLISHING LINK...</>
                                    ) : (
                                        <>AUTHORIZE TRANSACTION (${finalAmount.toFixed(2)})</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockCheckout;
