'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState(null);

  const checkAdmin = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include', // Important: include cookies
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.isAdmin || false);
        setUsername(data.username || null);
      } else {
        setIsAdmin(false);
        setUsername(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setUsername(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check immediately on mount
    checkAdmin();
    
    // Check periodically (every 30 seconds) to detect login/logout
    // This is less frequent since we have a 30-day session
    const interval = setInterval(checkAdmin, 30000);
    
    // Also check when window gains focus (user returns to tab)
    const handleFocus = () => {
      checkAdmin();
    };
    
    // Check when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAdmin();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAdmin]);

  return { isAdmin, loading, username, checkAdminStatus: checkAdmin };
}

