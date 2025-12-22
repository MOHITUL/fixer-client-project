import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = () => {
        setLoading(true);
       
        localStorage.removeItem('access-token');
        return signOut(auth);
    }

    const updateUserProfile = (profile) =>{
        return updateProfile(auth.currentUser, profile)
    }

    
   useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        
        if (currentUser) {
            
            const token = await currentUser.getIdToken(); 
            localStorage.setItem('access-token', token);
            console.log("Token stored in LocalStorage");
        } else {
            localStorage.removeItem('access-token');
        }
        setLoading(false);
    });
    return () => unSubscribe();
}, []);

    const authInfo = {
        user,
        loading,
        registerUser,
        signInUser,
        signInGoogle,
        logOut,
        updateUserProfile
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;