import { useState,useEffect } from 'react';
import AvailabilityForm from '../../components/AvailabilityForm';
import AvailabilityTable from '../../components/AvailabilityTable';
import Layout from '../../components/Layout';
import withAuth from '@/components/withAuth';

function EmployeeAvailability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAvailabilitySubmit = (newAvailability) => {
    setAvailability(prevAvailability => [
      ...prevAvailability, 
      ...newAvailability 
  ]);
  };

  useEffect(() => {
    const fetchAvaliabilty = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/employee/availability', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setAvailability(data);
        } else {
          setError(data.message || 'Failed to load Availability');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAvaliabilty();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl text-gray-700 font-bold mb-6">Employee Availability</h1>
        <AvailabilityForm onSubmit={handleAvailabilitySubmit} />
        <AvailabilityTable data={availability} />
      </div>
    </Layout>
  );
}


export default withAuth(EmployeeAvailability);