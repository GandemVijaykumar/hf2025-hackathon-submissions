import { createContext, useContext, useState, useEffect } from 'react';

// Create the context with a default value of null or undefined
const AuthContext = createContext(null);

// The provider component
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUserInfo(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };
    
    const updateUser = (updatedData) => {
        const stored = JSON.parse(localStorage.getItem('userInfo'));
        const updatedUserInfo = { ...stored, ...updatedData };
        setUserInfo(updatedUserInfo);
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }

    // The value provided to consuming components
    const value = { userInfo, loading, login, logout, updateUser };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// The custom hook for easy consumption of the context
export const useAuth = () => {
    return useContext(AuthContext);
};