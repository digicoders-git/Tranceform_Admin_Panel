import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BsCloudSun } from "react-icons/bs";

import {
  CalendarCheck, MessageSquare, BookOpen, Star,
  HelpCircle, Clock, TrendingUp, ArrowRight, Bell, Info,
  Sun,
  MoonStar
} from 'lucide-react';

import API_URL from '../config';

const API = API_URL;

const statusConfig = {
  Pending: { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  Confirmed: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
  Completed: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
  Cancelled: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
};

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    axios.get(`${API}/api/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetingIcon = hour < 12 ? <BsCloudSun /> : hour < 17 ? <Sun /> : <MoonStar />;

  const statCards = [
    {
      label: 'Appointments', value: data?.totalAppointments || 0,
      sub: `${data?.pendingAppointments || 0} pending`,
      icon: CalendarCheck, color: '#5168AF', bg: '#f0f4ff', border: '#cbd5e1',
      route: '/appointments',
    },
    {
      label: 'Messages', value: data?.totalMessages || 0,
      sub: `${data?.unreadMessages || 0} unread`,
      icon: MessageSquare, color: '#EE6F36', bg: '#fff4f0', border: '#fcd34d33',
      route: '/messages',
    },
    {
      label: 'Blog Posts', value: data?.totalBlogs || 0,
      sub: 'Published articles',
      icon: BookOpen, color: '#5168AF', bg: '#f0f4ff', border: '#cbd5e1',
      route: '/blogs',
    },
    {
      label: 'Testimonials', value: data?.totalTestimonials || 0,
      sub: 'Client reviews',
      icon: Star, color: '#EE6F36', bg: '#fff4f0', border: '#fcd34d33',
      route: '/testimonials',
    },
    {
      label: 'FAQs', value: data?.totalFaqs || 0,
      sub: 'Questions answered',
      icon: HelpCircle, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0',
      route: '/faqs',
    },
  ];

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '44px', height: '44px', border: '3px solid #f3ede6', borderTop: '3px solid #5168AF', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      <p style={{ color: '#5168AF', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(169,124,82,0.12) !important; }
        .stat-card { transition: all 0.2s ease !important; cursor: pointer; }
        .activity-row:hover { background: #fdf8f4 !important; }
        .view-all:hover { color: #3d4f8a !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ borderBottom: '1px solid #f0e8df', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>

          {/* Greeting */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '32px', background: 'linear-gradient(to bottom, #5168AF, #3d4f8a)', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: "'Source Sans 3', sans-serif", display: 'flex', alignItems: 'center', gap: '10px', fontSize: '26px', fontWeight: '700', color: '#111827', margin: 0 }}>
                {greetingIcon} {greeting}, Admin
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 0 13px' }}>
              {time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notifications')}
              style={{
                position: 'relative', width: '44px', height: '44px',
                borderRadius: '16px', background: 'white', border: '1px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#EE6F36'; e.currentTarget.style.background = '#fff7ed'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}
            >
              <Bell size={20} color="#5168AF" />
              {(data?.unreadMessages > 0 || data?.pendingAppointments > 0) && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  minWidth: '18px', height: '18px', borderRadius: '10px',
                  background: '#EE6F36', border: '2px solid white',
                  color: 'white', fontSize: '9px', fontWeight: '800',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px'
                }}>
                  {(data?.unreadMessages || 0) + (data?.pendingAppointments || 0)}
                </span>
              )}
            </button>

            {/* Live Clock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '10px 18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#f0f4ff', border: '1px solid #5168AF20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={14} color="#5168AF" />
              </div>
              <div>
                <p style={{ fontSize: '9px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 1px' }}>Live Time</p>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#111827', fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.5px' }}>
                  {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '14px' }}>
        {statCards.map(({ label, value, sub, icon: Icon, color, bg, border, route }) => (
          <div key={label} className="stat-card" onClick={() => navigate(route)}
            style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(81,104,175,0.04)' }}>
            {/* Icon */}
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Icon size={20} color={color} />
            </div>
            {/* Value */}
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1, marginBottom: '6px' }}>{value}</div>
            {/* Label */}
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#111827', marginBottom: '3px' }}>{label}</div>
            {/* Sub */}
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>{sub}</div>
            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '11px', color: '#5168AF', fontWeight: '600' }}>View all</span>
              <ArrowRight size={11} color="#5168AF" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

        {/* Recent Appointments */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 8px rgba(169,124,82,0.06)', overflow: 'hidden' }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f9f5f1', background: '#fdf8f4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarCheck size={14} color="#1d4ed8" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0a0f1a', fontFamily: "'Source Sans 3', sans-serif" }}>Recent Appointments</span>
            </div>
            <button className="view-all" onClick={() => navigate('/appointments')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#5168AF', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}>
              View all <ArrowRight size={12} />
            </button>
          </div>

          {!data?.recentAppointments?.length ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fdf8f4', border: '2px dashed #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <CalendarCheck size={22} color="#d4b896" />
              </div>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>No appointments yet</p>
            </div>
          ) : (
            data.recentAppointments.map((a, i) => (
              <div key={a._id} className="activity-row"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: i < data.recentAppointments.length - 1 ? '1px solid #faf7f4' : 'none', transition: 'background 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #5168AF, #3d4f8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(169,124,82,0.3)' }}>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: '700', fontFamily: "'Source Sans 3', sans-serif" }}>{a.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#0a0f1a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.service}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px', background: statusConfig[a.status]?.bg, border: `1px solid ${statusConfig[a.status]?.border}`, padding: '4px 10px', borderRadius: '20px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusConfig[a.status]?.dot }} />
                  <span style={{ fontSize: '11px', fontWeight: '600', color: statusConfig[a.status]?.color }}>{a.status}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Messages */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 8px rgba(169,124,82,0.06)', overflow: 'hidden' }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f9f5f1', background: '#fdf8f4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={14} color="#15803d" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0a0f1a', fontFamily: "'Source Sans 3', sans-serif" }}>Recent Messages</span>
            </div>
            <button className="view-all" onClick={() => navigate('/messages')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#5168AF', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}>
              View all <ArrowRight size={12} />
            </button>
          </div>

          {!data?.recentMessages?.length ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fdf8f4', border: '2px dashed #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <MessageSquare size={22} color="#d4b896" />
              </div>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>No messages yet</p>
            </div>
          ) : (
            data.recentMessages.map((m, i) => (
              <div key={m._id} className="activity-row"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: i < data.recentMessages.length - 1 ? '1px solid #faf7f4' : 'none', transition: 'background 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: m.isRead ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' : 'linear-gradient(135deg, #5168AF, #3d4f8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: m.isRead ? 'none' : '0 2px 6px rgba(169,124,82,0.3)' }}>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: '700', fontFamily: "'Source Sans 3', sans-serif" }}>{m.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: m.isRead ? '500' : '700', color: '#0a0f1a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject || 'No subject'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px', background: m.isRead ? '#f9fafb' : '#eff6ff', border: m.isRead ? '1px solid #e5e7eb' : '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '20px' }}>
                  {!m.isRead && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />}
                  <span style={{ fontSize: '11px', fontWeight: '600', color: m.isRead ? '#9ca3af' : '#1d4ed8' }}>{m.isRead ? 'Read' : 'Unread'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
