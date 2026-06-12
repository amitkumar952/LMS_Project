import { useState } from 'react';
import { Mail, Calendar, MapPin, Award, Star, ArrowUpRight, CheckCircle } from 'lucide-react';

const Mentors = () => {
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('10:00 AM');

    const mentors = [
        {
            id: 1,
            name: "Alex Rivera",
            role: "Senior Staff Engineer",
            company: "Google",
            category: "Web Development",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            bio: "Former Tech Lead for Chrome Developer Tools. Passionate about frontend architecture, React performance optimization, and building accessible web ecosystems at Google-scale.",
            rating: 4.9,
            reviews: 142,
            skills: ["React / Next.js", "System Architecture", "Performance", "Web Standards"]
        },
        {
            id: 2,
            name: "Dr. Evelyn Carter",
            role: "AI Research Director",
            company: "OpenAI",
            category: "AI & Machine Learning",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
            bio: "Leading research on next-generation LLM alignment strategies. Evelyn helps developers bridge the gap between abstract neural networks and robust, deployable API products.",
            rating: 5.0,
            reviews: 98,
            skills: ["Deep Learning", "LLM Alignment", "Python / PyTorch", "AI Safety"]
        },
        {
            id: 3,
            name: "Sarah Jenkins",
            role: "Principal Product Manager",
            company: "Meta",
            category: "Business & Product",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            bio: "Sarah manages scale monetization frameworks at Meta. With 12+ years leading cross-functional design and growth sprints, she coaches upcoming product leaders and modern founders.",
            rating: 4.9,
            reviews: 215,
            skills: ["Product Strategy", "Growth Loops", "A/B Testing", "Startup Scaling"]
        },
        {
            id: 4,
            name: "Marcus Chen",
            role: "Chief Information Security Officer",
            company: "CyberGuard",
            category: "Cybersecurity",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
            bio: "Defending cloud architectures from advanced persistent threats. Marcus teaches penetration testing and defensive engineering, bringing hands-on red team experience to students.",
            rating: 4.8,
            reviews: 84,
            skills: ["Ethical Hacking", "Network Security", "Cloud Penetration", "Threat Hunting"]
        },
        {
            id: 5,
            name: "Sophia Martinez",
            role: "DevOps Lead",
            company: "Netflix",
            category: "Cloud & DevOps",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
            bio: "Architecting cloud failover configurations for Netflix's massive streaming network. Sophia is an expert in Docker, Kubernetes, and fully automated continuous delivery pipelines.",
            rating: 4.9,
            reviews: 110,
            skills: ["AWS / Cloud Architecture", "Kubernetes / Docker", "CI/CD Pipelines", "Chaos Engineering"]
        }
    ];

    const handleBookSession = (mentor) => {
        setSelectedMentor(mentor);
        setBookingSuccess(false);
    };

    const confirmBooking = () => {
        const session = {
            id: 'sess_' + Math.random().toString(36).substring(2, 9),
            mentorId: selectedMentor.id,
            mentorName: selectedMentor.name,
            mentorAvatar: selectedMentor.avatar,
            mentorRole: selectedMentor.role,
            company: selectedMentor.company,
            date: bookingDate || new Date().toISOString().split('T')[0],
            time: bookingTime,
            meetUrl: 'https://meet.google.com/qws-trsd-uio'
        };

        const localSessions = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
        localSessions.push(session);
        localStorage.setItem('bookedSessions', JSON.stringify(localSessions));

        setBookingSuccess(true);
        setTimeout(() => {
            setSelectedMentor(null);
            setBookingSuccess(false);
            setBookingDate('');
            setBookingTime('10:00 AM');
        }, 2500);
    };

    return (
        <div className="pt-32 pb-24 min-h-screen overflow-hidden relative">
            {/* Background Lights */}
            <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container animate-up relative z-10">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-6">
                    <div className="glass px-6 py-2 rounded-full border-bright inline-flex items-center justify-center gap-3 text-sm font-bold tracking-wider text-primary-hover w-fit mx-auto">
                        <Award size={18} />
                        WORLD-CLASS FACULTY
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
                        Learn from <span className="text-gradient-primary">Industry Legends</span>
                    </h1>
                    
                    <p className="text-text-secondary text-xl font-medium leading-relaxed">
                        Skip the abstract textbooks. Gain direct insights and professional mentorship from top engineering, product, and AI directors shaping the future of tech.
                    </p>
                </div>

                {/* Mentors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {mentors.map((mentor, idx) => (
                        <div 
                            key={mentor.id} 
                            className="glass-card flex flex-col h-full overflow-hidden hover:border-primary/45 group" 
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            {/* Profile Image Area */}
                            <div className="relative pt-8 px-8 flex justify-center">
                                <div className="relative">
                                    {/* Rotating Aura Border */}
                                    <div className="absolute inset-[-4px] bg-gradient-to-tr from-primary via-secondary to-accent rounded-full blur-sm opacity-60 group-hover:rotate-180 transition-all duration-[1200ms]"></div>
                                    <img 
                                        src={mentor.avatar} 
                                        alt={mentor.name} 
                                        className="w-28 h-28 rounded-full object-cover relative z-10 border-2 border-bg-main"
                                    />
                                    {/* Company floating tag */}
                                    <span className="absolute bottom-0 right-0 z-20 bg-primary/95 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1 rounded-full border border-bright shadow-lg uppercase tracking-wider">
                                        {mentor.company}
                                    </span>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-8 flex flex-col flex-grow text-center gap-5 justify-between">
                                <div className="flex flex-col gap-3">
                                    <span className="text-xs font-black tracking-widest text-primary-hover uppercase">
                                        {mentor.category}
                                    </span>
                                    <h3 className="text-2xl font-black group-hover:text-primary transition-colors">
                                        {mentor.name}
                                    </h3>
                                    <p className="text-text-secondary text-sm font-semibold -mt-2">
                                        {mentor.role}
                                    </p>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center justify-center gap-1.5 text-secondary font-bold text-sm">
                                        <Star size={16} fill="currentColor" />
                                        <span>{mentor.rating}</span>
                                        <span className="text-text-secondary font-medium text-xs">({mentor.reviews} reviews)</span>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-text-secondary text-base leading-relaxed font-medium mt-2 line-clamp-3 text-left">
                                        {mentor.bio}
                                    </p>
                                </div>

                                {/* Skills / Core Topics */}
                                <div className="flex flex-wrap justify-center gap-2 my-2">
                                    {mentor.skills.map((skill, sIdx) => (
                                        <span key={sIdx} className="bg-white/5 border border-border-light text-text-secondary font-semibold text-xs px-3 py-1 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-6 border-t border-border-light flex items-center justify-between">
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-bold text-text-secondary mb-1">AVAILABILITY</span>
                                        <span className="text-sm font-black text-white">2 slots this week</span>
                                    </div>
                                    <button 
                                        onClick={() => handleBookSession(mentor)} 
                                        className="btn btn-primary py-3 px-5 rounded-xl text-sm font-bold shadow-glow"
                                    >
                                        Book 1:1 <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Modal */}
            {selectedMentor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
                    <div className="glass max-w-md w-full rounded-[32px] p-8 border-bright shadow-2xl relative animate-up">
                        {!bookingSuccess ? (
                            <div className="flex flex-col gap-6 text-center">
                                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-primary">
                                    <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-2xl font-black">Schedule 1:1 Mentorship</h3>
                                    <p className="text-text-secondary text-sm font-semibold">with {selectedMentor.name} ({selectedMentor.company})</p>
                                </div>
                                <div className="flex flex-col gap-3 text-left bg-white/5 p-4 rounded-2xl border border-border-light">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="text-primary" size={20} />
                                        <span className="text-sm font-bold">Duration: 45 Minutes Session</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-secondary" size={20} />
                                        <span className="text-sm font-bold">Location: Google Meet / Stellar Space</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 text-left">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Select Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full glass bg-white/5 py-2 px-3 text-xs font-bold text-white cursor-pointer"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Select Time Slot</label>
                                        <select 
                                            className="w-full glass bg-white/5 py-2 px-3 text-xs font-bold text-white cursor-pointer"
                                            value={bookingTime}
                                            onChange={(e) => setBookingTime(e.target.value)}
                                        >
                                            <option value="10:00 AM" className="bg-bg-main">10:00 AM - 10:45 AM</option>
                                            <option value="11:30 AM" className="bg-bg-main">11:30 AM - 12:15 PM</option>
                                            <option value="02:00 PM" className="bg-bg-main">02:00 PM - 02:45 PM</option>
                                            <option value="04:30 PM" className="bg-bg-main">04:30 PM - 05:15 PM</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-2">
                                    <button 
                                        onClick={() => setSelectedMentor(null)} 
                                        className="btn btn-outline flex-1 py-4 justify-center text-sm font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmBooking} 
                                        className="btn btn-primary flex-1 py-4 justify-center text-sm font-bold shadow-glow"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 text-center py-6 justify-center items-center">
                                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary border border-secondary shadow-glow animate-pulse">
                                    <CheckCircle size={32} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-2xl font-black text-secondary">Session Scheduled!</h3>
                                    <p className="text-text-secondary text-sm font-bold">Check your email for the Google Meet calendar invite.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentors;
