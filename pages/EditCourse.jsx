import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { 
    BookOpen, DollarSign, Image, Hash, Clock, Plus, Loader2, ArrowLeft, 
    Trash2, Edit3, Save, X, Video, FileText, CheckCircle2, AlertCircle 
} from 'lucide-react';

const EditCourse = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Core course state
    const [course, setCourse] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('Web Development');
    const [duration, setDuration] = useState('10 Hours');
    const [thumbnail, setThumbnail] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    
    // UI states
    const [loading, setLoading] = useState(true);
    const [submittingCourse, setSubmittingCourse] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Lecture states
    const [newLecture, setNewLecture] = useState({ title: '', videoUrl: '', duration: '', freePreview: false });
    const [editingLectureId, setEditingLectureId] = useState(null);
    const [editingLecture, setEditingLecture] = useState({ title: '', videoUrl: '', duration: '', freePreview: false });
    
    // Practice Notes states
    const [newNote, setNewNote] = useState({ title: '', description: '', content: '', downloadUrl: '' });
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNote, setEditingNote] = useState({ title: '', description: '', content: '', downloadUrl: '' });

    const fetchCourse = async () => {
        try {
            const { data } = await api.get(`/courses/${id}`);
            setCourse(data);
            setTitle(data.title);
            setDescription(data.description);
            setPrice(data.price);
            setCategory(data.category);
            setDuration(data.duration);
            setThumbnail(data.thumbnail);
            setTagsInput(data.tags?.join(', ') || '');
        } catch (error) {
            setMessage({ text: 'Failed to load course details.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCourse();
        }
    }, [id]);

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setSubmittingCourse(true);
        setMessage({ text: '', type: '' });
        
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        try {
            const { data } = await api.put(`/courses/${id}`, {
                title,
                description,
                price: Number(price),
                category,
                duration,
                thumbnail,
                tags
            });
            setCourse(data);
            setMessage({ text: 'Course metadata updated successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update course.', type: 'error' });
        } finally {
            setSubmittingCourse(false);
        }
    };

    const handleDeleteCourse = async () => {
        if (!window.confirm("Are you absolutely sure you want to destroy this entire course? This action is irreversible!")) return;
        
        setSubmittingCourse(true);
        try {
            await api.delete(`/courses/${id}`);
            navigate('/dashboard');
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to remove course.', type: 'error' });
            setSubmittingCourse(false);
        }
    };

    // Lectures Handlers
    const handleAddLecture = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            const { data } = await api.post(`/courses/${id}/lectures`, newLecture);
            setCourse(data);
            setNewLecture({ title: '', videoUrl: '', duration: '', freePreview: false });
            setMessage({ text: 'Lecture module added successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to add lecture.', type: 'error' });
        }
    };

    const handleStartEditLecture = (lecture) => {
        setEditingLectureId(lecture._id);
        setEditingLecture({
            title: lecture.title,
            videoUrl: lecture.videoUrl,
            duration: lecture.duration || '',
            freePreview: lecture.freePreview || false
        });
    };

    const handleSaveLecture = async (lectureId) => {
        setMessage({ text: '', type: '' });
        try {
            const { data } = await api.put(`/courses/${id}/lectures/${lectureId}`, editingLecture);
            setCourse(data);
            setEditingLectureId(null);
            setMessage({ text: 'Lecture module updated!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update lecture.', type: 'error' });
        }
    };

    const handleDeleteLecture = async (lectureId) => {
        if (!window.confirm("Delete this lecture module?")) return;
        setMessage({ text: '', type: '' });
        try {
            const { data } = await api.delete(`/courses/${id}/lectures/${lectureId}`);
            setCourse(data);
            setMessage({ text: 'Lecture module removed.', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to remove lecture.', type: 'error' });
        }
    };

    // Practice Notes Handlers
    const handleAddNote = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            const { data } = await api.post(`/courses/${id}/practice-notes`, newNote);
            setCourse(data);
            setNewNote({ title: '', description: '', content: '', downloadUrl: '' });
            setMessage({ text: 'Practice note element added!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to add practice note.', type: 'error' });
        }
    };

    const handleStartEditNote = (note) => {
        setEditingNoteId(note._id);
        setEditingNote({
            title: note.title,
            description: note.description || '',
            content: note.content || '',
            downloadUrl: note.downloadUrl || ''
        });
    };

    const handleSaveNote = async (noteId) => {
        setMessage({ text: '', type: '' });
        try {
            const { data } = await api.put(`/courses/${id}/practice-notes/${noteId}`, editingNote);
            setCourse(data);
            setEditingNoteId(null);
            setMessage({ text: 'Practice note updated!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update note.', type: 'error' });
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm("Remove this practice note element?")) return;
        setMessage({ text: '', type: '' });
        try {
            const { data } = await api.delete(`/courses/${id}/practice-notes/${noteId}`);
            setCourse(data);
            setMessage({ text: 'Practice note removed.', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to remove practice note.', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <Loader2 className="animate-spin text-primary" size={64} />
                <span className="text-xl font-bold text-text-secondary animate-pulse">Syncing course environment...</span>
            </div>
        );
    }

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
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[180px] z-0"></div>

            <div className="container mx-auto px-4 relative z-10 animate-up">
                <div className="flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                        <Link to="/dashboard" className="flex items-center gap-3 text-text-secondary hover:text-white no-underline font-bold transition-all group w-fit">
                            <div className="p-2 glass rounded-lg group-hover:-translate-x-1 transition-transform">
                                <ArrowLeft size={16} />
                            </div>
                            RETURN TO DASHBOARD
                        </Link>
                        <button 
                            onClick={handleDeleteCourse} 
                            className="btn bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger font-bold text-sm py-2 px-5 rounded-xl flex items-center gap-2"
                        >
                            <Trash2 size={16} /> DESTROY COURSE
                        </button>
                    </div>

                    <header>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">COURSE WORKSPACE</span>
                        <h1 className="text-4xl md:text-5xl font-black text-white mt-1">Curriculum Architect: {course?.title}</h1>
                    </header>

                    {message.text && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 font-semibold ${
                            message.type === 'success' 
                                ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                                : 'bg-danger/10 border-danger/30 text-danger'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Course metadata edit */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                            <div className="glass-card p-8 border-bright">
                                <h3 className="text-2xl font-bold mb-6">Modify Course Details</h3>
                                <form onSubmit={handleUpdateCourse} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full glass bg-white/5 py-3 px-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Price (USD)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="w-full glass bg-white/5 py-3 px-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Category</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full glass bg-white/5 py-3 px-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white cursor-pointer"
                                                required
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat} className="bg-bg-main text-white">{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Duration</label>
                                            <input
                                                type="text"
                                                className="w-full glass bg-white/5 py-3 px-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Tags</label>
                                            <input
                                                type="text"
                                                className="w-full glass bg-white/5 py-3 px-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white"
                                                value={tagsInput}
                                                onChange={(e) => setTagsInput(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Thumbnail Cover URL</label>
                                        <input
                                            type="url"
                                            className="w-full glass bg-white/5 py-3 px-4 outline-none border-border-light focus:border-primary text-sm font-bold text-white"
                                            value={thumbnail}
                                            onChange={(e) => setThumbnail(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            className="w-full glass bg-white/5 py-3 px-4 outline-none border-border-light focus:border-primary text-sm font-medium text-white h-32 resize-y"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary py-4 text-sm font-black tracking-widest justify-center mt-2 shadow-glow"
                                        disabled={submittingCourse}
                                    >
                                        {submittingCourse ? <Loader2 className="animate-spin" /> : 'SAVE METADATA'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Curriculum / Lectures & notes */}
                        <div className="lg:col-span-7 flex flex-col gap-10">
                            {/* Lectures Setup */}
                            <div className="glass-card p-8 border-bright">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Video size={20} className="text-primary" /> Curriculum Modules (Lectures)</h3>
                                
                                {/* Current lectures list */}
                                <div className="flex flex-col gap-3 mb-8">
                                    {course.lectures?.map((lecture, idx) => (
                                        <div key={lecture._id} className="glass p-4 rounded-xl border-bright flex items-center justify-between gap-4">
                                            {editingLectureId === lecture._id ? (
                                                <div className="flex flex-col gap-3 w-full">
                                                    <input 
                                                        type="text" 
                                                        className="w-full glass bg-white/5 py-2 px-3 text-xs font-semibold"
                                                        value={editingLecture.title} 
                                                        onChange={(e) => setEditingLecture({ ...editingLecture, title: e.target.value })}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        className="w-full glass bg-white/5 py-2 px-3 text-xs"
                                                        value={editingLecture.videoUrl} 
                                                        onChange={(e) => setEditingLecture({ ...editingLecture, videoUrl: e.target.value })}
                                                    />
                                                    <div className="flex items-center justify-between gap-4">
                                                        <input 
                                                            type="text" 
                                                            className="w-24 glass bg-white/5 py-2 px-3 text-xs"
                                                            value={editingLecture.duration} 
                                                            onChange={(e) => setEditingLecture({ ...editingLecture, duration: e.target.value })}
                                                            placeholder="05:00"
                                                        />
                                                        <label className="text-xs font-bold text-text-secondary flex items-center gap-2 cursor-pointer">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={editingLecture.freePreview} 
                                                                onChange={(e) => setEditingLecture({ ...editingLecture, freePreview: e.target.checked })}
                                                            />
                                                            Free Preview
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleSaveLecture(lecture._id)} className="btn btn-primary p-2 rounded-lg"><Save size={14} /></button>
                                                            <button onClick={() => setEditingLectureId(null)} className="btn btn-outline p-2 rounded-lg"><X size={14} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white">{idx + 1}. {lecture.title}</h4>
                                                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                                                            {lecture.duration || '05:00'} • {lecture.freePreview ? 'FREE PREVIEW' : 'SECURE'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleStartEditLecture(lecture)} className="text-text-secondary hover:text-white bg-transparent border-none cursor-pointer p-1.5"><Edit3 size={14} /></button>
                                                        <button onClick={() => handleDeleteLecture(lecture._id)} className="text-text-secondary hover:text-danger bg-transparent border-none cursor-pointer p-1.5"><Trash2 size={14} /></button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    {(!course.lectures || course.lectures.length === 0) && (
                                        <div className="text-center py-6 text-text-secondary text-xs font-bold">No modules registered yet.</div>
                                    )}
                                </div>

                                {/* Add lecture form */}
                                <form onSubmit={handleAddLecture} className="glass p-5 rounded-2xl border-dashed border-2 flex flex-col gap-4">
                                    <h4 className="text-sm font-black text-primary uppercase tracking-wider">Deploy New Module</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Lecture Title" 
                                            className="w-full glass bg-white/5 py-2.5 px-4 text-xs font-semibold"
                                            value={newLecture.title}
                                            onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                                            required
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Video Embed URL (YouTube/Vimeo)" 
                                            className="w-full glass bg-white/5 py-2.5 px-4 text-xs"
                                            value={newLecture.videoUrl}
                                            onChange={(e) => setNewLecture({ ...newLecture, videoUrl: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Duration (e.g. 15:00)" 
                                            className="w-32 glass bg-white/5 py-2.5 px-4 text-xs"
                                            value={newLecture.duration}
                                            onChange={(e) => setNewLecture({ ...newLecture, duration: e.target.value })}
                                        />
                                        <label className="text-xs font-bold text-text-secondary flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={newLecture.freePreview}
                                                onChange={(e) => setNewLecture({ ...newLecture, freePreview: e.target.checked })}
                                            />
                                            Exempt from Purchase (Free Preview)
                                        </label>
                                        <button type="submit" className="btn btn-primary py-2 px-6 text-xs font-black tracking-wider shadow-glow">ADD MODULE</button>
                                    </div>
                                </form>
                            </div>

                            {/* Practice Notes Setup */}
                            <div className="glass-card p-8 border-bright animate-up">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><FileText size={20} className="text-primary" /> Practice Notes & Exercises</h3>
                                
                                {/* Current practice notes */}
                                <div className="flex flex-col gap-3 mb-8">
                                    {course.practiceNotes?.map((note) => (
                                        <div key={note._id} className="glass p-4 rounded-xl border-bright flex flex-col gap-3">
                                            {editingNoteId === note._id ? (
                                                <div className="flex flex-col gap-3 w-full">
                                                    <input 
                                                        type="text" 
                                                        className="w-full glass bg-white/5 py-2 px-3 text-xs font-semibold"
                                                        value={editingNote.title} 
                                                        onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        className="w-full glass bg-white/5 py-2 px-3 text-xs"
                                                        value={editingNote.description} 
                                                        onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
                                                        placeholder="Description"
                                                    />
                                                    <textarea 
                                                        className="w-full glass bg-white/5 py-2 px-3 text-xs h-24"
                                                        value={editingNote.content} 
                                                        onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                                        placeholder="Markdowns/Contents"
                                                    />
                                                    <input 
                                                        type="text" 
                                                        className="w-full glass bg-white/5 py-2 px-3 text-xs"
                                                        value={editingNote.downloadUrl} 
                                                        onChange={(e) => setEditingNote({ ...editingNote, downloadUrl: e.target.value })}
                                                        placeholder="Download link URL"
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleSaveNote(note._id)} className="btn btn-primary p-2 rounded-lg"><Save size={14} /></button>
                                                        <button onClick={() => setEditingNoteId(null)} className="btn btn-outline p-2 rounded-lg"><X size={14} /></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white">{note.title}</h4>
                                                        <p className="text-xs text-text-secondary line-clamp-1">{note.description}</p>
                                                    </div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <button onClick={() => handleStartEditNote(note)} className="text-text-secondary hover:text-white bg-transparent border-none cursor-pointer p-1.5"><Edit3 size={14} /></button>
                                                        <button onClick={() => handleDeleteNote(note._id)} className="text-text-secondary hover:text-danger bg-transparent border-none cursor-pointer p-1.5"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(!course.practiceNotes || course.practiceNotes.length === 0) && (
                                        <div className="text-center py-6 text-text-secondary text-xs font-bold">No practice assets stored.</div>
                                    )}
                                </div>

                                {/* Add note form */}
                                <form onSubmit={handleAddNote} className="glass p-5 rounded-2xl border-dashed border-2 flex flex-col gap-3">
                                    <h4 className="text-sm font-black text-primary uppercase tracking-wider">Deploy New Practice Note</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Title" 
                                        className="w-full glass bg-white/5 py-2.5 px-4 text-xs font-semibold"
                                        value={newNote.title}
                                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                        required
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Short Description / Objectives" 
                                        className="w-full glass bg-white/5 py-2.5 px-4 text-xs"
                                        value={newNote.description}
                                        onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                                    />
                                    <textarea 
                                        placeholder="Code exercises content, instructions, or cheatsheet details (Markdown text allowed)" 
                                        className="w-full glass bg-white/5 py-2.5 px-4 text-xs h-24 font-mono resize-y"
                                        value={newNote.content}
                                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                    />
                                    <div className="flex items-center justify-between gap-4">
                                        <input 
                                            type="url" 
                                            placeholder="Resource download URL link (optional)" 
                                            className="w-full glass bg-white/5 py-2.5 px-4 text-xs"
                                            value={newNote.downloadUrl}
                                            onChange={(e) => setNewNote({ ...newNote, downloadUrl: e.target.value })}
                                        />
                                        <button type="submit" className="btn btn-primary py-2 px-6 text-xs font-black tracking-wider flex-shrink-0 shadow-glow">DEPLOY ASSET</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
