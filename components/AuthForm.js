import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/auth/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      if (data.role === 'admin') {
        router.push('/admin/shifts');
      } else {
        router.push('/employee/shifts');
      }
    } else {
      alert('Error: ' + data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
      <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>
    </form>
  );
}
