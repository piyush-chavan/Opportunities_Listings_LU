import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const isAllowedLetUnboundEmail = (email) => {
  return typeof email === 'string' && email.toLowerCase().endsWith('@letsunbound.com');
};

export default function ProtectedRoute({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoaded(true);
    });

    return unsubscribe;
  }, []);

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!isAllowedLetUnboundEmail(user.email)) {
    signOut(auth);
    toast.error('Only @letsunbound.com emails are allowed to sign in.');
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
