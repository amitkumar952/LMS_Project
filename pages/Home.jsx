import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap, BookOpen, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="pt-24 pb-20 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center text-center px-6">
                <div className="hero-grid"></div>
                
                <div className="container relative z-10 animate-up flex flex-col items-center gap-8">
                    <div className="glass px-6 py-2 rounded-full border-bright flex items-center gap-3 text-sm font-bold tracking-wider text-primary-hover mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        TRUSTED BY 50,000+ STUDENTS WORLDWIDE
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] mb-2">
                        Master Any Skill <br />
                        <span className="text-gradient-primary">Limitless Potential</span>
                    </h1>
                    
                    <p className="text-text-secondary text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
                        Experience the gold standard of online education. Premium courses taught by industry titans, designed to accelerate your career.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                        <Link to="/courses" className="btn btn-primary px-12 py-5 text-xl shadow-2xl">
                            Explore Catalog <ArrowRight size={22} />
                        </Link>
                        <Link to="/register" className="btn btn-outline px-12 py-5 text-xl backdrop-blur-md">
                            Get Started Free
                        </Link>
                    </div>

                    <div className="mt-20 flex flex-wrap justify-center gap-12 grayscale opacity-40">
                        <Globe size={32} />
                        <div className="text-2xl font-bold italic">Google</div>
                        <div className="text-2xl font-bold italic">Microsoft</div>
                        <div className="text-2xl font-bold italic">Amazon</div>
                        <Shield size={32} />
                    </div>
                </div>

                {/* Floating Elements (Decorative) */}
                <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </section>

            {/* Features Section */}
            <section className="container py-24">
                <div className="text-center mb-16">
                    <h2 className="section-title">Why Choose EduStellar?</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto -mt-8">We combine world-class content with advanced interactive tools to ensure you master every skill.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Zap className="text-primary" size={32} />, title: "Hyper-fast Learning", desc: "Our curriculum is optimized for speed and retention. Master skills 3x faster than traditional platforms." },
                        { icon: <Star className="text-secondary" size={32} />, title: "Industry Experts", desc: "Learn directly from practitioners at top Fortune 500 companies who have been in your shoes." },
                        { icon: <Users className="text-accent" size={32} />, title: "Vibrant Community", desc: "Join 50,000+ peers in our discord and build networks that last a lifetime." }
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-card p-10 flex flex-col gap-6 text-left hover:border-primary/40 group">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold">{feature.title}</h3>
                            <p className="text-text-secondary leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonial / Social Proof */}
            <section className="bg-[#050b1a] py-24 relative border-y border-border-light">
                <div className="container flex flex-col items-center gap-10">
                    <div className="flex gap-2 text-primary">
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                        <Star fill="currentColor" size={24} />
                    </div>
                    <blockquote className="text-3xl md:text-4xl font-bold max-w-4xl text-center leading-tight">
                        "The most comprehensive platform I've ever used. Within 3 months of taking the Full-Stack Masterclass, I landed a role at a top-tier tech firm."
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent"></div>
                        <div className="text-left">
                            <div className="font-bold text-xl">Sarah Jenkins</div>
                            <div className="text-text-secondary text-sm">Product Manager @ Meta</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
