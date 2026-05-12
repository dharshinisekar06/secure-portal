import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    API.get('/user/profile').then(r => { setUser(r.data); setName(r.data.name); });
    API.get('/user/activity').then(r => setActivity(r.data));
  }, []);

  const save = async () => {
    const { data } = await API.put('/user/profile', { name });
    setUser(data);
    localStorage.setItem('user', JSON.stringify({ ...data }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={s.page}>
      <Navbar subtitle="Government Document Verification System" />
      <div style={s.content}>
        <div style={s.grid}>
          {/* Profile Card */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>👤 My Profile</h3>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() || '?'}</div>
            <label style={s.label}>Full Name</label>
            <input style={s.input} value={name} onChange={e => setName(e.target.value)} />
            <label style={s.label}>Email</label>
            <input style={{ ...s.input, background: '#f5f5f5', color: '#999' }} value={user?.email || ''} disabled />
            <label style={s.label}>Role</label>
            <input style={{ ...s.input, background: '#f5f5f5', color: '#999' }} value={user?.role || ''} disabled />
            <label style={s.label}>Member Since</label>
            <input style={{ ...s.input, background: '#f5f5f5', color: '#999' }} value={user ? new Date(user.createdAt).toLocaleDateString('en-IN') : ''} disabled />
            {saved && <div style={{ color: '#27ae60', fontSize: 13, marginBottom: 8 }}>✅ Saved!</div>}
            <button onClick={save} style={s.btn}>Save Changes</button>
          </div>

          {/* Activity */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>📋 Recent Activity</h3>
            {activity.length === 0 && <p style={{ color: '#888', fontSize: 13 }}>No activity yet.</p>}
            {activity.map(a => (
              <div key={a._id} style={s.actItem}>
                <span style={{ ...s.badge, background: a.action.includes('DENIED') ? '#fdecea' : '#e8f5e9', color: a.action.includes('DENIED') ? '#e74c3c' : '#27ae60' }}>
                  {a.action}
                </span>
                <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{new Date(a.createdAt).toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{a.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer style={s.footer}>© 2025 Secure Document Portal | Government of India</footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' },
  content: { maxWidth: 900, margin: '0 auto', padding: '28px 24px', flex: 1, width: '100%', boxSizing: 'border-box' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  card: { background: '#fff', borderRadius: 10, padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderTop: '4px solid #003580' },
  cardTitle: { color: '#003580', margin: '0 0 20px', fontSize: 16, borderBottom: '1px solid #eee', paddingBottom: 10 },
  avatar: { width: 64, height: 64, borderRadius: '50%', background: '#003580', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: '700', margin: '0 auto 20px' },
  label: { display: 'block', fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 5, textTransform: 'uppercase' },
  input: { width: '100%', padding: '9px 12px', border: '1.5px solid #ddd', borderRadius: 5, marginBottom: 14, fontSize: 14, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#003580', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: '700', fontSize: 14 },
  actItem: { padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  badge: { fontSize: 11, fontWeight: '700', padding: '2px 8px', borderRadius: 10 },
  footer: { background: '#002060', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '12px', fontSize: 12 },
};