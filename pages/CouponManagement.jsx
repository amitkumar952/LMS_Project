import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, Calendar, Hash, Percent, RefreshCw } from 'lucide-react';

const CouponManagement = () => {
    const { user } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Form State
    const [code, setCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [usageLimit, setUsageLimit] = useState(100);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/coupons');
            setCoupons(data);
        } catch (error) {
            setMessage({ text: 'Failed to retrieve coupon index from the server.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCoupons();
        }
    }, [user]);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const { data } = await api.post('/coupons', {
                code,
                discountPercentage: Number(discountPercentage),
                expiryDate: new Date(expiryDate),
                usageLimit: Number(usageLimit)
            });
            
            setMessage({ text: `Coupon code ${data.code} generated successfully!`, type: 'success' });
            setCoupons([data, ...coupons]);
            setCode('');
            setDiscountPercentage('');
            setExpiryDate('');
            setUsageLimit(100);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to initialize coupon code.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (couponId) => {
        setActionLoading(couponId);
        setMessage({ text: '', type: '' });
        try {
            const { data } = await api.put(`/coupons/${couponId}/status`);
            setCoupons(coupons.map(c => c._id === couponId ? { ...c, isActive: data.coupon.isActive } : u => u));
            // Let's refetch or update locally
            fetchCoupons();
            setMessage({ text: 'Coupon active status toggled!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to toggle status.', type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        if (!window.confirm("Are you sure you want to delete this discount coupon permanently?")) return;
        
        setActionLoading(couponId);
        setMessage({ text: '', type: '' });
        try {
            await api.delete(`/coupons/${couponId}`);
            setCoupons(coupons.filter(c => c._id !== couponId));
            setMessage({ text: 'Coupon deleted from database.', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to delete coupon.', type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    if (user?.role !== 'admin' && user?.role !== 'instructor') {
        return (
            <div className="container py-40 text-center font-bold text-2xl text-danger">
                ACCESS VIOLATION: Requires Instructor or Administrator authorization privileges.
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
            {/* Background auroras */}
            <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] z-0"></div>
            
            <div className="container mx-auto px-4 relative z-10 animate-up">
                <div className="flex flex-col gap-10">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
                        <div className="flex items-center gap-5">
                            <div className="bg-primary/20 p-4 rounded-2xl text-primary shadow-glow">
                                <Tag size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white">Coupon Control Deck</h1>
                                <p className="text-text-secondary text-sm font-semibold mt-1">
                                    Configure tuition discount tokens, validate usages, and manage campaigns.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={fetchCoupons} 
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
                            <Tag size={16} />
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Creation form */}
                        <div className="lg:col-span-5">
                            <div className="glass-card p-8 border-bright sticky top-32">
                                <h3 className="text-2xl font-bold mb-6">Create Discount Cipher</h3>
                                <form onSubmit={handleCreateCoupon} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Promo Code (Uppercase)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. STELLAR50"
                                            className="w-full glass bg-white/5 py-3 px-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white uppercase tracking-widest"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Discount (%)</label>
                                            <div className="relative group">
                                                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={14} />
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    placeholder="50"
                                                    className="w-full glass bg-white/5 py-3 pl-10 pr-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white"
                                                    value={discountPercentage}
                                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Usage Limit</label>
                                            <div className="relative group">
                                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={14} />
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="100"
                                                    className="w-full glass bg-white/5 py-3 pl-10 pr-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white"
                                                    value={usageLimit}
                                                    onChange={(e) => setUsageLimit(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Expiration Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={14} />
                                            <input
                                                type="date"
                                                className="w-full glass bg-white/5 py-3 pl-10 pr-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white cursor-pointer"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary py-4 text-sm font-black tracking-widest justify-center mt-2 shadow-glow"
                                        disabled={submitting}
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : <><Plus size={16} /> GENERATE CIPHER</>}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Coupon index listing */}
                        <div className="lg:col-span-7">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-40 gap-4">
                                    <Loader2 className="animate-spin text-primary" size={48} />
                                    <span className="text-text-secondary font-bold">Querying Discount Ledger...</span>
                                </div>
                            ) : (
                                <div className="glass-card border-bright overflow-hidden">
                                    <div className="overflow-x-auto w-full">
                                        <table className="w-full border-collapse text-left text-sm text-text-secondary">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/5 font-black text-white text-xs uppercase tracking-widest">
                                                    <th className="py-5 px-6">CODE</th>
                                                    <th className="py-5 px-6 text-center">REDUCTION</th>
                                                    <th className="py-5 px-6">USAGE (COUNT/LIMIT)</th>
                                                    <th className="py-5 px-6">EXPIRY</th>
                                                    <th className="py-5 px-6 text-right">OPERATIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {coupons.map(coupon => (
                                                    <tr key={coupon._id} className={`hover:bg-white/2 transition-colors ${!coupon.isActive ? 'opacity-40' : ''}`}>
                                                        <td className="py-5 px-6 font-black text-white tracking-wider">
                                                            {coupon.code}
                                                        </td>
                                                        <td className="py-5 px-6 font-bold text-center text-secondary">
                                                            {coupon.discountPercentage}%
                                                        </td>
                                                        <td className="py-5 px-6 font-medium">
                                                            <div className="flex flex-col gap-1 w-24">
                                                                <div className="flex justify-between text-[10px] font-bold">
                                                                    <span>{coupon.usedCount} used</span>
                                                                    <span>{coupon.usageLimit}</span>
                                                                </div>
                                                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-border-light">
                                                                    <div 
                                                                        className="bg-primary h-full rounded-full" 
                                                                        style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-6 font-medium text-xs">
                                                            {new Date(coupon.expiryDate).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                            {new Date(coupon.expiryDate) < new Date() && (
                                                                <span className="text-danger block text-[9px] font-black uppercase mt-0.5">EXPIRED</span>
                                                            )}
                                                        </td>
                                                        <td className="py-5 px-6 text-right">
                                                            <div className="flex justify-end gap-3">
                                                                <button
                                                                    onClick={() => handleToggleStatus(coupon._id)}
                                                                    className="text-text-secondary hover:text-white bg-transparent border-none cursor-pointer p-1"
                                                                    disabled={actionLoading === coupon._id}
                                                                    title={coupon.isActive ? "Deactivate Promo Code" : "Activate Promo Code"}
                                                                >
                                                                    {coupon.isActive ? <ToggleRight size={22} className="text-secondary" /> : <ToggleLeft size={22} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                                                    className="text-text-secondary hover:text-danger bg-transparent border-none cursor-pointer p-1"
                                                                    disabled={actionLoading === coupon._id}
                                                                    title="Delete Coupon"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {coupons.length === 0 && (
                                        <div className="py-20 text-center font-bold text-text-secondary">
                                            No active ciphers configured.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponManagement;
