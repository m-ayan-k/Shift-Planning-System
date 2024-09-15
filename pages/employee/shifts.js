import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { DateTime } from 'luxon'; 


export default function EmployeeShifts() {
  const router = useRouter();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShifts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/employee/shifts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setShifts(data);
        } else {
          setError(data.message || 'Failed to load shifts');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  // console.log(shifts);
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p className="text-red-500">{error}</p>;

  const formatShiftTimes = (shift) => {
    const dateOnly = DateTime.fromISO(shift.date, { zone: 'utc' }).toFormat('yyyy-MM-dd');

    const adminTime = DateTime.fromISO(dateOnly)
      .toFormat('yyyy-MM-dd');

    const adminStartTime = DateTime.fromISO(`${dateOnly}T${shift.startTime}`)
      .toFormat('HH:mm');

    const adminEndTime = DateTime.fromISO(`${dateOnly}T${shift.endTime}`)
      .toFormat('HH:mm');
      
    
      const employeeDateTime = DateTime.fromISO(`${dateOnly}T00:00:00`)
      .setZone(shift.employee.timezone);
    
      const employeeDay = employeeDateTime.toFormat('cccc'); 
      const employeeStartTime = DateTime.fromISO(`${dateOnly}T${shift.startTime}`)
        .setZone(shift.employee.timezone)
        .toFormat('HH:mm');
      
      const employeeEndTime = DateTime.fromISO(`${dateOnly}T${shift.endTime}`)
        .setZone(shift.employee.timezone)
        .toFormat('HH:mm');
      
      const employeeDate = employeeDateTime.toFormat('yyyy-MM-dd');

      const adminDay = DateTime.fromISO(dateOnly).toFormat('cccc'); 

    return {
      adminStartTime,
      adminEndTime,
      adminTime,
      employeeDate,
      employeeStartTime,
      employeeEndTime,
      adminDay,
      employeeDay
    };
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl text-gray-800 font-bold mb-4">Your Assigned Shifts</h1>
        {shifts.length > 0 ? (
          <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
            {shifts.map((shift, index) => {
              const { adminTime, adminStartTime, adminEndTime, employeeDate, employeeStartTime, employeeEndTime,adminDay,employeeDay } = formatShiftTimes(shift);
      
              return (  
                <li key={index} className="p-4 hover:bg-gray-100 transition duration-200">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium">Admin Timezone: {shift.timezone}</span>
                      <span className="text-sm text-gray-500">{adminDay}, {adminTime}</span>
                      <span className="text-gray-500">Time: {adminStartTime} - {adminEndTime}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-800 font-medium">Employee Timezone: {shift.employee.timezone}</span>
                      <span className="text-sm text-gray-500">{employeeDay}, {employeeDate}</span>
                      <span className="text-gray-500">Time: {employeeStartTime} - {employeeEndTime}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="text-gray-500">No shifts assigned at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
    
  );
}
