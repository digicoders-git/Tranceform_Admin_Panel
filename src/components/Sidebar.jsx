import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CalendarCheck, MessageSquare,
  BookOpen, Star, HelpCircle, LogOut, Menu, X, Settings,
  ChevronLeft, ChevronRight, Bell
} from 'lucide-react';

const links = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/appointments', label: 'Appointments', icon: CalendarCheck },
  { to: '/messages',     label: 'Messages',     icon: MessageSquare },
  { to: '/blogs',        label: 'Blogs',        icon: BookOpen },
  { to: '/testimonials', label: 'Testimonials', icon: Star },
  { to: '/faqs',         label: 'FAQs',         icon: HelpCircle },
  { to: '/settings',     label: 'Settings',     icon: Settings },
];

const SidebarContent = ({ onClose, isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '100%', 
      background: '#1a2332', transition: 'all 0.3s ease',
      width: isCollapsed ? '80px' : '280px',
      overflow: 'hidden'
    }}>

      {/* Logo Area */}
      <div style={{ 
        padding: isCollapsed ? '24px 15px' : '30px 24px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <img 
            src="/image.png" 
            alt="Logo" 
            style={{ 
              width: isCollapsed ? '52px' : '170px', 
              height: 'auto', 
              objectFit: 'contain',
              transition: 'all 0.3s ease',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))'
            }} 
          />
        </div>

        {/* Toggle Button Inside Header */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
          style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', width: '30px', height: '30px',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
            transition: 'all 0.2s', padding: 0
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#EE6F36'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: isCollapsed ? '24px 16px' : '24px 16px', overflowY: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              title={isCollapsed ? label : ''}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '8px',
                fontSize: '13.5px', fontWeight: isActive ? '600' : '400',
                textDecoration: 'none', transition: 'all 0.15s ease',
                background: isActive ? '#5168AF' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} color={isActive ? '#ffffff' : 'rgba(255,255,255,0.35)'} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Divider */}
      <div style={{ margin: '0 20px', height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* Admin Info + Logout */}
      <div style={{ padding: '20px 16px 24px' }}>

        {/* Admin Card */}
        {!isCollapsed ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px', borderRadius: '8px', marginBottom: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: '#5168AF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>A</span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Administrator</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>admin@tranceform.com</div>
            </div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
             <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#5168AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>A</span>
             </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          title={isCollapsed ? 'Sign Out' : ''}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 14px', borderRadius: '8px',
            fontSize: '13.5px', fontWeight: '400',
            color: 'rgba(255,255,255,0.35)',
            background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', transition: 'all 0.15s',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

    </div>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle — only on small screens */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden"
        style={{
          position: 'fixed', top: '16px', left: '16px', zIndex: 50,
          width: '40px', height: '40px', background: '#1a2332',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: 'white', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <Menu size={18} />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className="lg:hidden"
        style={{
          position: 'fixed', left: 0, top: 0, height: '100%', width: '280px',
          zIndex: 50, transition: 'transform 0.25s ease',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <button
          onClick={() => setOpen(false)}
          style={{ position: 'absolute', top: '18px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', zIndex: 1 }}
        >
          <X size={18} />
        </button>
        <SidebarContent onClose={() => setOpen(false)} isCollapsed={false} setIsCollapsed={() => {}} />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block"
        style={{ 
           position: 'fixed', left: 0, top: 0, height: '100%', 
           width: isCollapsed ? '80px' : '280px',
           transition: 'width 0.3s ease',
           zIndex: 50
        }}
      >
        <SidebarContent onClose={() => {}} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </aside>
    </>
  );
};

export default Sidebar;
