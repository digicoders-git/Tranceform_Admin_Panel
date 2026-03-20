import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Check, ShieldCheck, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

import API_URL from '../config';

const API = API_URL;

/* ── Toast ── */
const Toast = ({ msg, type }) => (
  <div style={{
    position: 'fixed', bottom: '28px', right: '28px', zIndex: 999,
    display: 'flex', alignItems: 'center', gap: '10px',
    background: type === 'success' ? '#f0fdf4' : '#fef2f2',
    border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
    color: type === 'success' ? '#15803d' : '#b91c1c',
    padding: '14px 20px', borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    fontSize: '14px', fontWeight: '600', fontFamily: "'Source Sans 3', sans-serif",
    animation: 'slideUp 0.3s ease',
  }}>
    {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
    {msg}
    <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
  </div>
);

/* ── Password Field ── */
const PasswordField = ({ label, value, onChange, placeholder, show, onToggle, error }) => (
  <div>
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
      <Lock size={11} color="#5168AF" /> {label}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value} onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 44px 12px 14px',
          border: `1.5px solid ${error ? '#fca5a5' : '#e8ddd4'}`,
          borderRadius: '10px', fontSize: '14px', color: '#0a0f1a',
          outline: 'none', boxSizing: 'border-box', background: '#fdfaf7',
          fontFamily: "'Source Sans 3', sans-serif", transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#5168AF'}
        onBlur={e => e.target.style.borderColor = error ? '#fca5a5' : '#e8ddd4'}
      />
      <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
    {error && (
      <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

/* ── Main Page ── */
const Settings = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    axios.get(`${API}/api/auth/profile`, { headers })
      .then(res => {
        setProfile(res.data);
        setForm(prev => ({ ...prev, name: res.data.name || '', email: res.data.email || '' }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword)
      return showToast('New passwords do not match', 'error');
    if (form.newPassword && form.newPassword.length < 6)
      return showToast('New password must be at least 6 characters', 'error');

    setSaving(true);
    try {
      const payload = {
        name: form.name, email: form.email,
        currentPassword: form.currentPassword,
        ...(form.newPassword && { newPassword: form.newPassword }),
      };
      const res = await axios.put(`${API}/api/auth/profile`, payload, { headers });
      setProfile({ name: res.data.name, email: res.data.email });
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const passwordMismatch = form.confirmPassword && form.newPassword !== form.confirmPassword;
  const passwordStrength = form.newPassword.length === 0 ? null : form.newPassword.length < 6 ? 'weak' : form.newPassword.length < 10 ? 'medium' : 'strong';
  const strengthConfig = { weak: { color: '#dc2626', label: 'Weak', width: '33%' }, medium: { color: '#d97706', label: 'Medium', width: '66%' }, strong: { color: '#16a34a', label: 'Strong', width: '100%' } };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '44px', height: '44px', border: '3px solid #f3ede6', borderTop: '3px solid #5168AF', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      <p style={{ color: '#5168AF', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(169,124,82,0.5) !important; }
        .save-btn { transition: all 0.2s ease !important; }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0e8df', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '3px', height: '24px', background: 'linear-gradient(to bottom, #5168AF, #3d4f8a)', borderRadius: '2px' }} />
            <h2 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '24px', fontWeight: '700', color: '#0a0f1a', margin: 0 }}>Settings</h2>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 0 13px' }}>Manage your admin account credentials</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#f4f6f9', padding: '4px', borderRadius: '12px', border: '1px solid #f0e8df' }}>
          {['profile', 'security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? '#5168AF' : '#9ca3af',
                boxShadow: activeTab === tab ? '0 2px 8px rgba(81,104,175,0.1)' : 'none',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Two Column Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '24px', alignItems: 'start' }}>

        {/* ── Left — Profile Card ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Avatar Card */}
          <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', borderRadius: '24px', padding: '36px 24px', position: 'relative', overflow: 'hidden', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #5168AF, #3d4f8a)' }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div style={{ position: 'relative' }}>
              {/* Avatar */}
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #5168AF, #3d4f8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 0 4px rgba(81,104,175,0.15)' }}>
                <span style={{ color: 'white', fontSize: '30px', fontWeight: '700', fontFamily: "'Source Sans 3', sans-serif" }}>
                  {(profile.name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', fontWeight: '700', color: 'white', margin: '0 0 4px' }}>
                {profile.name || 'Administrator'}
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 14px' }}>{profile.email}</p>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '20px', padding: '4px 12px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Active</span>
              </div>
            </div>
          </div>

          {/* Info Tiles */}
          {[
            { icon: User, label: 'Display Name', value: profile.name || 'Administrator' },
            { icon: Mail, label: 'Email', value: profile.email },
            { icon: ShieldCheck, label: 'Role', value: 'Super Admin' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ background: 'white', borderRadius: '12px', border: '1px solid #f0e8df', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 4px rgba(169,124,82,0.05)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fdf8f4', border: '1px solid #f0e8df', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color="#5168AF" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#0a0f1a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right — Form ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {activeTab === 'profile' ? (
            /* Profile Info */
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 8px rgba(169,124,82,0.06)', overflow: 'hidden', animation: 'slideUp 0.3s ease' }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid #f9f5f1', background: '#fdf8f4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={15} color="#5168AF" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#3d4f8a', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Profile Information</span>
              </div>
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Display Name', key: 'name', type: 'text', placeholder: 'Administrator', icon: User },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'admin@tranceform.com', icon: Mail },
                ].map(({ label, key, type, placeholder, icon: Icon }) => (
                  <div key={key}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b8a090', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
                      <Icon size={11} color="#5168AF" /> {label}
                    </label>
                    <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder} required={key === 'email'}
                      style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e8ddd4', borderRadius: '10px', fontSize: '14px', color: '#0a0f1a', outline: 'none', boxSizing: 'border-box', background: '#fdfaf7', fontFamily: "'Source Sans 3', sans-serif", transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#5168AF'}
                      onBlur={e => e.target.style.borderColor = '#e8ddd4'}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Change Password */
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0e8df', boxShadow: '0 2px 8px rgba(169,124,82,0.06)', overflow: 'hidden', animation: 'slideUp 0.3s ease' }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid #f9f5f1', background: '#fdf8f4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={15} color="#5168AF" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#3d4f8a', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Change Password</span>
              </div>
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <PasswordField
                  label="Current Password *" value={form.currentPassword}
                  onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  show={show.current} onToggle={() => setShow(s => ({ ...s, current: !s.current }))}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <PasswordField
                      label="New Password" value={form.newPassword}
                      onChange={e => setForm({ ...form, newPassword: e.target.value })}
                      placeholder="Min. 6 characters"
                      show={show.new} onToggle={() => setShow(s => ({ ...s, new: !s.new }))}
                    />
                    {/* Strength Bar */}
                    {passwordStrength && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ height: '4px', background: '#f0e8df', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: strengthConfig[passwordStrength].width, background: strengthConfig[passwordStrength].color, borderRadius: '4px', transition: 'width 0.3s' }} />
                        </div>
                        <p style={{ fontSize: '11px', color: strengthConfig[passwordStrength].color, fontWeight: '600', margin: '4px 0 0' }}>
                          {strengthConfig[passwordStrength].label} password
                        </p>
                      </div>
                    )}
                  </div>

                  <PasswordField
                    label="Confirm Password" value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    show={show.confirm} onToggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                    error={passwordMismatch ? 'Passwords do not match' : null}
                  />
                </div>

                {/* Hint */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#fdf8f4', border: '1px solid #f0e8df', borderRadius: '10px', padding: '12px 14px' }}>
                  <ShieldCheck size={15} color="#5168AF" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '12px', color: '#3d4f8a', margin: 0, lineHeight: '1.6' }}>
                    Leave new password fields empty if you only want to update your name or email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="save-btn" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: saving ? '#64748b' : '#EE6F36',
              color: 'white', border: 'none', borderRadius: '12px',
              padding: '13px 36px', fontSize: '14px', fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(238,111,54,0.25)',
              fontFamily: "'Source Sans 3', sans-serif",
            }}>
              {saving ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Saving...
                </>
              ) : (
                <><Check size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
