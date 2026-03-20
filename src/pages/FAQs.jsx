import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Plus, Trash2, Pencil, Check, ChevronDown, Tag, MessageCircle, AlignLeft } from 'lucide-react';
import API_URL from '../config';

const API = API_URL;

/* ── Modal ── */
const Modal = ({ faq, onClose, onSave }) => {
  const [form, setForm] = useState(faq || { category: '', question: '', answer: '' });
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

  const fields = [
    { label: 'Category', key: 'category', placeholder: 'e.g. General, Services, Pricing', icon: Tag },
    { label: 'Question', key: 'question', placeholder: 'e.g. What is hypnotherapy?', icon: MessageCircle },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,26,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', overflow: 'hidden' }}>

        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a2332, #2d3f55)', padding: '20px 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #5168AF, #3d4f8a)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(201,149,106,0.2)', border: '1px solid rgba(201,149,106,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpCircle size={16} color="#5168AF" />
              </div>
              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', fontWeight: '600', color: 'white', margin: 0 }}>
                {faq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>✕ Close</button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ padding: '24px' }}>
          {fields.map(({ label, key, placeholder, icon: Icon }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
                <Icon size={12} color="#5168AF" /> {label} *
              </label>
              <input type="text" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required
                placeholder={placeholder} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#5168AF'}
                onBlur={e => e.target.style.borderColor = '#e8ddd4'}
              />
            </div>
          ))}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
              <AlignLeft size={12} color="#5168AF" /> Answer *
            </label>
            <textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} required rows={5}
              placeholder="Write a detailed, helpful answer..."
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#5168AF'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #f0e8df' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 22px', borderRadius: '10px', border: '1px solid #e8ddd4', background: 'white', color: '#6b7280', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: saving ? '#d4a574' : '#5168AF', color: 'white', fontSize: '13px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: "'Source Sans 3', sans-serif" }}>
              <Check size={14} /> {saving ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const FAQs = () => {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/faqs`, { headers })
      .then(res => { setFaqs(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async (form) => {
    if (modal === 'add') {
      const res = await axios.post(`${API}/api/faqs`, form, { headers });
      setFaqs(prev => [res.data, ...prev]);
    } else {
      const res = await axios.put(`${API}/api/faqs/${modal._id}`, form, { headers });
      setFaqs(prev => prev.map(f => f._id === modal._id ? res.data : f));
    }
    setModal(null);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    await axios.delete(`${API}/api/faqs/${id}`, { headers });
    setFaqs(prev => prev.filter(f => f._id !== id));
    if (openId === id) setOpenId(null);
  };

  const categories = ['All', ...new Set(faqs.map(f => f.category || 'General'))];

  const filtered = faqs.filter(f => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const matchSearch = f.question?.toLowerCase().includes(search.toLowerCase()) ||
      f.answer?.toLowerCase().includes(search.toLowerCase()) ||
      f.category?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = filtered.reduce((acc, faq) => {
    const cat = faq.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

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
        .faq-row:hover { background: #fdf8f4 !important; }
        .edit-btn:hover { background: #5168AF !important; color: white !important; border-color: #5168AF !important; }
        .edit-btn:hover svg { color: white !important; }
        .del-btn:hover { background: #dc2626 !important; }
        .del-btn:hover svg { color: white !important; }
        .cat-btn:hover { border-color: #5168AF !important; color: #5168AF !important; }
      `}</style>

      {modal && <Modal faq={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={save} />}

      <div className="page-header">
        <div className="page-header-inner">
          <div className="title-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '28px', background: 'linear-gradient(to bottom, #5168AF, #3d4f8a)', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '26px', fontWeight: '700', color: '#0a0f1a', margin: 0 }}>
                FAQs
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 0 13px' }}>
              Manage frequently asked questions
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Stats */}
            <div style={{ background: '#f4f6f9', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#0a0f1a', fontFamily: "'Source Sans 3', sans-serif" }}>{faqs.length}</div>
              <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Total FAQs</div>
            </div>
            <div style={{ background: '#fdf8f4', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#5168AF', fontFamily: "'Source Sans 3', sans-serif" }}>{categories.length - 1}</div>
              <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Categories</div>
            </div>
            <button onClick={() => setModal('add')} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #5168AF, #3d4f8a)',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '11px 20px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(169,124,82,0.35)',
              fontFamily: "'Source Sans 3', sans-serif",
            }}>
              <Plus size={16} /> Add FAQ
            </button>
          </div>
        </div>
      </div>

      {/* ── Search + Category Filter ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '340px' }}>
          <HelpCircle size={15} color="#5168AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search questions or answers..."
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

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} className="cat-btn" onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
              border: activeCategory === cat ? '1px solid #5168AF' : '1px solid #e5e7eb',
              background: activeCategory === cat ? '#5168AF' : 'white',
              color: activeCategory === cat ? 'white' : '#6b7280',
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Source Sans 3', sans-serif",
            }}>
              {cat}
              <span style={{
                marginLeft: '6px', fontSize: '11px', fontWeight: '700',
                background: activeCategory === cat ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                color: activeCategory === cat ? 'white' : '#9ca3af',
                padding: '1px 7px', borderRadius: '10px',
              }}>
                {cat === 'All' ? faqs.length : faqs.filter(f => f.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── FAQ List ── */}
      {filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fdf8f4', border: '2px dashed #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <HelpCircle size={28} color="#d4b896" />
          </div>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', color: '#5168AF', margin: '0 0 6px', fontWeight: '600' }}>
            {search || activeCategory !== 'All' ? 'No FAQs match your filter' : 'No FAQs yet'}
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 20px' }}>
            {search || activeCategory !== 'All' ? 'Try a different search or category' : 'Add your first FAQ to get started'}
          </p>
          {!search && activeCategory === 'All' && (
            <button onClick={() => setModal('add')} style={{ background: '#5168AF', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add FAQ
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>

              {/* Category Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fdf8f4', border: '1px solid #f0e8df', borderRadius: '8px', padding: '6px 14px' }}>
                  <Tag size={12} color="#5168AF" />
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#3d4f8a', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Source Sans 3', sans-serif" }}>{category}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>{items.length} question{items.length !== 1 ? 's' : ''}</span>
                <div style={{ flex: 1, height: '1px', background: '#f0e8df' }} />
              </div>

              {/* Accordion Card */}
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 8px rgba(169,124,82,0.06)', overflow: 'hidden' }}>
                {items.map((faq, i) => (
                  <div key={faq._id} style={{ borderBottom: i < items.length - 1 ? '1px solid #faf7f4' : 'none' }}>

                    {/* Question Row */}
                    <div
                      className="faq-row"
                      onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '18px 20px', cursor: 'pointer', gap: '12px',
                        borderLeft: openId === faq._id ? '3px solid #5168AF' : '3px solid transparent',
                        background: openId === faq._id ? '#fdf8f4' : 'white',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        {/* Number */}
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                          background: openId === faq._id ? '#5168AF' : '#fdf8f4',
                          border: `1px solid ${openId === faq._id ? '#5168AF' : '#f0e8df'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: openId === faq._id ? 'white' : '#5168AF', fontFamily: "'Source Sans 3', sans-serif" }}>
                            {i + 1}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '14px', fontWeight: '600', fontFamily: "'Source Sans 3', sans-serif",
                          color: openId === faq._id ? '#5168AF' : '#0a0f1a',
                          transition: 'color 0.15s', lineHeight: '1.4',
                        }}>
                          {faq.question}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button className="edit-btn" onClick={e => { e.stopPropagation(); setModal(faq); }} style={{
                          background: 'white', border: '1.5px solid #e8ddd4', borderRadius: '8px',
                          padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          gap: '5px', fontSize: '11px', fontWeight: '600', color: '#374151',
                          transition: 'all 0.2s', fontFamily: "'Source Sans 3', sans-serif",
                        }}>
                          <Pencil size={12} /> Edit
                        </button>
                        <button className="del-btn" onClick={e => { e.stopPropagation(); del(faq._id); }} style={{
                          background: '#fef2f2', border: '1.5px solid #fecaca',
                          borderRadius: '8px', padding: '5px 8px', cursor: 'pointer',
                          display: 'flex', transition: 'all 0.2s',
                        }}>
                          <Trash2 size={13} color="#dc2626" />
                        </button>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '8px',
                          background: openId === faq._id ? '#fdf8f4' : '#f4f6f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}>
                          <ChevronDown size={15} color="#9ca3af" style={{ transform: openId === faq._id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }} />
                        </div>
                      </div>
                    </div>

                    {/* Answer */}
                    {openId === faq._id && (
                      <div style={{ padding: '0 20px 20px 60px', borderTop: '1px solid #faf7f4' }}>
                        <div style={{ background: '#fdf8f4', border: '1px solid #f0e8df', borderRadius: '12px', padding: '14px 16px', marginTop: '12px' }}>
                          <p style={{ fontSize: '13px', color: '#1a2035', lineHeight: '1.8', margin: 0, fontFamily: "'Source Sans 3', sans-serif" }}>
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQs;
