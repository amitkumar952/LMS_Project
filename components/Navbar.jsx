import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, Menu, Bell, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:px-6">
            <nav className="container glass rounded-[24px] px-6 md:px-8 py-3 flex items-center justify-between border-bright shadow-2xl relative">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
                    <div className="bg-primary p-2 rounded-xl shadow-glow group-hover:rotate-[10deg] transition-transform">
                        <BookOpen className="text-white" size={24} />
                    </div>
                    <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        Edu<span className="text-primary-hover">Stellar</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links">
                    <Link to="/courses" className="text-text-secondary hover:text-white no-underline font-semibold transition-all">All Courses</Link>
                    <Link to="/mentors" className="text-text-secondary hover:text-white no-underline font-semibold transition-all">Mentors</Link>
                    {user && (
                        <Link to="/dashboard" className="text-text-secondary hover:text-white no-underline font-semibold transition-all">Dashboard</Link>
                    )}
                    {user && user.role === 'admin' && (
                        <>
                            <Link to="/admin/users" className="text-text-secondary hover:text-white no-underline font-semibold transition-all">Users</Link>
                            <Link to="/admin/coupons" className="text-text-secondary hover:text-white no-underline font-semibold transition-all">Coupons</Link>
                        </>
                    )}
                    {user && user.role === 'instructor' && (
                        <Link to="/admin/coupons" className="text-text-secondary hover:text-white no-underline font-semibold transition-all">Coupons</Link>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    {user ? (
                        <div className="flex items-center gap-3 md:gap-5 border-l border-border-light pl-4 md:pl-6">
                            <Link to="/profile" className="flex items-center gap-3 bg-bg-glass p-1 pr-3 rounded-full border border-border-light hover:border-primary transition-all text-white no-underline">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-sm">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-sm font-semibold hidden md:block">{user.name.split(' ')[0]}</span>
                            </Link>
                            <button onClick={logout} className="text-text-secondary hover:text-danger transition-colors bg-transparent border-none cursor-pointer">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link to="/login" className="text-text-secondary hover:text-white no-underline font-semibold px-2 md:px-4 text-sm md:text-base">Log in</Link>
                            <Link to="/register" className="btn btn-primary shadow-glow py-2 px-4 text-sm md:text-base">Join</Link>
                        </div>
                    )}
                    
                    {/* Mobile Toggle */}
                    <button 
                        className="lg:hidden text-white bg-transparent border-none cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-[80px] left-0 right-0 glass rounded-[24px] p-6 flex flex-col gap-4 border-bright animate-up lg:hidden">
                        <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="text-white no-underline font-semibold py-2">All Courses</Link>
                        <Link to="/mentors" onClick={() => setIsMenuOpen(false)} className="text-white no-underline font-semibold py-2">Mentors</Link>
                        {user && (
                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-white no-underline font-semibold py-2">Dashboard</Link>
                        )}
                        {user && user.role === 'admin' && (
                            <>
                                <Link to="/admin/users" onClick={() => setIsMenuOpen(false)} className="text-white no-underline font-semibold py-2">Users</Link>
                                <Link to="/admin/coupons" onClick={() => setIsMenuOpen(false)} className="text-white no-underline font-semibold py-2">Coupons</Link>
                            </>
                        )}
                        {user && user.role === 'instructor' && (
                            <Link to="/admin/coupons" onClick={() => setIsMenuOpen(false)} className="text-white no-underline font-semibold py-2">Coupons</Link>
                        )}
                        {user && (
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-white no-underline font-semibold py-2">Profile Settings</Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;

