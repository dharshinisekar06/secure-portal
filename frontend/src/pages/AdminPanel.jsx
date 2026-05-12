import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function AdminPanel() {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [docs, setDocs] = useState([]);
  const [logs, setLogs] = useState([]);
  const nav = useNavigate();

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'docs') fetchDocs();
    if (tab === 'logs') fetchLogs();
  }, [tab]);

  const fetchStats = async () => { const { data } = await API.get('/admin/stats'); setStats(data); };
  const fetchUsers = async () => { const { data } = await API.get('/admin/users'); setUsers(data); };
  const fetchDocs = async () => { const { data } = await API.get('/admin/documents'); setDocs(data); };
  const fetchLogs = async () => { const { data } = await API.get('/admin/logs'); setLogs(data); };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await API.delete(`/admin/users/${id}`); fetchUsers();
  };

  const deleteDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await API.delete(`/admin/documents/${id}`); fetchDocs(); fetchStats();
  };

  const logout = () => { localStorage.clear(); nav('/'); };

  return (
    <div style={s.page}>
      <div style={s.strip}>Government of India &nbsp;|&nbsp; Ministry of Digital Affairs</div>
      <div style={s.header}>
        <div style={s.title}>🏛️ SECURE DOCUMENT PORTAL — ADMIN</div>
        <button onClick={logout} style={s.logoutBtn}>Logout</button>
      </div>
      <div style={s.navBar}>
        {[['stats','📊 Dashboard'],['users','👥 Users'],['docs','📄 Documents'],['logs','📋 Audit Logs']].map(([key, label]) => (
          <span key={key} onClick={() => setTab(key)}
            style={{ ...s.navLink, borderBottom: tab === key ? '2px solid #fff' : 'none' }}>{label}</span>
        ))}
      </div>

      <div style={s.content}>
        {/* STATS */}
        {tab === 'stats' && stats && (
          <>
            <h3 style={s.sectionTitle}>System Overview</h3>
            <div style={s.statsRow}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
                { label: 'Total Documents', value: stats.totalDocs, icon: '📄' },
                { label: 'Active Docs', value: stats.activeDocs, icon: '✅' },
                { label: 'Expired Docs', value: stats.expiredDocs, icon: '⏱️' },
                { label: 'Audit Logs', value: stats.totalLogs, icon: '📋' },
              ].map(st => (
                <div key={st.label} style={s.statCard}>
                  <div style={{ fontSize: 28 }}>{st.icon}</div>
                  <div style={s.statVal}>{st.value}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <>
            <h3 style={s.sectionTitle}>All Users ({users.length})</h3>
            {users.map(u => (
              <div key={u._id} style={s.card}>
                <div style={{ flex: 1 }}>
                  <div style={s.cardTitle}>👤 {u.name}</div>
                  <div style={s.cardMeta}>{u.email} &nbsp;|&nbsp; Joined: {new Date(u.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <button onClick={() => deleteUser(u._id)} style={s.delBtn}>🗑 Delete</button>
              </div>
            ))}
          </>
        )}

        {/* DOCUMENTS */}
        {tab === 'docs' && (
          <>
            <h3 style={s.sectionTitle}>All Documents ({docs.length})</h3>
            {docs.map(d => (
              <div key={d._id} style={{ ...s.card, borderLeft: `4px solid ${d.expiresAt < new Date() ? '#e74c3c' : '#27ae60'}` }}>
                <div style={{ flex: 1 }}>
                  <div style={s.cardTitle}>📄 {d.originalName}</div>
                  <div style={s.cardMeta}>
                    By: {d.userId?.name || 'Unknown'} ({d.userId?.email}) &nbsp;|&nbsp;
                    Expires: {new Date(d.expiresAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <button onClick={() => deleteDoc(d._id)} style={s.delBtn}>🗑 Delete</button>
              </div>
            ))}
          </>
        )}

        {/* LOGS */}
        {tab === 'logs' && (
          <>
            <h3 style={s.sectionTitle}>Audit Logs ({logs.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr style={{ background: '#003580', color: '#fff' }}>
                    {['Action', 'Document ID', 'IP', 'Details', 'Time'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l, i) => (
                    <tr key={l._id} style={{ background: i % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                      <td style={s.td}><span style={{ ...s.actionBadge, background: l.action.includes('DENIED') ? '#fdecea' : l.action.includes('DELETE') ? '#fff3e0' : '#e8f5e9', color: l.action.includes('DENIED') ? '#e74c3c' : l.action.includes('DELETE') ? '#e67e22' : '#27ae60' }}>{l.action}</span></td>
                      <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 11 }}>{l.documentId?.toString().slice(-8) || '-'}</td>
                      <td style={s.td}>{l.ip}</td>
                      <td style={s.td}>{l.details}</td>
                      <td style={s.td}>{new Date(l.createdAt).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <footer style={s.footer}>© 2025 Secure Document Portal | Admin Console</footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' },
  strip: { background: '#002060', color: '#fff', padding: '5px 32px', fontSize: 11, textAlign: 'right' },
  header: { background: '#003580', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 18 },
  logoutBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 13 },
  navBar: { background: '#e07b00', padding: '8px 32px', display: 'flex', gap: 28 },
  navLink: { color: '#fff', fontWeight: '600', fontSize: 13, cursor: 'pointer', paddingBottom: 2 },
  content: { maxWidth: 1000, margin: '0 auto', padding: '28px 24px', flex: 1, width: '100%', boxSizing: 'border-box' },
  sectionTitle: { color: '#003580', borderBottom: '2px solid #003580', paddingBottom: 8, marginBottom: 20 },
  statsRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  statCard: { background: '#fff', borderRadius: 8, padding: '20px 24px', textAlign: 'center', flex: 1, minWidth: 140, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', borderTop: '3px solid #003580' },
  statVal: { fontSize: 28, fontWeight: '700', color: '#003580', margin: '6px 0 4px' },
  statLabel: { fontSize: 12, color: '#888' },
  card: { background: '#fff', padding: '14px 18px', borderRadius: 6, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderLeft: '4px solid #003580' },
  cardTitle: { fontWeight: '700', color: '#003580', fontSize: 14 },
  cardMeta: { fontSize: 12, color: '#888', marginTop: 3 },
  delBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 13 },
  td: { padding: '9px 14px', fontSize: 12, color: '#444', borderBottom: '1px solid #f0f0f0' },
  actionBadge: { padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: '700' },
  footer: { background: '#002060', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '12px', fontSize: 12 },
};