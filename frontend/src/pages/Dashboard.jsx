import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');
  const nav = useNavigate();

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    try {
      const { data } = await API.get('/documents');
      setDocs(data);
    } catch { nav('/'); }
    finally { setLoading(false); }
  };

  const deleteDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await API.delete(`/documents/${id}`);
    fetchDocs();
  };

  const copyLink = (token) => {
    navigator.clipboard.writeText(`${window.location.origin}/access/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(''), 2000);
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div style={s.page}>
      <Navbar subtitle="Government Document Verification System" />

      <div style={s.content}>
        {/* Stats row */}
        <div style={s.stats}>
          {[
            { label: 'Total Documents', value: docs.length, icon: '📄' },
            { label: 'Active', value: docs.filter(d => !isExpired(d.expiresAt)).length, icon: '✅' },
            { label: 'Expired', value: docs.filter(d => isExpired(d.expiresAt)).length, icon: '⏱️' },
            { label: 'With Consent', value: docs.filter(d => d.consentVideoPath).length, icon: '🎥' },
          ].map(st => (
            <div key={st.label} style={s.statCard}>
              <div style={{ fontSize: 26 }}>{st.icon}</div>
              <div style={s.statVal}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div style={s.row}>
          <h3 style={s.sectionTitle}>My Documents</h3>
          <button onClick={() => nav('/upload')} style={s.uploadBtn}>+ Upload New Document</button>
        </div>

        {loading && <p style={{ color: '#888' }}>Loading...</p>}
        {!loading && docs.length === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: 48 }}>📂</div>
            <p>No documents uploaded yet.</p>
            <button onClick={() => nav('/upload')} style={s.uploadBtn}>Upload your first document</button>
          </div>
        )}

        {docs.map(doc => {
          const expired = isExpired(doc.expiresAt);
          return (
            <div key={doc._id} style={{ ...s.card, borderLeft: `4px solid ${expired ? '#e74c3c' : '#27ae60'}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={s.docName}>📄 {doc.originalName}</span>
                  <span
                    style={{
                        ...s.badge,
                        background: expired ? '#fdecea' : '#eafaf1',
                        color: expired ? '#e74c3c' : '#2ecc71'
                    }}
                    >
                    {expired ? '⏱ Expired' : '✅ Active'}
                    </span>
                  {doc.consentVideoPath && <span style={{ ...s.badge, background: '#e8f5e9', color: '#27ae60' }}>🎥 Consent</span>}
                </div>
                <div style={s.meta}>
                  Expires: {new Date(doc.expiresAt).toLocaleString('en-IN')}
                </div>
                <div style={s.token}>🔑 {doc.secureToken?.slice(0, 24)}...</div>
              </div>
              <div style={s.actions}>
                <button onClick={() => copyLink(doc.secureToken)} style={s.btn('#003580', '#fff')}>
                  {copied === doc.secureToken ? '✅ Copied!' : '🔗 Copy Link'}
                </button>
                <button onClick={() => nav(`/access/${doc.secureToken}`)} style={s.btn('#154890', '#fff')}>👁 View</button>
                <button onClick={() => deleteDoc(doc._id)} style={s.btn('#e74c3c', '#fff')}>🗑 Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      <footer style={s.footer}>© 2025 Secure Document Portal | Government of India</footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' },
  content: { maxWidth: 900, margin: '0 auto', padding: '28px 24px', flex: 1, width: '100%', boxSizing: 'border-box' },
  stats: { display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' },
  statCard: { background: '#fff', borderRadius: 8, padding: '16px 24px', textAlign: 'center', flex: 1, minWidth: 120, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', borderTop: '3px solid #003580' },
  statVal: { fontSize: 26, fontWeight: '700', color: '#003580', margin: '4px 0 2px' },
  statLabel: { fontSize: 12, color: '#888' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 },
  sectionTitle: { color: '#003580', margin: 0, fontSize: 17, fontWeight: '700' },
  uploadBtn: { background: '#003580', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 5, cursor: 'pointer', fontWeight: '600', fontSize: 13 },
  empty: { textAlign: 'center', padding: '48px 16px', color: '#888', background: '#fff', borderRadius: 8 },
  card: { background: '#fff', padding: '16px 20px', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' },
  docName: { fontWeight: '700', color: '#003580', fontSize: 15 },
  badge: { fontSize: 11, fontWeight: '700', padding: '3px 10px', borderRadius: 12 },
  meta: { fontSize: 12, color: '#888', marginTop: 5 },
  token: { fontSize: 11, color: '#aaa', fontFamily: 'monospace', marginTop: 3 },
  actions: { display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' },
  btn: (bg, color) => ({ background: bg, color, border: 'none', padding: '7px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: '600' }),
  footer: { background: '#002060', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '12px', fontSize: 12 },
};