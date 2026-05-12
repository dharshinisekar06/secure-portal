import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendOTP = async () => {
    if (!email || !name) return setError('Please fill in all fields');
    setLoading(true); setError('');
    try {
      await API.post('/auth/send-otp', { email, name });
      setStep(2); setMsg(`OTP sent to ${email}`); setCooldown(60);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOTP = async () => {
    if (!otp) return setError('Enter the OTP');
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Replace nav('/dashboard') with:
      const role = data.user.role;
      nav(role === 'admin' ? '/admin' : '/dashboard');
    } catch (e) {
      setError(e.response?.data?.error || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.strip}>Government of India &nbsp;|&nbsp; Ministry of Digital Affairs</div>
      <div style={s.header}>
        <button onClick={() => nav('/')} style={s.backBtn}>← Back to Home</button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={s.headerTitle}>🏛️ SECURE DOCUMENT PORTAL</div>
          <div style={s.headerSub}>Government Document Verification System</div>
        </div>
        <div style={{ width: 110 }} />
      </div>

      <div style={s.center}>
        <div style={s.card}>
          <div style={s.steps}>
            <div style={{ ...s.step, ...(step >= 1 ? s.stepActive : {}) }}>
              <div style={s.stepDot}>1</div><span>Identity</span>
            </div>
            <div style={s.stepLine} />
            <div style={{ ...s.step, ...(step >= 2 ? s.stepActive : {}) }}>
              <div style={s.stepDot}>2</div><span>Verify OTP</span>
            </div>
          </div>

          {error && <div style={s.err}>⚠️ {error}</div>}

          {step === 1 ? <>
            <h3 style={s.cardTitle}>Enter Your Details</h3>
            <p style={s.cardSub}>An OTP will be sent to your email address</p>
            <label style={s.label}>Full Name</label>
            <input style={s.input} placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
            <label style={s.label}>Email Address</label>
            <input style={s.input} placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} type="email" />
            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={sendOTP} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP →'}
            </button>
          </> : <>
            <h3 style={s.cardTitle}>Enter OTP</h3>
            <p style={{ ...s.cardSub, color: '#27ae60' }}>✅ {msg}</p>
            <label style={s.label}>One-Time Password</label>
            <input style={{ ...s.input, fontSize: 22, letterSpacing: 8, textAlign: 'center' }}
              placeholder="_ _ _ _ _ _" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={verifyOTP} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#666' }}>
              {cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : <span style={{ color: '#003580', cursor: 'pointer', fontWeight: '600' }} onClick={sendOTP}>Resend OTP</span>}
            </div>
            <button style={s.ghost} onClick={() => { setStep(1); setOtp(''); setError(''); }}>← Change Email</button>
          </>}
        </div>
        <p style={{ color: '#999', fontSize: 12, marginTop: 16 }}>🔒 Secured by 256-bit encryption. OTP valid for 5 minutes.</p>
      </div>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' },
  strip: { background: '#002060', color: '#fff', padding: '5px 32px', fontSize: 11, textAlign: 'right', letterSpacing: 0.5 },
  header: { background: '#003580', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center' },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '7px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' },
  headerTitle: { fontWeight: 'bold', fontSize: 17, letterSpacing: 0.5 },
  headerSub: { fontSize: 11, opacity: 0.7, marginTop: 2 },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  card: { background: '#fff', borderRadius: 10, padding: '32px 28px', width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', borderTop: '4px solid #003580' },
  steps: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, gap: 8 },
  step: { display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 11, color: '#aaa', gap: 4 },
  stepActive: { color: '#003580', fontWeight: '700' },
  stepDot: { width: 28, height: 28, borderRadius: '50%', background: '#003580', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' },
  stepLine: { width: 40, height: 2, background: '#ddd', marginBottom: 16 },
  cardTitle: { margin: '0 0 4px', color: '#003580', fontSize: 17 },
  cardSub: { color: '#888', fontSize: 13, marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: { width: '100%', padding: '10px 12px', marginBottom: 16, border: '1.5px solid #ddd', borderRadius: 5, boxSizing: 'border-box', fontSize: 14 },
  btn: { width: '100%', padding: '11px', background: '#003580', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: '700', fontSize: 14, marginTop: 4 },
  ghost: { width: '100%', padding: '9px', background: 'transparent', color: '#003580', border: '1px solid #003580', borderRadius: 5, cursor: 'pointer', fontSize: 13, marginTop: 10 },
  err: { background: '#fdecea', color: '#c0392b', padding: '8px 12px', borderRadius: 4, marginBottom: 12, fontSize: 13 }
};