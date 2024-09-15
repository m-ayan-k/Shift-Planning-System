import { useState, useEffect } from 'react';
import Layout from "../../components/AdminLayout"

const getTimezones = () => {
    return Intl.supportedValuesOf('timeZone');
  };

export default function EmployeeAvailability() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [adjustedAvailability, setAdjustedAvailability] = useState([]);
  const [timezones, setTimezones] = useState([]);

  // console.log(formData);

  useEffect(() => {
    const tzs = getTimezones();
    setTimezones(tzs);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && selectedTimezone) {
        console.log(availability,selectedTimezone);
        const newAdjustedAvailability = availability.map((avail) => {
        const isoDate = new Date(avail.date);
        const dateInSelectedTZ = new Date(avail.date).toLocaleDateString('en-US', { timeZone: selectedTimezone });
        const startTimeInSelectedTZ = new Date(isoDate.toISOString().split('T')[0] + 'T' + avail.startTime + ':00Z').toLocaleString('en-US', {
            timeZone: selectedTimezone,
            hour: '2-digit',
            minute: '2-digit',
          }) ;
        const endTimeInSelectedTZ = new Date(isoDate.toISOString().split('T')[0] + 'T' + avail.endTime + ':00Z').toLocaleString('en-US', {
            timeZone: selectedTimezone,
            hour: '2-digit',
            minute: '2-digit',
          }) ;

        return {
          ...avail,
          dateInTZ: dateInSelectedTZ,
          startTimeInTZ: startTimeInSelectedTZ,
          endTimeInTZ: endTimeInSelectedTZ,
          dayName: new Date(dateInSelectedTZ).toLocaleDateString('en-US', { weekday: 'long' }),
        };
      });

      setAdjustedAvailability(newAdjustedAvailability);
    } else {
      
      setAdjustedAvailability(availability);
    }
  }, [availability, selectedTimezone, mounted]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/admin/availability?role=employee');
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  
  const fetchAvailability = async (employeeEmail) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/availability?email=${employeeEmail}`);
      const data = await res.json();
      setAvailability(data.availability);
      setSelectedTimezone(data.employee.timezone); 
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    const email = e.target.value;
    setSelectedEmployee(email);
    setAvailability([]);
    if(email)
        fetchAvailability(email);
  };

  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  return (
    <Layout>
        <div className="p-8">
            <h1 className="text-2xl text-gray-900 font-bold mb-6">Employee Availability</h1>

            
            <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                    <label className="block text-gray-700">Select Employee</label>
                    <select
                    onChange={handleEmployeeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-600"
                    >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                        <option className='text-gray-800' key={employee._id} value={employee.email}>
                        {employee.email}
                        </option>
                    ))}
                    </select>
                </div>

                
                <div className="flex-1">
                    <label className="block text-gray-700">Timezone</label>
                    <select
                        value={selectedTimezone}
                        onChange={handleTimezoneChange}
                        className="w-full p-2 border text-gray-800 border-gray-300 rounded-lg placeholder:text-gray-600"
                    >
                        <option className='text-gray-800' value="">Select a timezone</option>
                        {timezones.map((timezone, index) => (
                        <option className='text-gray-800' key={index} value={timezone}>
                            {timezone}
                        </option>
                        ))}
                    </select>
                </div>
            </div>


            
            <div className="mt-8">
                {loading ? (
                <p>Loading availability...</p>
                ) : availability.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left text-gray-600 font-medium">Day</th>
                        <th className="px-4 py-2 text-left text-gray-600 font-medium">Date</th>
                        <th className="px-4 py-2 text-left text-gray-600 font-medium">Start Time</th>
                        <th className="px-4 py-2 text-left text-gray-600 font-medium">End Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {adjustedAvailability.map((avail, idx) => (
                        <tr key={idx} className="border-t border-gray-300 hover:bg-gray-100">
                            
                            <td className="px-4 py-2 text-gray-800">{avail.dayName}</td>

                            
                            <td className="px-4 py-2 text-gray-800">{avail.dateInTZ}</td>

                            
                            <td className="px-4 py-2 text-gray-800">{avail.startTimeInTZ}</td>

                           
                            <td className="px-4 py-2 text-gray-800">{avail.endTimeInTZ}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                <p className="text-center text-gray-500">No availability data found</p>
                )}
            </div>
        </div>
    </Layout>
  );
}
