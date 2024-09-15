import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';


const getTimezones = () => {
  return Intl.supportedValuesOf('timeZone');
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee',
    timezone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [timezones, setTimezones] = useState([]);

  // console.log(formData);

  useEffect(() => {
    const tzs = getTimezones();
    setTimezones(tzs);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password || !formData.timezone ) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        router.push('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password" 
              placeholder="Password" 
              required 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option className="text-gray-800" value="employee">Employee</option>
                <option className="text-gray-800" value="admin">Admin</option>
            </select>
          </div>
          <div>
            <select
                onChange={e => setFormData({...formData, timezone: e.target.value})}
                className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option className="text-gray-400" value="">Select Timezone</option>
                {timezones.map((timezone) => (
                  <option className="text-gray-800" key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className={`w-full py-2 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
