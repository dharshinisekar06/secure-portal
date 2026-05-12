import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  { icon: '🔐', title: 'OTP Authentication', desc: 'Secure login via email OTP — no passwords stored' },
  { icon: '📄', title: 'Document Upload', desc: 'Upload docs with optional consent video proof' },
  { icon: '🔗', title: 'Secure Links', desc: 'Time-limited UUID-based access links' },
  { icon: '📋', title: 'Audit Logs', desc: 'Every access attempt is recorded in MongoDB' },
];

export default function Home() {
  const nav = useNavigate();
  return (
    <div style={s.page}>
      <Navbar subtitle="सुरक्षित दस्तावेज़ पोर्टल — Government Document Verification & Sharing System" />

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.badge}>OFFICIAL GOVERNMENT PORTAL</div>
        <h1 style={s.heroTitle}>Secure Document Verification &amp; Sharing System</h1>
        <p style={s.heroDesc}>
          A trusted platform for uploading, verifying, and securely sharing official documents
          with consent-based access control and time-limited secure links.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => nav('/login')} style={s.primaryBtn}>Login / Register →</button>
          <button onClick={() => nav('/help')} style={s.outlineBtn}>Learn More</button>
        </div>
      </div>

      {/* Feature cards */}
      <div style={s.cards}>
        {features.map(f => (
          <div key={f.title} style={s.card}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
            <div style={s.cardTitle}>{f.title}</div>
            <div style={s.cardDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Info bar */}
      <div style={s.infoBar}>
        <span>🔒 256-bit Encrypted</span>
        <span>⏱️ Auto-expiry Links</span>
        <span>📁 Audit Trail</span>
        <span>🏛️ Govt. of India Compliant</span>
      </div>

      <footer style={s.footer}>© 2025 Secure Document Portal | Government of India | All Rights Reserved</footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' },
  hero: { background: 'linear-gradient(135deg, #003580 0%, #154890 100%)', color: '#fff', textAlign: 'center', padding: '56px 24px' },
  badge: { display: 'inline-block', background: '#e07b00', color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, padding: '4px 14px', borderRadius: 2, marginBottom: 16 },
  heroTitle: { fontSize: 26, fontWeight: '700', margin: '0 0 14px', maxWidth: 600, marginInline: 'auto' },
  heroDesc: { color: 'rgba(255,255,255,0.82)', fontSize: 15, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 },
  primaryBtn: { padding: '12px 32px', background: '#e07b00', color: '#fff', border: 'none', borderRadius: 4, fontSize: 15, cursor: 'pointer', fontWeight: '700' },
  outlineBtn: { padding: '12px 32px', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 4, fontSize: 15, cursor: 'pointer' },
  cards: { display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', padding: '40px 32px 24px' },
  card: { background: '#fff', borderRadius: 8, padding: '24px 20px', width: 210, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', borderTop: '4px solid #003580' },
  cardTitle: { fontWeight: '700', color: '#003580', marginBottom: 8, fontSize: 14 },
  cardDesc: { fontSize: 13, color: '#666', lineHeight: 1.5 },
  infoBar: { background: '#003580', color: '#fff', display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', padding: '14px 32px', fontSize: 13, fontWeight: '600' },
  footer: { background: '#002060', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '14px', fontSize: 12, marginTop: 'auto' },
};