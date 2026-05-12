import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const steps = [
  { icon: '📧', title: '1. Register / Login', desc: 'Enter your full name and email address. An OTP (One-Time Password) will be sent to your email. Enter the OTP to securely log in — no password needed.' },
  { icon: '📤', title: '2. Upload Document', desc: 'Go to Dashboard → Upload. Select your document (PDF or Image) and optionally attach a consent video. Set how many hours the link should remain active.' },
  { icon: '🔗', title: '3. Share Secure Link', desc: 'After upload, copy the secure link from your Dashboard. Share it directly with the recipient via email or message. Each link is unique and time-limited.' },
  { icon: '👁', title: '4. Recipient Access', desc: 'The recipient opens the link. If within the expiry time, they can view and download the document. All access attempts are logged automatically.' },
  { icon: '🗑', title: '5. Auto Deletion', desc: 'Expired documents and their files are automatically deleted from the server every 30 minutes via a scheduled cron job. No manual cleanup needed.' },
];

const faqs = [
  ['What file types are supported?', 'PDF, JPG, PNG, and other image formats. Video files (MP4, WebM) for consent recordings.'],
  ['Is the link truly secure?', 'Yes. Each link uses a UUID token and is valid only until the expiry time you set. Access is logged.'],
  ['Can I delete a document early?', 'Yes. Go to Dashboard and click Delete on any document to immediately remove it and revoke access.'],
  ['What happens after the link expires?', 'The link becomes invalid and the file is automatically deleted from the server within 30 minutes.'],
];

export default function Help() {
  const nav = useNavigate();
  return (
    <div style={s.page}>
      <Navbar subtitle="Help & User Guide" />

      <div style={s.content}>
        <h2 style={s.pageTitle}>Help & Instructions</h2>

        {/* Steps */}
        <div style={s.stepsGrid}>
          {steps.map(step => (
            <div key={step.title} style={s.stepCard}>
              <div style={s.stepIcon}>{step.icon}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <div style={s.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h3 style={{ color: '#003580', margin: '36px 0 16px', fontSize: 17 }}>Frequently Asked Questions</h3>
        <div style={s.faqs}>
          {faqs.map(([q, a]) => (
            <div key={q} style={s.faqItem}>
              <div style={s.faqQ}>❓ {q}</div>
              <div style={s.faqA}>{a}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={s.cta}>
          <p style={{ margin: '0 0 14px', color: '#555' }}>Ready to get started?</p>
          <button onClick={() => nav('/login')} style={s.ctaBtn}>Login / Register →</button>
          <button onClick={() => nav('/')} style={s.ctaGhost}>← Back to Home</button>
        </div>
      </div>

      <footer style={s.footer}>© 2025 Secure Document Portal | Government of India</footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' },
  content: { maxWidth: 820, margin: '0 auto', padding: '36px 24px', flex: 1, width: '100%', boxSizing: 'border-box' },
  pageTitle: { color: '#003580', fontSize: 22, margin: '0 0 24px', fontWeight: '700' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 },
  stepCard: { background: '#fff', borderRadius: 8, padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.07)', borderTop: '3px solid #003580' },
  stepIcon: { fontSize: 28, marginBottom: 10 },
  stepTitle: { fontWeight: '700', color: '#003580', fontSize: 14, marginBottom: 8 },
  stepDesc: { color: '#666', fontSize: 13, lineHeight: 1.65 },
  faqs: { display: 'flex', flexDirection: 'column', gap: 12 },
  faqItem: { background: '#fff', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' },
  faqQ: { fontWeight: '700', color: '#003580', fontSize: 14, marginBottom: 6 },
  faqA: { color: '#666', fontSize: 13, lineHeight: 1.6 },
  cta: { textAlign: 'center', padding: '36px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  ctaBtn: { padding: '11px 32px', background: '#003580', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: '700', fontSize: 14 },
  ctaGhost: { padding: '10px 32px', background: 'transparent', color: '#003580', border: '1.5px solid #003580', borderRadius: 5, cursor: 'pointer', fontSize: 14 },
  footer: { background: '#002060', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '12px', fontSize: 12 },
};