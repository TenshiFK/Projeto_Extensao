"use client";
import { useState, createContext, useEffect, useContext } from 'react';
import { auth } from '../services/firebase/firebaseconfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'react-toastify';

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    async function signIn(email: string, password: string) {
        try { 
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log("Erro ao fazer o login", error);
            toast.error("Erro ao logar, verifique seu e-mail ou senha e tente novamente.");
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await signOut(auth);
        } catch (error) {   
            console.log("Erro ao fazer o logout", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}