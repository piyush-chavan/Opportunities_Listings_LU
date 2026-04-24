import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import '../styles/SignInPage.css';

const isAllowedLetUnboundEmail = (email) => {
  return typeof email === 'string' && email.toLowerCase().endsWith('@letsunbound.com');
};

export default function SignInPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user?.email;

      if (!isAllowedLetUnboundEmail(email)) {
        await signOut(auth);
        toast.error('Only @letsunbound.com emails are allowed to sign in.');
        setLoading(false);
        return;
      }

      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(error?.message || 'Unable to sign in with Google.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="sign-in-container">
      <div className="sign-in-wrapper">
        <h1>Welcome to Lets Unbound</h1>
        <p>Sign in with your @letsunbound.com Google account to access opportunities.</p>
        <button className="google-sign-in-button" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
