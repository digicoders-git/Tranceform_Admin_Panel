import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  const { token } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!token) return <Navigate to="/login" />;

  const isDesktop = windowWidth > 1024;
  const sidebarWidthValue = isCollapsed ? '80px' : '280px';
  const effectiveSidebarWidth = isDesktop ? sidebarWidthValue : '0px';

  return (
    <div className="layout-container" style={{ '--sidebar-width': effectiveSidebarWidth }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
