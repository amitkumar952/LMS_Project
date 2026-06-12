import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const syncUser = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && userInfo.token) {
                const { data } = await api.get('/auth/me');
                const updatedUser = { ...userInfo, ...data };
                setUser(updatedUser);
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                return updatedUser;
            }
        } catch (error) {
            console.error("Error syncing user:", error);
            if (error.response?.status === 401) {
                logout();
            }
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                setUser(userInfo); // Quick load from cache first
                await syncUser();  // Re-sync with server
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post('/auth/register', { name, email, password, role });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const updateProfile = async (profileData) => {
        const { data } = await api.put('/auth/profile', profileData);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const updatedUser = { ...userInfo, ...data };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, syncUser, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

