import { useEffect, useState } from 'react';
import API from '../services/api';

export default function NotificationBell() {
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifs();
    const t = setInterval(fetchNotifs, 30000);
    return () => clearInterval(t);
  }, []);

  const fetchNotifs = async () => {
    try { const { data } = await API.get('/notifications'); setNotifs(data); } catch {}
  };

  const markRead = async () => {
    await API.put('/notifications/read-all');
    setNotifs(n => n.map(x => ({ ...x, isRead: true })));
  };

  const unread = notifs.filter(n => !n.isRead).length;

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => { setOpen(!open); if (!open) markRead(); }}
        style={{ cursor: 'pointer', fontSize: 20, position: 'relative', padding: '0 6px' }}>
        🔔
        {unread > 0 && (
          <span style={{ position: 'absolute', top: -4, right: 0, background: '#e74c3c', color: '#fff', borderRadius: '50%', fontSize: 9, width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {unread}
          </span>
        )}
      </div>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 34, width: 290, background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', borderRadius: 6, zIndex: 999, maxHeight: 320, overflowY: 'auto' }}>
          <div style={{ padding: '10px 16px', fontWeight: 'bold', color: '#003580', borderBottom: '1px solid #eee', fontSize: 13 }}>🔔 Notifications</div>
          {notifs.length === 0
            ? <div style={{ padding: 16, color: '#999', fontSize: 13 }}>No notifications</div>
            : notifs.map(n => (
              <div key={n._id} style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', background: n.isRead ? '#fff' : '#f0f4ff', fontSize: 13 }}>
                {n.message}
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{new Date(n.createdAt).toLocaleString('en-IN')}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}