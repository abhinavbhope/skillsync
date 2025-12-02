
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { usePathname } from 'next/navigation';
import { getMe, getAuthStatus, logoutUser } from '@/lib/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    console.log('[AuthContext] fetchUser: Starting auth check...');
    setLoading(true);
    try {
      console.log('[AuthContext] fetchUser: Calling getAuthStatus().');
      const status = await getAuthStatus();
      console.log('[AuthContext] fetchUser: getAuthStatus() response:', status);

      if (status && status.valid) {
        console.log('[AuthContext] fetchUser: Session is VALID. Calling getMe().');
        const userData = await getMe();
        console.log('[AuthContext] fetchUser: getMe() response:', userData);

        if (userData && userData.userId) {
          const newUser = {
            id: userData.userId,
            email: userData.email,
            name: userData.name || 'User',
            picture:
              userData.picture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData.name || userData.email
              )}`,
          };
          console.log('[AuthContext] fetchUser: Setting user state.', newUser);
          setUser(newUser);
        } else {
          console.log('[AuthContext] fetchUser: getMe() returned no user. Clearing user state.');
          setUser(null);
        }
      } else {
        console.log('[AuthContext] fetchUser: Session is INVALID. Clearing user state.');
        setUser(null);
      }
    } catch (e) {
      console.error('[AuthContext] fetchUser: An error occurred during auth check.', e);
      setUser(null);
    } finally {
      console.log('[AuthContext] fetchUser: Auth check finished. Setting loading to false.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(`[AuthContext] useEffect: Path changed to "${pathname}". Running fetchUser.`);
    fetchUser();
    // We only want this to run on path changes, not on every `fetchUser` change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const logout = useCallback(async () => {
    console.log('[AuthContext] logout: Initiating logout.');
    try {
      await logoutUser();
      console.log('[AuthContext] logout: logoutUser() API call successful.');
    } catch (e) {
      console.error('[AuthContext] logout: Logout API failed.', e);
    } finally {
      // Ensure user state is cleared on the frontend regardless of API success.
      console.log('[AuthContext] logout: Clearing user state.');
      setUser(null);
      // Optional: redirect to home or login page after logout
      // window.location.href = '/';
    }
  }, []);

  const value = { user, logout, loading, refetchUser: fetchUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
