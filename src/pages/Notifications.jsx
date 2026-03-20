import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bell, MessageSquare, CalendarCheck, ArrowRight, Clock, ShieldCheck, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import API_URL from '../config';

const API = API_URL;

const Notifications = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        // We derive notifications from unread messages and pending appointments
        const [msgRes, apptRes] = await Promise.all([
          axios.get(`${API}/api/messages`, { headers }),
          axios.get(`${API}/api/appointments`, { headers })
        ]);

        const unreadMsgs = msgRes.data.filter(m => !m.isRead).map(m => ({
          id: m._id,
          type: 'message',
          title: 'New Message',
          desc: `From ${m.name}: ${m.subject || m.message.slice(0, 40) + '...'}`,
          time: m.createdAt,
          route: '/messages'
        }));

        const pendingAppts = apptRes.data.filter(a => a.status === 'Pending').map(a => ({
          id: a._id,
          type: 'appointment',
          title: 'Pending Appointment',
          desc: `${a.name} booked a session for ${a.date}`,
          time: a.createdAt,
          route: '/appointments'
        }));

        const combined = [...unreadMsgs, ...pendingAppts].sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotices(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid #f0f4ff', borderTop: '3px solid #5168AF', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      <p style={{ color: '#5168AF', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600', fontFamily: "'Source Sans 3', sans-serif" }}>Loading Notices...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Page Header ── */}
      <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '3px', height: '28px', background: 'linear-gradient(to bottom, #EE6F36, #d95d2c)', borderRadius: '2px' }} />
          <h2 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '26px', fontWeight: '700', color: '#111827', margin: 0 }}>
            Notifications Center
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 0 15px' }}>
          Manage all unread messages and pending actions from one place.
        </p>
      </div>

      {notices.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '24px', padding: '80px 20px', textAlign: 'center', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Bell size={32} color="#5168AF" />
          </div>
          <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>All caught up!</h3>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No new notifications at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notices.map((n) => (
            <div 
              key={`${n.type}-${n.id}`}
              onClick={() => navigate(n.route)}
              style={{
                background: 'white', borderRadius: '16px', padding: '20px',
                border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px',
                cursor: 'pointer', transition: 'all 0.2s ease', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(81,104,175,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'; }}
            >
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                background: n.type === 'message' ? '#eff6ff' : '#fff7ed',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {n.type === 'message' ? <Mail size={20} color="#3b82f6" /> : <CalendarCheck size={20} color="#f97316" />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>{n.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#9ca3af' }}>
                    <Clock size={12} />
                    {formatDate(n.time)}
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {n.desc}
                </p>
              </div>

              <div style={{ padding: '8px', borderRadius: '8px', background: '#f8fafc', color: '#5168AF' }}>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Card */}
      <div style={{ 
        marginTop: '20px', background: '#111827', borderRadius: '20px', padding: '24px', 
        display: 'flex', alignItems: 'center', gap: '20px', color: 'white' 
      }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={24} color="#EE6F36" />
        </div>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px' }}>System Alert</h4>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            Notifications are derived from real-time unread messages and pending appointments. Mark them as read/completed to clear this list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
