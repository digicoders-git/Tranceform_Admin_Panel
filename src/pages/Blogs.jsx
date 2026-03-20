import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Plus, Trash2, Pencil, X, Check, Clock, Tag, AlignLeft, Image, Hash } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API = 'http://localhost:5000';
const empty = { id: '', title: '', category: '', date: '', readTime: '', image: '', excerpt: '', content: '' };

const Field = ({ label, name, placeholder, icon: Icon, value, onChange, type = 'text', required = false, inputStyle }) => (
  <div style={{ marginBottom: '18px' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
      {Icon && <Icon size={12} color="#5168AF" />} {label}
    </label>
    {type === 'textarea' ? (
      <textarea name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder} rows={3}
        style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
        onFocus={e => e.target.style.borderColor = '#5168AF'}
        onBlur={e => e.target.style.borderColor = '#e8ddd4'}
      />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder} style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#5168AF'}
        onBlur={e => e.target.style.borderColor = '#e8ddd4'}
      />
    )}
  </div>
);

/* ── Modal ── */
const Modal = ({ blog, onClose, onSave, token }) => {
  const [form, setForm] = useState(blog || empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(blog?.image || '');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleContentChange = (content) => setForm(prev => ({ ...prev, content }));

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await axios.post(`${API}/api/upload`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setForm(prev => ({ ...prev, image: `http://localhost:5000${res.data.url}` }));
      setPreview(`http://localhost:5000${res.data.url}`);
    } catch {
      alert('Image upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const submit = async e => {
    e.preventDefault();
    if (!form.content || form.content.trim() === '<p><br></p>' || form.content.trim() === '') {
      alert('Full Content is required');
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #e8ddd4',
    borderRadius: '12px', fontSize: '14px', color: '#0a0f1a',
    outline: 'none', boxSizing: 'border-box', background: '#fdfaf7',
    fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,26,0.65)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '94vh', overflow: 'hidden', boxShadow: '0 32px 100px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', animation: 'modalIn 0.3s ease-out' }}>
        <style>{`@keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>

        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a2332, #2d3f55)', padding: '24px 30px', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, #5168AF, #3d4f8a)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color="#6e85ff" />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', fontWeight: '700', color: 'white', margin: 0 }}>
                  {blog ? 'Edit Blog Post' : 'Create New Post'}
                </h3>
                <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fill in the details below</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={submit} style={{ padding: '30px', overflowY: 'auto', flex: 1, background: '#fcfaf7' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Blog Title *" name="title" value={form.title} onChange={handle} placeholder="Enter a compelling title..." icon={AlignLeft} required inputStyle={inputStyle} />
            </div>
            
            <Field label="Slug / ID *" name="id" value={form.id} onChange={handle} placeholder="e.g. understanding-anxiety" icon={Hash} required inputStyle={inputStyle} />
            <Field label="Category *" name="category" value={form.category} onChange={handle} placeholder="e.g. Anxiety & Stress" icon={Tag} required inputStyle={inputStyle} />
            
            <Field label="Publish Date" name="date" value={form.date} onChange={handle} placeholder="e.g. March 19, 2025" icon={Clock} inputStyle={inputStyle} />
            <Field label="Read Time" name="readTime" value={form.readTime} onChange={handle} placeholder="e.g. 5 min read" icon={Clock} inputStyle={inputStyle} />
          </div>

          {/* Image Upload Area */}
          <div style={{ marginBottom: '24px', marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              <Image size={12} color="#5168AF" /> Cover Image
            </label>

            {preview ? (
              <div style={{ position: 'relative', marginBottom: '15px', borderRadius: '16px', overflow: 'hidden', height: '300px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '4px solid white' }}>
                <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 30%)' }} />
                <button type="button" onClick={() => { setPreview(''); setForm(prev => ({ ...prev, image: '' })); }}
                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(220, 38, 38, 0.9)', border: 'none', borderRadius: '8px', padding: '6px 12px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trash2 size={14} /> Remove Image
                </button>
              </div>
            ) : (
              <label style={{ display: 'block', cursor: 'pointer', marginBottom: '15px' }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <div style={{
                  border: '2px dashed #d1c1b5', borderRadius: '16px', padding: '40px 20px',
                  textAlign: 'center', background: '#fdfaf7', transition: 'all 0.3s ease',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                    <Plus size={24} color="#5168AF" />
                  </div>
                  {uploading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '18px', height: '18px', border: '2px solid #5168AF', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <span style={{ fontWeight: '600', color: '#5168AF' }}>Uploading image...</span>
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a2332' }}>Click to upload cover image</p>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#b8a090' }}>Supports JPG, PNG, WebP (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </label>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e8ddd4' }} />
              <span style={{ fontSize: '11px', color: '#b8a090', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>OR External URL</span>
              <div style={{ flex: 1, height: '1px', background: '#e8ddd4' }} />
            </div>
            <input type="text" name="image" value={form.image} onChange={e => { handle(e); setPreview(e.target.value); }}
              placeholder="e.g. https://images.unsplash.com/photo-12345..."
              style={{ ...inputStyle }}
            />
          </div>

          <Field label="Excerpt *" name="excerpt" value={form.excerpt} onChange={handle} type="textarea" placeholder="Short description for listing..." icon={AlignLeft} required inputStyle={inputStyle} />

          {/* Content */}
          <div style={{ marginBottom: '24px', marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              <AlignLeft size={12} color="#5168AF" /> Full Blog Story *
            </label>
            <div className="rich-text-editor" style={{ borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #e8ddd4', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <ReactQuill 
                theme="snow"
                value={form.content}
                onChange={handleContentChange}
                modules={modules}
                placeholder="Start writing your amazing content here..."
                style={{ height: '400px', marginBottom: '45px' }}
              />
            </div>
          </div>

          <style>{`
            .rich-text-editor .ql-container.ql-snow { border: none !important; font-family: 'Source Sans 3', sans-serif; font-size: 15px; }
            .rich-text-editor .ql-toolbar.ql-snow { border: none !important; border-bottom: 1.5px solid #e8ddd4 !important; background: #fdfaf7; padding: 12px 15px !important; }
            .rich-text-editor .ql-editor { padding: 25px !important; min-height: 400px; line-height: 1.7; color: #1a2332; }
            .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover { color: #5168AF !important; }
          `}</style>
        </form>

        {/* Footer */}
        <div style={{ padding: '20px 30px', background: 'white', borderTop: '1px solid #e8ddd4', display: 'flex', gap: '15px', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={{ padding: '12px 25px', borderRadius: '12px', border: '1.5px solid #e8ddd4', background: 'white', color: '#6b7280', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="submit" disabled={saving} onClick={submit} style={{ padding: '12px 30px', borderRadius: '12px', border: 'none', background: saving ? '#9aa8d6' : 'linear-gradient(135deg, #5168AF, #3d4f8a)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 15px rgba(81,104,175,0.25)' }}>
            {saving ? 'Saving...' : (blog ? 'Update Blog' : 'Publish Blog')}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const Blogs = () => {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/blogs`, { headers })
      .then(res => { setBlogs(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const saveBlog = async (form) => {
    if (modal === 'add') {
      const res = await axios.post(`${API}/api/blogs`, form, { headers });
      setBlogs(prev => [res.data, ...prev]);
    } else {
      const res = await axios.put(`${API}/api/blogs/${modal._id}`, form, { headers });
      setBlogs(prev => prev.map(b => b._id === modal._id ? res.data : b));
    }
    setModal(null);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    await axios.delete(`${API}/api/blogs/${id}`, { headers });
    setBlogs(prev => prev.filter(b => b._id !== id));
  };

  const filtered = blogs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
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
        .blog-card:hover { box-shadow: 0 8px 28px rgba(169,124,82,0.12) !important; transform: translateY(-2px); }
        .blog-card { transition: all 0.2s ease !important; }
        .edit-btn:hover { background: #5168AF !important; color: white !important; border-color: #5168AF !important; }
        .edit-btn:hover svg { color: white !important; }
        .del-btn:hover { background: #dc2626 !important; }
        .del-btn:hover svg { color: white !important; }
      `}</style>

      {modal && <Modal blog={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={saveBlog} token={token} />}

      {/* ── Page Header ── */}
      <div style={{ borderBottom: '1px solid #f0e8df', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '28px', background: 'linear-gradient(to bottom, #5168AF, #3d4f8a)', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '26px', fontWeight: '700', color: '#0a0f1a', margin: 0 }}>
                Blog Posts
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 0 13px' }}>
              Create and manage your blog content
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Stats */}
            <div style={{ background: '#f4f6f9', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#0a0f1a', fontFamily: "'Source Sans 3', sans-serif" }}>{blogs.length}</div>
              <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Total Posts</div>
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
              <Plus size={16} /> Add Blog Post
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div style={{ position: 'relative', maxWidth: '360px' }}>
        <BookOpen size={15} color="#5168AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search by title or category..."
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

      {/* ── Blog Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fdf8f4', border: '2px dashed #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <BookOpen size={28} color="#d4b896" />
          </div>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', color: '#5168AF', margin: '0 0 6px', fontWeight: '600' }}>
            {search ? 'No blogs match your search' : 'No blog posts yet'}
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 20px' }}>
            {search ? 'Try a different keyword' : 'Click "Add Blog Post" to create your first post'}
          </p>
          {!search && (
            <button onClick={() => setModal('add')} style={{ background: '#5168AF', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add Blog Post
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
          {filtered.map(b => (
            <div key={b._id} className="blog-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 8px rgba(169,124,82,0.06)', overflow: 'hidden' }}>

              {/* Image */}
              <div style={{ height: '250px', overflow: 'hidden', background: 'linear-gradient(135deg, #fdf8f4, #f0e8df)', position: 'relative' }}>
                {b.image ? (
                  <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={36} color="#d4b896" />
                  </div>
                )}
                {/* Category Badge */}
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.95)', color: '#3d4f8a', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {b.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '18px' }}>
                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  {b.date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} color="#b8a090" />
                      <span style={{ fontSize: '11px', color: '#b8a090', fontWeight: '500' }}>{b.date}</span>
                    </div>
                  )}
                  {b.readTime && (
                    <span style={{ fontSize: '11px', color: '#b8a090', fontWeight: '500' }}>· {b.readTime}</span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', fontWeight: '600', color: '#0a0f1a', margin: '0 0 8px', lineHeight: '1.5' }}>
                  {b.title}
                </h3>

                {/* Excerpt */}
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 16px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {b.excerpt}
                </p>

                {/* Divider */}
                <div style={{ height: '1px', background: '#f0e8df', marginBottom: '14px' }} />

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="edit-btn" onClick={() => setModal(b)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    background: 'white', border: '1.5px solid #e8ddd4', borderRadius: '9px',
                    padding: '9px', fontSize: '12px', fontWeight: '600', color: '#374151',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Source Sans 3', sans-serif",
                  }}>
                    <Pencil size={13} /> Edit Post
                  </button>
                  <button className="del-btn" onClick={() => deleteBlog(b._id)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fef2f2', border: '1.5px solid #fecaca',
                    borderRadius: '9px', padding: '9px 13px', cursor: 'pointer', transition: 'all 0.2s',
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

export default Blogs;
