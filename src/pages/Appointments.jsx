import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, Trash2, ChevronDown, Clock, User, Mail, Phone, Briefcase, Download, Check, X } from 'lucide-react';

import API_URL from '../config';

const API = API_URL;

const statusConfig = {
  Pending:   { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  Confirmed: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
  Completed: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
  Cancelled: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
};

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const filterCounts = (appointments) => ({
  All: appointments.length,
  Pending: appointments.filter(a => a.status === 'Pending').length,
  Confirmed: appointments.filter(a => a.status === 'Confirmed').length,
  Completed: appointments.filter(a => a.status === 'Completed').length,
  Cancelled: appointments.filter(a => a.status === 'Cancelled').length,
});

const fonts = `
  * { font-family: 'Source Sans 3', sans-serif; }
`;

const Appointments = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/appointments`, { headers })
      .then(res => { setAppointments(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${API}/api/appointments/${id}`, { status }, { headers });
      setAppointments(prev => prev.map(a => a._id === id ? res.data : a));
      if (selected?._id === id) setSelected(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    await axios.delete(`${API}/api/appointments/${id}`, { headers });
    setAppointments(prev => prev.filter(a => a._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.status === filter);
  const counts = filterCounts(appointments);

  const exportExcel = () => {
    try {
      if (appointments.length === 0) {
        alert("No data to export!");
        return;
      }

      const headers = ['Client Name', 'Email', 'Phone', 'Date', 'Time', 'Service', 'Status', 'Booked At'];
      const companyName = "TRANCEFORM - ADMIN PANEL";
      const reportDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      // Build CSV string
      let csv = "\uFEFF"; // BOM for Excel
      csv += `"${companyName}"\n`;
      csv += `"Appointments Report - Generated on ${reportDate}"\n\n`;
      csv += headers.map(h => `"${h}"`).join(',') + '\n';

      appointments.forEach(a => {
        csv += [
          `"${a.name || '-'}"`,
          `"${a.email || '-'}"`,
          `"${a.phone || '-'}"`,
          `"${a.date || '-'}"`,
          `"${a.time || '-'}"`,
          `"${a.service || '-'}"`,
          `"${a.status || '-'}"`,
          `"${a.createdAt ? new Date(a.createdAt).toLocaleString('en-GB') : '-'}"`
        ].join(',') + '\n';
      });

      // Filename
      const fileName = `Tranceform_Report_${new Date().toISOString().split('T')[0]}.csv`;

      // Method: Data URI (More reliable for Edge/Chrome file naming sometimes)
      const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Downloading... Please open " + fileName + " from your folder.");
    } catch (error) {
      console.error('Export Error:', error);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
      <style>{fonts + `@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '44px', height: '44px', border: '3px solid #f3ede6', borderTop: '3px solid #5168AF', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      <p style={{ color: '#5168AF', fontSize: '13px', fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', fontFamily: "'Source Sans 3', sans-serif" }}>
      <style>{fonts + `
        @keyframes spin { to { transform: rotate(360deg); } }
        .appt-row:hover { background: #fdf8f4 !important; }
        .appt-row.active-row { background: #fdf8f4 !important; border-left: 3px solid #5168AF !important; }
        .delete-btn:hover { background: #dc2626 !important; }
        .delete-btn:hover svg { color: white !important; }
        .filter-btn:hover { border-color: #5168AF !important; color: #5168AF !important; }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ borderBottom: '1px solid #f0e8df', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '28px', background: 'linear-gradient(to bottom, #5168AF, #3d4f8a)', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '26px', fontWeight: '700', color: '#1a2332', margin: 0, letterSpacing: '0.3px' }}>
                Appointments
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 0 13px', fontWeight: '400', letterSpacing: '0.2px' }}>
              Manage and track all client appointments
            </p>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total', value: counts.All, color: '#1a2332', bg: '#f4f6f9' },
              { label: 'Pending', value: counts.Pending, color: '#b45309', bg: '#fffbeb' },
              { label: 'Confirmed', value: counts.Confirmed, color: '#15803d', bg: '#f0fdf4' },
              { label: 'Completed', value: counts.Completed, color: '#1d4ed8', bg: '#eff6ff' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${bg === '#f4f6f9' ? '#e5e7eb' : 'transparent'}`, borderRadius: '10px', padding: '8px 14px', textAlign: 'center', minWidth: '64px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color, fontFamily: "'Source Sans 3', sans-serif" }}>{value}</div>
                <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter Tabs & Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', ...STATUSES].map(s => (
            <button key={s} className="filter-btn" onClick={() => setFilter(s)} style={{
              padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
              border: filter === s ? '1px solid #5168AF' : '1px solid #e5e7eb',
              background: filter === s ? '#5168AF' : 'white',
              color: filter === s ? 'white' : '#6b7280',
              cursor: 'pointer', transition: 'all 0.2s',
              letterSpacing: '0.3px', fontFamily: "'Source Sans 3', sans-serif",
            }}>
              {s}
              <span style={{
                marginLeft: '6px', fontSize: '11px', fontWeight: '700',
                background: filter === s ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                color: filter === s ? 'white' : '#9ca3af',
                padding: '1px 7px', borderRadius: '10px',
              }}>{counts[s] ?? counts.All}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={exportExcel}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#EE6F36', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(238,111,54,0.15)',
            fontFamily: "'Source Sans 3', sans-serif"
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#d95d2c'}
          onMouseLeave={e => e.currentTarget.style.background = '#EE6F36'}
        >
          <Download size={16} /> Export Excel
        </button>
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '16px', flex: 1, minHeight: 0 }}>

        {/* Table Card */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 12px rgba(169,124,82,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* Table Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f9f5f1', background: '#fdf8f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#5168AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: "'Source Sans 3', sans-serif" }}>
              {filtered.length} {filter === 'All' ? 'Total' : filter} Record{filtered.length !== 1 ? 's' : ''}
            </span>
            {selected && (
              <button onClick={() => setSelected(null)} style={{ fontSize: '11px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>
                Close Detail ✕
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fdf8f4', border: '2px dashed #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CalendarCheck size={28} color="#d4b896" />
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', color: '#5168AF', margin: '0 0 6px', fontWeight: '600' }}>No appointments found</p>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Try changing the filter above</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fdf8f4' }}>
                    {['Client', 'Service', 'Date', 'Status', ''].map((h, i) => (
                      <th key={i} style={{
                        padding: '13px 18px', textAlign: 'left',
                        fontSize: '10px', fontWeight: '700', color: '#b8a090',
                        textTransform: 'uppercase', letterSpacing: '1.2px',
                        borderBottom: '1px solid #f0e8df', whiteSpace: 'nowrap',
                        fontFamily: "'Source Sans 3', sans-serif",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr
                      key={a._id}
                      className={`appt-row ${selected?._id === a._id ? 'active-row' : ''}`}
                      onClick={() => setSelected(selected?._id === a._id ? null : a)}
                      style={{
                        borderBottom: i < filtered.length - 1 ? '1px solid #faf7f4' : 'none',
                        cursor: 'pointer', transition: 'all 0.15s',
                        borderLeft: selected?._id === a._id ? '3px solid #5168AF' : '3px solid transparent',
                      }}
                    >
                      {/* Client */}
                      <td style={{ padding: '15px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #5168AF, #3d4f8a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(169,124,82,0.3)',
                          }}>
                            <span style={{ color: 'white', fontSize: '14px', fontWeight: '700', fontFamily: "'Source Sans 3', sans-serif" }}>
                              {a.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a2332', fontFamily: "'Source Sans 3', sans-serif" }}>{a.name}</div>
                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{a.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td style={{ padding: '15px 18px', maxWidth: '180px' }}>
                        <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.service}</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', display: 'block' }}>{a.phone}</span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '15px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={12} color="#5168AF" />
                          <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>{a.date}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '15px 18px' }}>
                        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                          <div style={{ position: 'absolute', left: '10px', width: '7px', height: '7px', borderRadius: '50%', background: statusConfig[a.status]?.dot, pointerEvents: 'none', zIndex: 1 }} />
                          <select
                            value={a.status}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateStatus(a._id, e.target.value)}
                            style={{
                              appearance: 'none', paddingLeft: '24px', paddingRight: '28px', paddingTop: '6px', paddingBottom: '6px',
                              borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                              border: `1px solid ${statusConfig[a.status]?.border}`,
                              background: statusConfig[a.status]?.bg,
                              color: statusConfig[a.status]?.color,
                              cursor: 'pointer', outline: 'none',
                              fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.2px',
                            }}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown size={11} style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: statusConfig[a.status]?.color }} />
                        </div>
                      </td>

                      {/* Actions (Accept/Reject/Delete) */}
                      <td style={{ padding: '15px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {a.status === 'Pending' && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); updateStatus(a._id, 'Confirmed'); }}
                                title="Accept Appointment"
                                style={{
                                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                                  borderRadius: '8px', padding: '7px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.2s', color: '#15803d'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); updateStatus(a._id, 'Cancelled'); }}
                                title="Reject Appointment"
                                style={{
                                  background: '#fff7ed', border: '1px solid #fed7aa',
                                  borderRadius: '8px', padding: '7px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.2s', color: '#ea580c'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ffedd5'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff7ed'}
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                          <button
                            className="delete-btn"
                            onClick={(e) => { e.stopPropagation(); deleteAppointment(a._id); }}
                            title="Delete Record"
                            style={{
                              background: '#fef2f2', border: '1px solid #fecaca',
                              borderRadius: '8px', padding: '7px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Trash2 size={14} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Detail Panel ── */}
        {selected && (
          <div style={{
            background: 'white', borderRadius: '16px',
            border: '1px solid #f0e8df', boxShadow: '0 2px 12px rgba(169,124,82,0.06)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            {/* Panel Header */}
            <div style={{ background: 'linear-gradient(135deg, #1a2332, #2d3f55)', padding: '24px 20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #5168AF, #3d4f8a)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #5168AF, #3d4f8a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}>
                  <span style={{ color: 'white', fontSize: '20px', fontWeight: '700', fontFamily: "'Source Sans 3', sans-serif" }}>
                    {selected.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: '700', color: 'white', margin: '0 0 4px' }}>{selected.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusConfig[selected.status]?.dot }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{selected.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Body */}
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>

              {/* Info Items */}
              {[
                { icon: Mail, label: 'Email', value: selected.email },
                { icon: Phone, label: 'Phone', value: selected.phone },
                { icon: Briefcase, label: 'Service', value: selected.service },
                { icon: Clock, label: 'Preferred Date', value: selected.date },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fdf8f4', border: '1px solid #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="#5168AF" />
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px', fontFamily: "'Source Sans 3', sans-serif" }}>{label}</p>
                    <p style={{ fontSize: '13px', color: '#1a2332', fontWeight: '500', margin: 0, fontFamily: "'Source Sans 3', sans-serif" }}>{value || '—'}</p>
                  </div>
                </div>
              ))}

              {/* Message */}
              {selected.message && (
                <div style={{ marginTop: '4px' }}>
                  <p style={{ fontSize: '10px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px', fontFamily: "'Source Sans 3', sans-serif" }}>Notes</p>
                  <div style={{ background: '#fdf8f4', border: '1px solid #f0e8df', borderRadius: '10px', padding: '12px 14px' }}>
                    <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.7', margin: 0, fontFamily: "'Source Sans 3', sans-serif" }}>{selected.message}</p>
                  </div>
                </div>
              )}

              {/* Change Status */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0e8df' }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px', fontFamily: "'Source Sans 3', sans-serif" }}>Update Status</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)} style={{
                      padding: '9px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                      border: `1px solid ${selected.status === s ? statusConfig[s].border : '#e5e7eb'}`,
                      background: selected.status === s ? statusConfig[s].bg : 'white',
                      color: selected.status === s ? statusConfig[s].color : '#9ca3af',
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.2px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: selected.status === s ? statusConfig[s].dot : '#d1d5db' }} />
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteAppointment(selected._id)}
                style={{
                  marginTop: '12px', width: '100%', padding: '10px',
                  background: 'white', border: '1px solid #fecaca',
                  borderRadius: '8px', color: '#dc2626', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: "'Source Sans 3', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
              >
                <Trash2 size={14} /> Delete Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
