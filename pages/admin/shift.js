import { useState, useEffect } from 'react';
import Layout from "../../components/AdminLayout"
import { useRouter } from 'next/router';
import {jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';
import withAuth from '@/components/withAuth';

const getTimezones = () => {
  return Intl.supportedValuesOf('timeZone');
};

function CreateShiftForm() {
    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [timezone, setTimezone] = useState('');
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [timezones, setTimezones] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [id,setId]=useState('');
    const [loading, setLoading]=useState();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
            return;
        }

        const decoded = jwtDecode(token);
        setTimezone(decoded.timezone);
        setId(decoded.id);
    }, [router]);

    useEffect(() => {
        const fetchAvailabilities = async () => {
            try {
                const res = await fetch('/api/admin/shift');
                const data = await res.json();
                setAvailabilities(data);
            } catch (error) {
                console.error('Error fetching availabilities:', error);
            }
        };

        fetchAvailabilities();
    }, []);

    useEffect(() => {
      const tzs = getTimezones();
      setTimezones(tzs);
    }, []);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        filterAvailableEmployees(e.target.value, selectedStartTime, selectedEndTime);
    };

    const handleStartTimeChange = (e) => {
        setSelectedStartTime(e.target.value);
        filterAvailableEmployees(selectedDate, e.target.value, selectedEndTime);
    };

    const handleEndTimeChange = (e) => {
        setSelectedEndTime(e.target.value);
        filterAvailableEmployees(selectedDate, selectedStartTime, e.target.value);
    };
    const handleTimeZone = (e) => {
        setTimezone(e.target.value);
        filterAvailableEmployees(selectedDate, selectedStartTime, e.target.value);
    };

    const filterAvailableEmployees = (date, startTime, endTime) => {
        if (date && startTime && endTime) {
            const filteredEmployees = availabilities.filter(avail => {
                const extractedDate = DateTime.fromISO(avail.date).toISODate();
    
                const availabilityStartDateTime = DateTime.fromISO(`${extractedDate}T${avail.startTime}`, { zone: timezone });
                const availabilityEndDateTime = DateTime.fromISO(`${extractedDate}T${avail.endTime}`, { zone: timezone });
                
                const selectedStartDateTime = DateTime.fromISO(`${selectedDate}T${selectedStartTime}`, { zone: timezone });
                const selectedEndDateTime = DateTime.fromISO(`${selectedDate}T${selectedEndTime}`, { zone: timezone });
                
                console.log(extractedDate,availabilityStartDateTime <= selectedStartDateTime,selectedEndDateTime <= availabilityEndDateTime)
                return (
                    availabilityStartDateTime <= selectedStartDateTime && 
                    selectedEndDateTime <= availabilityEndDateTime
                );
            });
            // console.log(filteredEmployees);
            setAvailableEmployees(
                filteredEmployees.map(avail => ({
                    email: avail.user.email,
                    id: avail.user._id
                }))
            );
        } else {
            setAvailableEmployees([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/admin/shift', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: selectedDate,
                    startTime: selectedStartTime,
                    endTime: selectedEndTime,
                    timezone,
                    admin: id,
                    employee: selectedEmployees,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create shifts');
            }
            alert('Shifts created successfully!');
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    // console.log(availableEmployees);
    return (
      <Layout>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl text-gray-800 font-bold mb-4">Create Shift</h2>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="mt-1 block w-full text-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Time:</label>
                <input
                    type="time"
                    value={selectedStartTime}
                    onChange={handleStartTimeChange}
                    className="mt-1 block w-full text-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Time:</label>
                <input
                    type="time"
                    value={selectedEndTime}
                    onChange={handleEndTimeChange}
                    className="mt-1 block w-full text-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Timezone:</label>
                <select
                    value={timezone}
                    onChange={handleTimeZone}
                    className="mt-1 block w-full text-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                >
                    
                    {timezones.map((tz) => (
                        <option className="text-gray-800"key={tz} value={tz}>{tz}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Employee:</label>
                <select
                    value={selectedEmployees} 
                    onChange={(e) => setSelectedEmployees(e.target.value)} 
                    className="block text-gray-800 w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option className='text-gray-800' value="">Select an employee</option> 
                    {availableEmployees.map((employee) => (
                        <option className='text-gray-800' key={employee.id} value={employee.id}>
                            {employee.email}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            >
                {loading? "Saving..":"Create Shift"}
            </button>
        </form>

      </Layout>
    );
}

export default withAuth(CreateShiftForm);