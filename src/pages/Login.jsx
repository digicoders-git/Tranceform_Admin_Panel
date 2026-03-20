import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import API_URL from '../config';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      login(res.data.token);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-left">

        {/* Subtle pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        {/* Gold accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#5168AF' }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '320px' }}>
          <div style={{
            margin: '0 auto 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img 
              src="/image.png" 
              alt="Logo" 
              style={{ width: '180px', height: 'auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }} 
            />
          </div>

          <h1 style={{ color: 'white', fontSize: '28px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' }}>
            Tranceform<br />Hypnotherapy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.7', marginBottom: '48px' }}>
            Manage your appointments, blogs, testimonials and more from one place.
          </p>

          {/* Features */}
          {[
            'Appointment Management',
            'Blog & Content Editor',
            'Client Messages Inbox',
            'Testimonials & FAQs',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', textAlign: 'left' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(201,149,106,0.2)', border: '1px solid rgba(201,149,106,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5168AF' }} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <p style={{ position: 'absolute', bottom: '28px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', letterSpacing: '1px' }}>
          © 2024 TRANCEFORM HYPNOTHERAPY
        </p>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="login-right">
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div className="mobile-logo-section" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img 
              src="/image.png" 
              alt="Logo" 
              style={{ width: '140px', height: 'auto', margin: '0 auto 14px' }} 
            />
            <h1 style={{ fontSize: '20px', fontFamily: "'Source Sans 3', sans-serif", color: '#111827', fontWeight: '700' }}>Admin Portal</h1>
          </div>
          {/* Form Card */}
          <div className="login-form-card">
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <ShieldCheck size={18} color="#5168AF" />
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#5168AF', letterSpacing: '2px', textTransform: 'uppercase' }}>Secure Login</span>
              </div>
              <h2 style={{ fontSize: '24px', fontFamily: "'Source Sans 3', sans-serif", color: '#111827', fontWeight: '700', margin: 0 }}>Welcome back</h2>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px' }}>Sign in to your admin account</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="admin@tranceform.com"
                    style={{
                      width: '100%', padding: '12px 14px 12px 42px',
                      border: '1.5px solid #e5e7eb', borderRadius: '10px',
                      fontSize: '13.5px', color: '#111827', outline: 'none',
                      transition: 'border 0.15s', boxSizing: 'border-box',
                      background: '#fafafa',
                    }}
                    onFocus={e => e.target.style.borderColor = '#5168AF'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '12px 44px 12px 42px',
                      border: '1.5px solid #e5e7eb', borderRadius: '10px',
                      fontSize: '13.5px', color: '#111827', outline: 'none',
                      transition: 'border 0.15s', boxSizing: 'border-box',
                      background: '#fafafa',
                    }}
                    onFocus={e => e.target.style.borderColor = '#5168AF'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', padding: '12px 14px', borderRadius: '10px', marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px',
                  background: loading ? '#64748b' : '#EE6F36',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s', letterSpacing: '0.3px',
                  boxShadow: '0 4px 12px rgba(238,111,54,0.2)'
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#d95d2c'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#EE6F36'; }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>

            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '24px' }}>
            © 2024 Tranceform Hypnotherapy. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
