// presentation/components/layout/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../navigation/Navbar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}