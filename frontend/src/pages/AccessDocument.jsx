import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function AccessDocument() {
  const { token } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/documents/access/${token}`)
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || 'Access denied'))
      .finally(() => setLoading(false));
  }, [token]);

  const timeLeft = data ? Math.max(0, Math.floor((new Date(data.expiresAt) - Date.now()) / 60000)) : 0;

  return (
    <div style={s.page}>
      {/* Top strip */}
      <div style={s.strip}>Government of India &nbsp;|&nbsp; Ministry of Digital Affairs</div>

      {/* Header */}
      <div style={s.header}>
        <button onClick={() => nav(-1)} style={s.backBtn}>← Go Back</button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={s.headerTitle}>🏛️ SECURE DOCUMENT PORTAL</div>
          <div style={s.headerSub}>Secure Document Access</div>
        </div>
        <div style={{ width: 100 }} />
      </div>

      <div style={s.center}>
        {loading && (
          <div style={s.card}>
            <div style={{ textAlign: 'center', color: '#888', padding: 40 }}>⏳ Verifying access token...</div>
          </div>
        )}

        {error && (
          <div style={s.card}>
            <div style={s.errorBox}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⛔</div>
              <h3 style={{ color: '#e74c3c', margin: '0 0 8px' }}>Access Denied</h3>
              <p style={{ color: '#888', margin: 0 }}>{error}</p>
            </div>
            <button onClick={() => nav('/')} style={s.btn}>← Return to Home</button>
          </div>
        )}

        {data && (
          <div style={s.card}>
            {/* Status */}
            <div style={s.statusBar}>
              <span style={s.activeBadge}>✅ Access Granted</span>
              <span style={{ fontSize: 13, color: '#888' }}>⏱ {timeLeft} min remaining</span>
            </div>

            <h3 style={s.docName}>📄 {data.originalName}</h3>
            <div style={s.metaGrid}>
              <div style={s.metaItem}><span style={s.metaKey}>Expires</span><span>{new Date(data.expiresAt).toLocaleString('en-IN')}</span></div>
              <div style={s.metaItem}><span style={s.metaKey}>Consent Video</span><span>{data.consentUrl ? '✅ Available' : '❌ Not provided'}</span></div>
            </div>

            <a href={data.fileUrl} target="_blank" rel="noreferrer" style={s.downloadBtn}>
              📥 Download Document
            </a>

            {data.consentUrl && (
              <>
                <h4 style={s.videoTitle}>🎥 Consent Video Recording</h4>
                <video src={data.consentUrl} controls style={s.video} />
              </>
            )}

            <div style={s.warningBox}>
              ⚠️ This document access is logged and monitored. Unauthorised sharing is prohibited under IT Act 2000.
            </div>
          </div>
        )}
      </div>

      <footer style={s.footer}>© 2025 Secure Document Portal | Government of India</footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' },
  strip: { background: '#002060', color: '#fff', padding: '5px 32px', fontSize: 11, textAlign: 'right', letterSpacing: 0.5 },
  header: { background: '#003580', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center' },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '7px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 13 },
  headerTitle: { fontWeight: 'bold', fontSize: 17 },
  headerSub: { fontSize: 11, opacity: 0.7, marginTop: 2 },
  center: { flex: 1, display: 'flex', justifyContent: 'center', padding: '36px 16px' },
  card: { background: '#fff', borderRadius: 10, padding: '28px', width: 640, boxShadow: '0 4px 20px rgba(0,0,0,0.09)', borderTop: '4px solid #003580', height: 'fit-content' },
  errorBox: { textAlign: 'center', padding: '32px 16px' },
  statusBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #eee' },
  activeBadge: { background: '#e8f5e9', color: '#27ae60', padding: '5px 14px', borderRadius: 12, fontWeight: '700', fontSize: 13 },
  docName: { color: '#003580', fontSize: 18, margin: '0 0 16px' },
  metaGrid: { display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  metaKey: { fontSize: 11, color: '#aaa', fontWeight: '600', textTransform: 'uppercase' },
  downloadBtn: { display: 'inline-block', padding: '11px 24px', background: '#003580', color: '#fff', borderRadius: 5, textDecoration: 'none', fontWeight: '700', fontSize: 14, marginBottom: 24 },
  videoTitle: { color: '#003580', margin: '0 0 10px', fontSize: 15 },
  video: { width: '100%', borderRadius: 6, border: '1px solid #eee', marginBottom: 20 },
  warningBox: { background: '#fffde7', border: '1px solid #f9ca24', borderRadius: 5, padding: '10px 14px', fontSize: 12, color: '#7d6608' },
  btn: { width: '100%', padding: '11px', background: '#003580', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: '700', fontSize: 14, marginTop: 8 },
  footer: { background: '#002060', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '12px', fontSize: 12 },
};