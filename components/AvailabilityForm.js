import { useState,useEffect } from 'react';

const getTimezones = () => {
  return Intl.supportedValuesOf('timeZone');
};

export default function AvailabilityForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    timezone:'',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timezones, setTimezones] = useState([]);

  // console.log(formData);

  useEffect(() => {
    const tzs = getTimezones();
    setTimezones(tzs);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    const startDate = new Date(formData.date);
    const startTime = new Date(`${formData.date}T${formData.startTime}`);
    const endTime = new Date(`${formData.date}T${formData.endTime}`);

    if(startTime> endTime){
      alert('Endtime must be after Starttime');
      setLoading(false);
      return;
    }

    if (endTime - startTime < 4 * 60 * 60 * 1000) {
      alert('Availability must be for at least four hours');
      setLoading(false);
      return;
    }
    

    const availabilityData = [];
    for (let i = 0; i < 7; i++) { 
      const availabilityDate = new Date(startDate);
      availabilityDate.setDate(startDate.getDate() + i);
      // console.log(availabilityDate);

      availabilityData.push({
        date: availabilityDate.toISOString().split('T')[0],
        startTime: formData.startTime,
        endTime: formData.endTime,
        timezone: formData.timezone,
      });
    }

    try {
      const res = await fetch('/api/employee/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(availabilityData),
      });

      const data = await res.json();
      if (res.ok) {
        onSubmit(availabilityData);
        setFormData({
          date: '',
          startTime: '',
          endTime: '',
          timeZone:'',
        });
      } else {
        setError(data.error || 'Failed to save availability');
      }
    } catch (err) {
      console.error('Error submitting availability:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">Start Time</label>
        <input
          type="time"
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">End Time</label>
        <input
          type="time"
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">TimeZone</label>
        <select
            onChange={e => setFormData({...formData, timezone: e.target.value})}
            className="px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="flex items-end">
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Saving...' : 'Add Availability'}
        </button>
          {error && <p className="text-red-500">{error}</p>}

      </div>
    </form>
  );
}
