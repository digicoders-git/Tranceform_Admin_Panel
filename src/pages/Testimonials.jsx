import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, Plus, Trash2, Pencil, X, Check, User, Quote } from 'lucide-react';
import API_URL from '../config';

const API = API_URL;

/* ── Modal ── */
const Modal = ({ testimonial, onClose, onSave }) => {
  const [form, setForm] = useState(testimonial || { name: '', text: '' });
  const [saving, setSaving] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e8ddd4',
    borderRadius: '10px', fontSize: '13px', color: '#0a0f1a',
    outline: 'none', boxSizing: 'border-box', background: '#fdfaf7',
    fontFamily: "'Source Sans 3', sans-serif", transition: 'border-color 0.2s',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,26,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', overflow: 'hidden' }}>

        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a2332, #2d3f55)', padding: '20px 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #5168AF, #3d4f8a)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(201,149,106,0.2)', border: '1px solid rgba(201,149,106,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={16} color="#5168AF" />
              </div>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: '600', color: 'white', margin: 0 }}>
                {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>✕ Close</button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
              <User size={12} color="#5168AF" /> Client Name *
            </label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              placeholder="e.g. John Doe — Happy Soul"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#5168AF'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
              <Quote size={12} color="#5168AF" /> Testimonial Text *
            </label>
            <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} required rows={5}
              placeholder="Write the client's review here..."
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#5168AF'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'}
            />
          </div>

          {/* Stars Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '12px 14px', background: '#fdf8f4', borderRadius: '10px', border: '1px solid #f0e8df' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />)}
            </div>
            <span style={{ fontSize: '12px', color: '#b8a090', fontWeight: '500' }}>5-star rating will be shown</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #f0e8df' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 22px', borderRadius: '10px', border: '1px solid #e8ddd4', background: 'white', color: '#6b7280', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: saving ? '#d4a574' : '#5168AF', color: 'white', fontSize: '13px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: "'Source Sans 3', sans-serif" }}>
              <Check size={14} /> {saving ? 'Saving...' : 'Save Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const Testimonials = () => {
  const { token } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/testimonials`, { headers })
      .then(res => { setTestimonials(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async (form) => {
    if (modal === 'add') {
      const res = await axios.post(`${API}/api/testimonials`, form, { headers });
      setTestimonials(prev => [res.data, ...prev]);
    } else {
      const res = await axios.put(`${API}/api/testimonials/${modal._id}`, form, { headers });
      setTestimonials(prev => prev.map(t => t._id === modal._id ? res.data : t));
    }
    setModal(null);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await axios.delete(`${API}/api/testimonials/${id}`, { headers });
    setTestimonials(prev => prev.filter(t => t._id !== id));
  };

  const filtered = testimonials.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.text?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '44px', height: '44px', border: '3px solid #f3ede6', borderTop: '3px solid #5168AF', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      <p style={{ color: '#5168AF', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .t-card:hover { box-shadow: 0 8px 28px rgba(169,124,82,0.12) !important; transform: translateY(-2px); }
        .t-card { transition: all 0.2s ease !important; }
        .edit-btn:hover { background: #5168AF !important; color: white !important; border-color: #5168AF !important; }
        .edit-btn:hover svg { color: white !important; }
        .del-btn:hover { background: #dc2626 !important; }
        .del-btn:hover svg { color: white !important; }
      `}</style>

      {modal && <Modal testimonial={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={save} />}

      <div className="page-header">
        <div className="page-header-inner">
          <div className="title-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '28px', background: 'linear-gradient(to bottom, #5168AF, #3d4f8a)', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '26px', fontWeight: '700', color: '#0a0f1a', margin: 0 }}>
                Testimonials
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 0 13px' }}>
              Manage client reviews and success stories
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Stats */}
            <div style={{ background: '#f4f6f9', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#0a0f1a', fontFamily: "'Source Sans 3', sans-serif" }}>{testimonials.length}</div>
              <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Reviews</div>
            </div>
            <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '2px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={12} color="#f59e0b" fill="#f59e0b" />)}
              </div>
              <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>All 5-Star</div>
            </div>
            {/* Add Button */}
            <button onClick={() => setModal('add')} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #5168AF, #3d4f8a)',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '11px 20px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(169,124,82,0.35)',
              fontFamily: "'Source Sans 3', sans-serif",
            }}>
              <Plus size={16} /> Add Testimonial
            </button>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', maxWidth: '360px' }}>
        <Star size={15} color="#5168AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search by name or review..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px 10px 40px',
            border: '1.5px solid #e8ddd4', borderRadius: '10px',
            fontSize: '13px', color: '#0a0f1a', outline: 'none',
            background: 'white', boxSizing: 'border-box',
            fontFamily: "'Source Sans 3', sans-serif",
          }}
          onFocus={e => e.target.style.borderColor = '#5168AF'}
          onBlur={e => e.target.style.borderColor = '#e8ddd4'}
        />
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fdf8f4', border: '2px dashed #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Star size={28} color="#d4b896" />
          </div>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', color: '#5168AF', margin: '0 0 6px', fontWeight: '600' }}>
            {search ? 'No testimonials match your search' : 'No testimonials yet'}
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 20px' }}>
            {search ? 'Try a different keyword' : 'Add your first client review'}
          </p>
          {!search && (
            <button onClick={() => setModal('add')} style={{ background: '#5168AF', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add Testimonial
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
          {filtered.map(t => (
            <div key={t._id} className="t-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 8px rgba(169,124,82,0.06)', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Top — Stars + Quote Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fdf8f4', border: '1px solid #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Quote size={14} color="#5168AF" />
                </div>
              </div>

              {/* Review Text */}
              <p style={{
                fontSize: '13px', color: '#1a2035', lineHeight: '1.75', margin: 0,
                display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                fontStyle: 'italic', flex: 1,
              }}>
                "{t.text}"
              </p>

              {/* Divider */}
              <div style={{ height: '1px', background: '#f0e8df' }} />

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #5168AF, #3d4f8a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(169,124,82,0.3)', flexShrink: 0,
                  }}>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: '700', fontFamily: "'Source Sans 3', sans-serif" }}>
                      {t.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0a0f1a', fontFamily: "'Source Sans 3', sans-serif" }}>{t.name}</span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="edit-btn" onClick={() => setModal(t)} style={{
                    background: 'white', border: '1.5px solid #e8ddd4',
                    borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '11px', fontWeight: '600', color: '#374151',
                    transition: 'all 0.2s', fontFamily: "'Source Sans 3', sans-serif",
                  }}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button className="del-btn" onClick={() => del(t._id)} style={{
                    background: '#fef2f2', border: '1.5px solid #fecaca',
                    borderRadius: '8px', padding: '6px 8px', cursor: 'pointer',
                    display: 'flex', transition: 'all 0.2s',
                  }}>
                    <Trash2 size={13} color="#dc2626" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;
