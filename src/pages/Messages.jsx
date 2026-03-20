import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Trash2, Mail, MailOpen, Phone, Tag, Clock } from 'lucide-react';
import API_URL from '../config';
import '../components/PageBase.css';

const API = API_URL;

const Messages = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/messages`, { headers })
      .then(res => { setMessages(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const markRead = async (msg) => {
    if (msg.isRead) return;
    const res = await axios.put(`${API}/api/messages/${msg._id}`, { isRead: true }, { headers });
    setMessages(prev => prev.map(m => m._id === msg._id ? res.data : m));
    setSelected(res.data);
  };

  const toggleRead = async (msg, e) => {
    e.stopPropagation();
    const res = await axios.put(`${API}/api/messages/${msg._id}`, { isRead: !msg.isRead }, { headers });
    setMessages(prev => prev.map(m => m._id === msg._id ? res.data : m));
    if (selected?._id === msg._id) setSelected(res.data);
  };

  const deleteMessage = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Delete this message?')) return;
    await axios.delete(`${API}/api/messages/${id}`, { headers });
    setMessages(prev => prev.filter(m => m._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const filtered = filter === 'All' ? messages
    : filter === 'Unread' ? messages.filter(m => !m.isRead)
    : messages.filter(m => m.isRead);

  const unreadCount = messages.filter(m => !m.isRead).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '44px', height: '44px', border: '3px solid #f3ede6', borderTop: '3px solid #5168AF', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      <p style={{ color: '#5168AF', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .msg-row:hover { background: #fdf8f4 !important; }
        .msg-row.active { background: #fdf8f4 !important; border-left: 3px solid #5168AF !important; }
        .filter-btn:hover { border-color: #5168AF !important; color: #5168AF !important; }
        .del-btn:hover { background: #dc2626 !important; }
        .del-btn:hover svg { color: white !important; }
        .reply-btn:hover { background: #8a6340 !important; }
      `}</style>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '28px', background: 'linear-gradient(to bottom, #5168AF, #3d4f8a)', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '26px', fontWeight: '700', color: '#0a0f1a', margin: 0 }}>
                Messages
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 0 13px', fontWeight: '400' }}>
              View and respond to client inquiries
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total', value: messages.length, color: '#0a0f1a', bg: '#f4f6f9' },
              { label: 'Unread', value: unreadCount, color: '#1d4ed8', bg: '#eff6ff' },
              { label: 'Read', value: messages.length - unreadCount, color: '#15803d', bg: '#f0fdf4' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: '10px', padding: '8px 14px', textAlign: 'center', minWidth: '64px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color, fontFamily: "'Source Sans 3', sans-serif" }}>{value}</div>
                <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['All', 'Unread', 'Read'].map(f => (
          <button key={f} className="filter-btn" onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
            border: filter === f ? '1px solid #5168AF' : '1px solid #e5e7eb',
            background: filter === f ? '#5168AF' : 'white',
            color: filter === f ? 'white' : '#6b7280',
            cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.3px',
          }}>
            {f}
            <span style={{
              marginLeft: '6px', fontSize: '11px', fontWeight: '700',
              background: filter === f ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
              color: filter === f ? 'white' : '#9ca3af',
              padding: '1px 7px', borderRadius: '10px',
            }}>
              {f === 'All' ? messages.length : f === 'Unread' ? unreadCount : messages.length - unreadCount}
            </span>
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className={`split-layout ${selected ? 'with-detail' : 'no-detail'}`}>

        {/* ── Inbox List ── */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 12px rgba(169,124,82,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* List Header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f9f5f1', background: '#fdf8f4' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#5168AF', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              {filtered.length} {filter === 'All' ? 'Total' : filter} Message{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fdf8f4', border: '2px dashed #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <MessageSquare size={28} color="#d4b896" />
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', color: '#5168AF', margin: '0 0 6px', fontWeight: '600' }}>No messages found</p>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Try changing the filter above</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filtered.map((m, i) => (
                <div
                  key={m._id}
                  className={`msg-row ${selected?._id === m._id ? 'active' : ''}`}
                  onClick={() => { setSelected(m); markRead(m); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '15px 20px', cursor: 'pointer',
                    borderBottom: i < filtered.length - 1 ? '1px solid #faf7f4' : 'none',
                    borderLeft: selected?._id === m._id ? '3px solid #5168AF' : '3px solid transparent',
                    transition: 'all 0.15s',
                    background: selected?._id === m._id ? '#fdf8f4' : 'white',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                    background: m.isRead ? 'linear-gradient(135deg, #e5e7eb, #d1d5db)' : 'linear-gradient(135deg, #5168AF, #3d4f8a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: m.isRead ? 'none' : '0 2px 8px rgba(169,124,82,0.3)',
                  }}>
                    <span style={{ color: 'white', fontSize: '15px', fontWeight: '700', fontFamily: "'Source Sans 3', sans-serif" }}>
                      {m.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: m.isRead ? '500' : '700', color: '#0a0f1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#b8a090', flexShrink: 0 }}>{formatDate(m.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: m.isRead ? '#9ca3af' : '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: m.isRead ? '400' : '500' }}>
                      {m.subject || m.message?.slice(0, 50) || 'No subject'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {!m.isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5168AF' }} />}
                    <button onClick={e => toggleRead(m, e)} title={m.isRead ? 'Mark unread' : 'Mark read'}
                      style={{ background: '#f9f5f1', border: '1px solid #f0e8df', borderRadius: '7px', padding: '5px', cursor: 'pointer', display: 'flex', color: '#3d4f8a' }}>
                      {m.isRead ? <Mail size={13} /> : <MailOpen size={13} />}
                    </button>
                    <button className="del-btn" onClick={e => deleteMessage(m._id, e)}
                      style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '7px', padding: '5px', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}>
                      <Trash2 size={13} color="#dc2626" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Detail Panel ── */}
        {selected && (
          <div className="detail-panel" style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 12px rgba(169,124,82,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Panel Header */}
            <div style={{ background: 'linear-gradient(135deg, #1a2332, #2d3f55)', padding: '22px 20px', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #5168AF, #3d4f8a)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, #5168AF, #3d4f8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: '700', fontFamily: "'Source Sans 3', sans-serif" }}>{selected.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', fontWeight: '700', color: 'white', margin: '0 0 3px' }}>{selected.name}</h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{selected.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Panel Body */}
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>

              {/* Meta Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {selected.phone && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fdf8f4', border: '1px solid #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={14} color="#5168AF" />
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>Phone</p>
                      <p style={{ fontSize: '13px', color: '#0a0f1a', fontWeight: '500', margin: 0 }}>{selected.phone}</p>
                    </div>
                  </div>
                )}
                {selected.subject && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fdf8f4', border: '1px solid #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Tag size={14} color="#5168AF" />
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>Subject</p>
                      <p style={{ fontSize: '13px', color: '#0a0f1a', fontWeight: '600', margin: 0 }}>{selected.subject}</p>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fdf8f4', border: '1px solid #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={14} color="#5168AF" />
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>Received</p>
                    <p style={{ fontSize: '13px', color: '#0a0f1a', fontWeight: '500', margin: 0 }}>{formatDate(selected.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>Message</p>
                <div style={{ background: '#fdf8f4', border: '1px solid #f0e8df', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#1a2035', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selected.isRead ? '#22c55e' : '#5168AF' }} />
                <span style={{ fontSize: '12px', color: selected.isRead ? '#15803d' : '#3d4f8a', fontWeight: '600' }}>
                  {selected.isRead ? 'Read' : 'Unread'}
                </span>
                <button 
                  onClick={e => toggleRead(selected, e)} 
                  style={{ 
                    marginLeft: 'auto', fontSize: '11px', 
                    color: selected.isRead ? '#9ca3af' : '#5168AF', 
                    background: selected.isRead ? '#f9f5f1' : '#eff6ff', 
                    border: `1px solid ${selected.isRead ? '#f0e8df' : '#bfdbfe'}`, 
                    borderRadius: '6px', padding: '4px 12px', cursor: 'pointer',
                    fontWeight: '600', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if(!selected.isRead) e.currentTarget.style.background = '#dbeafe'; }}
                  onMouseLeave={e => { if(!selected.isRead) e.currentTarget.style.background = '#eff6ff'; }}
                >
                  Mark as {selected.isRead ? 'Unread' : 'Read'}
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f0e8df' }}>
                <a 
                  href={`mailto:${selected.email}?subject=Reply to your inquiry - Tranceform Hypnotherapy`} 
                  className="reply-btn" 
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    background: '#5168AF', color: 'white', padding: '12px 20px',
                    borderRadius: '10px', fontSize: '13px', fontWeight: '600',
                    textDecoration: 'none', transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(81,104,175,0.2)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3d4f8a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#5168AF'}
                >
                  <Mail size={14} /> Reply via Email
                </a>
                <button onClick={() => deleteMessage(selected._id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'white', border: '1px solid #fecaca', color: '#dc2626',
                  padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <Trash2 size={14} /> Delete Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
