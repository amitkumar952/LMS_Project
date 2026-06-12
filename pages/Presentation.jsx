import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, ChevronRight, BookOpen, Layers, Users, Database, 
    CreditCard, Tag, Sparkles, Award, ArrowRight, Server, Play, ShieldAlert 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Presentation = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "EduStellar LMS Ecosystem",
            subtitle: "The Future of Knowledge Dissemination",
            content: (
                <div className="flex flex-col items-center justify-center text-center gap-8 h-full py-10">
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                        className="bg-primary p-6 rounded-3xl shadow-glow mb-2"
                    >
                        <BookOpen size={64} className="text-white" />
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                        Welcome to <span className="text-gradient-primary">EduStellar</span>
                    </h2>
                    <p className="text-text-secondary text-xl max-w-xl font-medium leading-relaxed">
                        A state-of-the-art MERN learning platform engineered for premium aesthetics, secure payment gateways, and granular curriculum control.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <span className="glass px-4 py-2 rounded-full text-xs font-black uppercase text-secondary border-secondary/20">MERN Architecture</span>
                        <span className="glass px-4 py-2 rounded-full text-xs font-black uppercase text-accent border-accent/20">Stripe & Fallbacks</span>
                        <span className="glass px-4 py-2 rounded-full text-xs font-black uppercase text-primary border-primary/20">Vite & Tailwind</span>
                    </div>
                </div>
            )
        },
        {
            title: "Executive Architecture",
            subtitle: "System Stack & Topology",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full py-4">
                    <div className="flex flex-col gap-6 text-left">
                        <h3 className="text-3xl font-black text-white leading-tight">Decentralized Multi-Tier Stack</h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            EduStellar coordinates modern APIs, document-oriented storage, and reactive interfaces to create a responsive, low-latency environment.
                        </p>
                        <div className="flex flex-col gap-3 font-semibold text-sm">
                            <div className="flex items-center gap-3"><Server className="text-primary" size={18} /> Node.js & Express API Gateway</div>
                            <div className="flex items-center gap-3"><Database className="text-secondary" size={18} /> MongoDB Atlas Persistence</div>
                            <div className="flex items-center gap-3"><Layers className="text-accent" size={18} /> Vite React Single-Page Application</div>
                        </div>
                    </div>
                    <div className="glass-card p-8 border-bright bg-white/2 flex flex-col gap-5 text-left font-mono text-xs">
                        <div className="text-primary font-black uppercase text-[10px] tracking-wider mb-2">REST API Endpoint Schema</div>
                        <div className="border-l-2 border-primary pl-3">
                            <span className="text-white font-bold">/api/auth:</span> Registration, JWT session logs, profile edits & user tables.
                        </div>
                        <div className="border-l-2 border-secondary pl-3">
                            <span className="text-white font-bold">/api/courses:</span> Catalog index, syllabus structures, videos & note files.
                        </div>
                        <div className="border-l-2 border-accent pl-3">
                            <span className="text-white font-bold">/api/payments:</span> Checkout routing, Stripe validation & mock bypasses.
                        </div>
                        <div className="border-l-2 border-primary pl-3">
                            <span className="text-white font-bold">/api/coupons:</span> Validate promo codes, manage active counts & usage.
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "1. Users Management System",
            subtitle: "Role-Based Access Control (RBAC)",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 text-left h-full">
                    {[
                        {
                            role: "STUDENTS",
                            desc: "Browse catalog modules, enroll through checkout nodes, review courses, download practice notes, and play lecture videos inline.",
                            color: "var(--primary)",
                            icon: BookOpen
                        },
                        {
                            role: "INSTRUCTORS",
                            desc: "Build comprehensive syllabus entries, modify course assets, manage curriculum lectures, upload notes, and verify enrollment counters.",
                            color: "var(--secondary)",
                            icon: Users
                        },
                        {
                            role: "ADMINISTRATORS",
                            desc: "Full audit rights: modify user permission roles, clean security database, toggle promo codes active state, and maintain directories.",
                            color: "var(--accent)",
                            icon: ShieldAlert
                        }
                    ].map((card, idx) => (
                        <div key={idx} className="glass-card p-8 border-bright flex flex-col justify-between gap-6 hover:border-primary/30 transition-all">
                            <div className="flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center" style={{ color: card.color }}>
                                    <card.icon size={24} />
                                </div>
                                <h4 className="text-lg font-black text-white tracking-wider">{card.role}</h4>
                                <p className="text-xs text-text-secondary font-medium leading-relaxed">{card.desc}</p>
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-text-secondary uppercase">Authorization Node {idx+1}</span>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: "2. Course Management System",
            subtitle: "Granular Curriculum Configuration",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full py-4 text-left">
                    <div className="flex flex-col gap-6">
                        <h3 className="text-3xl font-black text-white leading-tight">Interactive Course Builder</h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            Educators have access to an editor allowing real-time edits to general course metadata, video player modules, and downloadable resource items.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                            <div className="bg-white/3 p-4 rounded-xl border border-white/5">
                                <div className="text-primary font-black mb-1">LECTURES EDITOR</div>
                                Add YouTube/Vimeo embeds and define video preview access.
                            </div>
                            <div className="bg-white/3 p-4 rounded-xl border border-white/5">
                                <div className="text-secondary font-black mb-1">PRACTICE NOTES</div>
                                Insert cheat sheets and guidelines using markdown syntax.
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video border border-white/10 group">
                        <img 
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" 
                            alt="Course Workspace" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="bg-primary p-4 rounded-full shadow-glow">
                                <Play size={24} fill="currentColor" className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "3. Payment Gateway Integration",
            subtitle: "Stripe Checkout & Mock Sandbox Bypasses",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full py-4 text-left">
                    <div className="glass-card p-8 border-bright flex flex-col gap-5 order-2 md:order-1 bg-gradient-to-tr from-bg-main to-white/2">
                        <div className="flex justify-between items-center text-xs font-black text-primary border-b border-white/5 pb-3">
                            <span>TRANSACTION LEDGER</span>
                            <span>MOCK GATEWAY ACTIVE</span>
                        </div>
                        <div className="flex flex-col gap-2 font-mono text-[10px]">
                            <div className="flex justify-between text-text-secondary"><span>Base Course Tuition:</span><span>$149.99</span></div>
                            <div className="flex justify-between text-secondary"><span>Applied Cipher (STELLAR50):</span><span>- $75.00</span></div>
                            <div className="flex justify-between text-white font-bold text-xs border-t border-white/5 pt-2 mt-1">
                                <span>Grand Total Payable:</span>
                                <span>$74.99</span>
                            </div>
                        </div>
                        <div className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-xl p-3 text-center text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                            <CreditCard size={14} /> AUTHORIZE TRANSACTION
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 order-1 md:order-2">
                        <h3 className="text-3xl font-black text-white leading-tight">Hybrid Payment Pipelines</h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            If server-side Stripe credentials are set, the app triggers secure Stripe Checkout. If Stripe credentials are not present, it fails over to our custom built mockup payment gateway screen.
                        </p>
                        <div className="flex items-center gap-3 text-secondary font-bold text-sm">
                            <Award size={18} /> Instantly unlocks course modules and practice resources.
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "4. Coupon Management System",
            subtitle: "Campaign & Promotion Engines",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full py-4 text-left">
                    <div className="flex flex-col gap-6">
                        <h3 className="text-3xl font-black text-white leading-tight">Granular Promotion Controls</h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            EduStellar features a control board to create, toggle, and audit discount coupons to boost enrollment.
                        </p>
                        <div className="flex flex-col gap-3 text-xs font-semibold">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/20 text-primary p-1.5 rounded-lg flex-shrink-0"><Percent size={14} /></div>
                                <div><span className="text-white block font-bold">Reduction Rates:</span> Control exact discount percentage rates applied on checkout.</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-secondary/20 text-secondary p-1.5 rounded-lg flex-shrink-0"><Hash size={14} /></div>
                                <div><span className="text-white block font-bold">Cap Thresholds:</span> Set max limit parameters to close campaigns automatically.</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-accent/20 text-accent p-1.5 rounded-lg flex-shrink-0"><Calendar size={14} /></div>
                                <div><span className="text-white block font-bold">Expiry Date:</span> Enforce hard expiration dates to maintain security.</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-8 border-bright bg-white/2 flex flex-col gap-4 text-xs font-semibold">
                        <div className="text-white font-black border-b border-white/5 pb-2 text-sm">Active Promotion Campaign Registry</div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <div>
                                <span className="text-white font-bold block">STELLAR50</span>
                                <span className="text-[10px] text-text-secondary">Exp: Dec 31, 2026</span>
                            </div>
                            <span className="text-secondary font-black">50% Discount</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <div>
                                <span className="text-white font-bold block">WELCOME20</span>
                                <span className="text-[10px] text-text-secondary">Exp: Dec 31, 2026</span>
                            </div>
                            <span className="text-secondary font-black">20% Discount</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "MERN LMS Roadmap",
            subtitle: "Scale-out & Production Deployment",
            content: (
                <div className="flex flex-col items-center justify-center text-center gap-10 h-full py-6">
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Deploying EduStellar to Production</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl w-full text-left">
                        {[
                            { step: "01", title: "Atlas Configuration", desc: "Provision a production Mongo database cluster and restrict IP access control rules." },
                            { step: "02", title: "API Gateway", desc: "Deploy Node/Express server on Render/Heroku and configure environment variables." },
                            { step: "03", title: "Vite App Bundles", desc: "Compile the React files using Vite, optimize images, and host on Vercel/Netlify." },
                            { step: "04", title: "Stripe Key Swap", desc: "Swap client-server Stripe API keys to live settings to process credit cards." }
                        ].map((node, idx) => (
                            <div key={idx} className="glass-card p-6 border-bright flex flex-col gap-3">
                                <span className="text-xs font-black text-primary tracking-widest">PHASE {node.step}</span>
                                <h4 className="text-sm font-black text-white">{node.title}</h4>
                                <p className="text-[10px] text-text-secondary font-medium leading-relaxed">{node.desc}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/courses" className="btn btn-primary px-10 py-4 text-sm font-black tracking-widest shadow-glow no-underline text-white mt-4">
                        ACCESS THE PLATFORM <ArrowRight size={16} />
                    </Link>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <div className="pt-32 pb-20 relative overflow-hidden min-h-screen flex items-center justify-center">
            {/* Background grid */}
            <div className="hero-grid"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col gap-6">
                    
                    {/* Slides frame */}
                    <div className="glass-card p-12 border-bright md:h-[550px] flex flex-col justify-between relative overflow-hidden shadow-2xl rounded-[32px]">
                        
                        <header className="flex justify-between items-start pb-6 border-b border-white/5 relative z-10 flex-shrink-0">
                            <div>
                                <h1 className="text-3xl font-black text-white leading-none tracking-tight">{slides[currentSlide].title}</h1>
                                <span className="text-xs font-bold text-text-secondary mt-1 block tracking-wider">{slides[currentSlide].subtitle}</span>
                            </div>
                            <span className="glass px-3 py-1 rounded-full text-xs font-black tracking-widest text-primary border-primary/20">
                                {currentSlide + 1} / {slides.length}
                            </span>
                        </header>

                        {/* Slide content container */}
                        <div className="flex-grow flex items-center justify-center relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full"
                                >
                                    {slides[currentSlide].content}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center px-4">
                        <button 
                            onClick={handlePrev} 
                            className="btn btn-outline py-3 px-6 text-sm font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={currentSlide === 0}
                        >
                            <ChevronLeft size={16} /> PREVIOUS SLIDE
                        </button>
                        
                        {/* Interactive dots */}
                        <div className="flex gap-2.5">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border-none cursor-pointer ${
                                        currentSlide === idx ? 'bg-primary w-6' : 'bg-white/20'
                                    }`}
                                ></button>
                            ))}
                        </div>

                        {currentSlide === slides.length - 1 ? (
                            <Link to="/courses" className="btn btn-primary py-3 px-8 text-sm font-black tracking-widest no-underline text-white shadow-glow">
                                INITIALIZE APPLICATION
                            </Link>
                        ) : (
                            <button 
                                onClick={handleNext} 
                                className="btn btn-primary py-3 px-6 text-sm font-bold flex items-center gap-2 shadow-glow"
                            >
                                NEXT SLIDE <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Presentation;
