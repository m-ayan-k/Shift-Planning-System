import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {jwtDecode} from 'jwt-decode';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) {
        alert('No token found. Redirecting to login.');
        router.push('/');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          router.push('/');
        }
      } catch (error) {
        console.error('Token decoding error:', error);
        alert('Invalid token. Please log in again.');
        localStorage.removeItem('token');
        router.push('/');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
