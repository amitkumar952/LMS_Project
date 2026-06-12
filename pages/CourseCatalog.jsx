import { useState, useEffect } from 'react';
import api from '../api/api';
import { Search, Filter, BookOpen, User, Star, Loader2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTag, setSelectedTag] = useState('All');

    const categories = ['All', 'Web Development', 'Data Science', 'AI & Machine Learning', 'Mobile Development', 'Cybersecurity', 'Cloud & DevOps', 'Business', 'Design', 'Marketing'];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        
        let matchesTag = true;
        if (selectedCategory === 'Web Development' && selectedTag !== 'All') {
            matchesTag = course.tags && course.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
        }
        
        return matchesSearch && matchesCategory && matchesTag;
    });

    return (
        <div className="pt-32 pb-20">
            <div className="container animate-up">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-primary font-bold mb-4">
                            <TrendingUp size={20} /> TRENDING SKILLS 2026
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Discover Your Next <span className="text-gradient-primary">Big Leap.</span></h1>
                        <p className="text-text-secondary text-xl font-medium">Explore over 1,000+ premium courses curated by industry legends.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative group w-full lg:w-80">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search courses, skills, masters..."
                                className="w-full glass bg-white/5 py-4 pl-14 pr-6 rounded-2xl outline-none border-border-light focus:border-primary/50 transition-all text-lg font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Category Bar */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setSelectedTag('All');
                            }}
                            className={`px-8 py-3 rounded-full border-bright font-bold transition-all text-sm tracking-wide ${selectedCategory === cat ? 'bg-primary text-white shadow-glow border-primary' : 'glass bg-white/5 text-text-secondary hover:text-white hover:bg-white/10'}`}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Web Dev Tech Tag Sub-Filters */}
                {selectedCategory === 'Web Development' && (
                    <div className="flex flex-wrap gap-3 mb-14 pl-6 border-l-4 border-primary/40 animate-down">
                        {['All Web Dev', 'HTML', 'CSS', 'JavaScript', 'React'].map(tag => {
                            const isAll = tag === 'All Web Dev';
                            const isActive = (isAll && selectedTag === 'All') || (!isAll && selectedTag.toLowerCase() === tag.toLowerCase());
                            return (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(isAll ? 'All' : tag)}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all text-xs tracking-wider uppercase border ${
                                        isActive
                                            ? 'bg-primary/20 text-primary-hover border-primary/40 shadow-glow'
                                            : 'glass bg-white/5 text-text-secondary border-white/5 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <Loader2 className="animate-spin text-primary" size={64} />
                        <span className="text-xl font-bold text-text-secondary animate-pulse">Syncing catalog...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course, idx) => (
                                <div key={course._id} className="glass-card group overflow-hidden flex flex-col h-full" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="relative h-60 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-main/80 to-transparent z-10"></div>
                                        <img 
                                            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 z-20 flex gap-2">
                                            <span className="glass px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-primary-hover border-bright shadow-xl">
                                                {course.category}
                                            </span>
                                            {course.tags && course.tags.map(t => (
                                                <span key={t} className="glass bg-accent/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white border-bright shadow-xl">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 flex flex-col flex-grow gap-5">
                                        <h3 className="text-2xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                    {course.instructor?.name?.charAt(0) || 'I'}
                                                </div>
                                                <span className="font-bold text-text-secondary">{course.instructor?.name || 'EduStellar Expert'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                                <Star size={18} fill="currentColor" />
                                                <span>4.9</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs font-bold text-text-secondary">
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen size={14} />
                                                {course.lectures?.length || 0} Modules
                                            </div>
                                            <div>•</div>
                                            <div>{course.duration || '12 Hours'}</div>
                                        </div>

                                        <div className="mt-4 pt-6 border-t border-border-light flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-text-secondary mb-1">ONE-TIME ACCESS</span>
                                                <span className="text-3xl font-extrabold text-white">${course.price}</span>
                                            </div>
                                            <Link to={`/course/${course._id}`} className="btn btn-primary p-4 rounded-2xl">
                                                <ArrowUpRight size={24} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full glass p-24 text-center border-dashed border-2">
                                <BookOpen className="mx-auto mb-6 text-text-secondary opacity-30" size={80} />
                                <h3 className="text-3xl font-bold mb-4">No Courses Match Your Criteria</h3>
                                <p className="text-text-secondary text-xl max-w-md mx-auto">Try a different search or browse our trending categories above.</p>
                                <button onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSelectedTag('All');}} className="btn btn-primary mt-8 px-10">Clear All Filters</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCatalog;
