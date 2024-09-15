import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <div>
            <Link href="/admin/shift" className="mr-4 hover:underline">
              Shifts
            </Link>
            <Link href="/admin/availability" className="hover:underline">
              Availability
            </Link>
          </div>
        </div>
      </nav>
      
      
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
