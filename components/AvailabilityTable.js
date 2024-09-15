export default function AvailabilityTable({ data }) {
  // console.log(data);
  return (
    <div className="mt-8">
      {data.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Date</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Start Time</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">End Time</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">TimeZone</th>
            </tr>
          </thead>
          <tbody>
            {data.map((avail, idx) => {
              const dateObj = new Date(avail.date);
              const dayOfWeek = dateObj.toLocaleString('en-US', { weekday: 'long' });
              const dateOnly = new Date(avail.date).toISOString().split('T')[0];

              return (
                <tr key={idx} className="border-t border-gray-300 hover:bg-gray-100">
                  <td className="text-gray-800 px-4 py-2">
                    <div>{dayOfWeek}</div>
                    <div>{dateOnly}</div>
                  </td>
                  <td className="text-gray-800 px-4 py-2">{avail.startTime}</td>
                  <td className="text-gray-800 px-4 py-2">{avail.endTime}</td>
                  <td className="text-gray-800 px-4 py-2">{avail.timezone}</td>
                </tr>
              );
            })} 
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 mt-4">No availability data found</p>
      )}
    </div>
  );
}
