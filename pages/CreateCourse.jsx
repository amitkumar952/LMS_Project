import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { BookOpen, DollarSign, Image, Hash, Clock, Plus, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateCourse = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('Web Development');
    const [duration, setDuration] = useState('10 Hours');
    const [thumbnail, setThumbnail] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        try {
            const { data } = await api.post('/courses', {
                title,
                description,
                price: Number(price),
                category,
                duration,
                thumbnail: thumbnail || undefined,
                tags
            });
            // Successfully created! Redirect to edit page to build lectures/practice notes
            navigate(`/edit-course/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to construct course blueprint. Check parameters.');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'instructor' && user?.role !== 'admin') {
        return (
            <div className="container py-40 text-center font-bold text-2xl text-danger">
                ACCESS VIOLATION: Requires Instructor or Administrator authorization privileges.
            </div>
        );
    }

    const categories = [
        'Web Development', 'Data Science', 'AI & Machine Learning', 
        'Mobile Development', 'Cybersecurity', 'Cloud & DevOps', 
        'Business', 'Design', 'Marketing', 'Other'
    ];

    return (
        <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
            {/* Background auroras */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] z-0"></div>
            
            <div className="container mx-auto px-4 relative z-10 animate-up">
                <div className="max-w-3xl mx-auto flex flex-col gap-10">
                    <Link to="/dashboard" className="flex items-center gap-3 text-text-secondary hover:text-white no-underline font-bold transition-all group w-fit">
                        <div className="p-2 glass rounded-lg group-hover:-translate-x-1 transition-transform">
                            <ArrowLeft size={16} />
                        </div>
                        RETURN TO DASHBOARD
                    </Link>

                    <header>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Draft Curriculum Blueprint</h1>
                        <p className="text-text-secondary text-lg font-medium mt-2">Initialize a new course catalog entry. You will configure lectures and practice files next.</p>
                    </header>

                    {error && (
                        <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-xl text-sm font-bold text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="glass-card p-10 border-bright flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Course Title</label>
                            <div className="relative group">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={18} />
                                <input
                                    type="text"
                                    placeholder="e.g. Mastering Advanced Cryptography"
                                    className="w-full glass bg-white/5 py-4 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-base font-bold text-white"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Tuition Investment (USD)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={18} />
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="49.99"
                                        className="w-full glass bg-white/5 py-4 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-base font-bold text-white"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Syllabus Field (Category)</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full glass bg-white/5 py-4 px-4 outline-none border-border-light focus:border-primary transition-all text-base font-bold text-white cursor-pointer"
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-bg-main text-white font-medium">{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Estimated Course Duration</label>
                                <div className="relative group">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. 14.5 Hours"
                                        className="w-full glass bg-white/5 py-4 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-base font-bold text-white"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Tags (Comma Separated)</label>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={18} />
                                    <input
                                        type="text"
                                        placeholder="React, CSS, Frontend"
                                        className="w-full glass bg-white/5 py-4 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-base font-bold text-white"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Thumbnail Cover URL</label>
                            <div className="relative group">
                                <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary" size={18} />
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/... (optional)"
                                    className="w-full glass bg-white/5 py-4 pl-12 pr-4 outline-none border-border-light focus:border-primary transition-all text-base font-bold text-white"
                                    value={thumbnail}
                                    onChange={(e) => setThumbnail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Executive Summary (Description)</label>
                            <textarea
                                placeholder="Describe the objectives and learning outcomes of the course curriculum."
                                className="w-full glass bg-white/5 py-4 px-4 outline-none border-border-light focus:border-primary transition-all text-base font-medium text-white h-40 resize-y"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary py-5 text-lg justify-center font-black tracking-widest shadow-glow mt-4"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> INITIALIZE COURSE</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
