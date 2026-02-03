import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('user_token'));

    useEffect(() => {
        if (token) {
            loadUserProfile(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUserProfile = async (authToken) => {
        try {
            const userData = await authAPI.getProfile(authToken);
            setUser(userData);
        } catch (error) {
            console.error('Failed to load user profile:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (mobile, password) => {
        try {
            const response = await authAPI.login({ mobile, password });
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('user_token', response.token);
            return response.user;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem('user_token', response.token);
            return response.user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user_token');
    };

    const updateProfile = (updatedUser) => {
        setUser(prev => ({ ...prev, ...updatedUser }));
    };

    const value = {
        user,
        loading,
        token,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isMember: user?.isMember || false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
