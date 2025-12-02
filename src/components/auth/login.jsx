'use client';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Loader2 } from 'lucide-react';
import { getLoginUrl } from '@/lib/authApi';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';

const GoogleIcon = () => (
  <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8 106.5 11.6 244 11.6c67.3 0 125.1 27.2 168.4 70.2l-63.4 61.9C317.8 119.5 283.4 99.8 244 99.8c-79.9 0-145.2 65.2-145.2 162s65.3 162 145.2 162c94.3 0 120-68.7 123.6-103.3H244v-78.5h239.1c4.8 26.5 7.9 54.4 7.9 84.1z"></path>
  </svg>
);


const Login = () => {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      // Pass the current path to be used as the redirect destination after login
      const url = await getLoginUrl(pathname);
      if (url) {
        window.location.href = url;
      } else {
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
        await logout();
    } catch (error) {
        console.error('Logout failed', error);
    }
  }

  if (loading) {
    return <Skeleton className="h-10 w-44 rounded-md" />;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-primary/50">
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoggingIn}
      className="bg-white text-gray-800 hover:bg-gray-100/90 font-medium transition-all duration-300"
    >
      {isLoggingIn ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
          <GoogleIcon />
      )}
      Sign in with Google
    </Button>
  );
};

export default Login;