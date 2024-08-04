'use client';


import { useEffect } from 'react';
import isAuthenticated from './authClient';
import { useRouter } from 'next/navigation';

// Function to check if the token is valid


const withAuth =(WrappedComponent: any) => {
  const Wrapper: React.FC = (props) => {
   const router  = useRouter();

    useEffect(() => {
      if (!isAuthenticated()) {
        router.push('/pages/auth/login'); // Redirect to login page if not authenticated
      }
    }, [router]);

    if (!isAuthenticated()) {
      return <div>Not Allowed Please Login...</div>; // Optional: Show a loading spinner or message while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
