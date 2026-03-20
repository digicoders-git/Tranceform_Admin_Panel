import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = () => {
  const { token } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!token) return <Navigate to="/login" />;

  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden' }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main style={{ 
        marginLeft: sidebarWidth, 
        flex: 1, 
        padding: '30px', 
        boxSizing: 'border-box', 
        width: `calc(100% - ${sidebarWidth})`, 
        overflowY: 'auto', 
        height: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
