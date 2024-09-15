import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      setLoading(false);

      console.log(data);
      if (res.ok) {
        localStorage.setItem('token', data.token);
        
        const decoded = jwtDecode(data.token);
        if (decoded.role === 'admin') {
          router.push('/admin/availability');
        } else {
          router.push('/employee/availability');
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border text-gray-800 placeholder:text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border text-gray-800 placeholder:text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button> 
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
