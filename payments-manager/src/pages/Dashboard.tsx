import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Dashboard</h2>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-300">Welcome, {user?.email}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300">Total Paid</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$0.00</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-300">Pending</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$0.00</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
             <h3 className="text-lg font-medium text-green-700 dark:text-green-300">Refunded</h3>
             <p className="text-3xl font-bold text-gray-900 dark:text-white">$0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
