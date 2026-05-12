import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const BACK_MAP = {
  '/upload': '/dashboard',
  '/help': '/',
  '/dashboard': '/',
};

export default function Navbar({ title = 'SECURE DOCUMENT PORTAL', subtitle }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const backTo = Object.keys(BACK_MAP).find(k => pathname.startsWith(k));
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuth = !!localStorage.getItem('token');

  const logout = () => { localStorage.clear(); nav('/'); };

  return (
    <>
      {/* Top strip */}
      <div style={s.strip}>Government of India &nbsp;|&nbsp; Ministry of Digital Affairs</div>

      {/* Main header */}
      <div style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {backTo && (
            <button onClick={() => nav(BACK_MAP[backTo])} style={s.backBtn}>
              ← Back
            </button>
          )}
          <div>
            <div style={s.title}>🏛️ {title}</div>
            {subtitle && <div style={s.sub}>{subtitle}</div>}
          </div>
        </div>

        {isAuth && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, opacity: 0.85 }}>
              👤 {user.name || user.email}
            </span>
            <NotificationBell />

            {pathname !== '/upload' && (
              <button onClick={() => nav('/upload')} style={s.btn('#fff', '#003580')}>
                + Upload
              </button>
            )}

            <button onClick={logout} style={s.btn('#e74c3c', '#fff')}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Orange nav bar */}
      <div style={s.navBar}>
        {[
          ['Home', '/'],
          ['Dashboard', '/dashboard'],
          ['Profile', '/profile'], // ✅ added
          ['Help', '/help']
        ].map(([label, path]) => (
          <span
            key={label}
            onClick={() => nav(path)}
            style={{
              ...s.navLink,
              borderBottom: pathname === path ? '2px solid #fff' : 'none',
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </>
  );
}

const s = {
  strip: {
    background: '#002060',
    color: '#fff',
    padding: '5px 32px',
    fontSize: 11,
    textAlign: 'right',
    letterSpacing: 0.5
  },
  header: {
    background: '#003580',
    color: '#fff',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: { fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 },
  sub: { fontSize: 11, opacity: 0.75, marginTop: 2 },
  backBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    whiteSpace: 'nowrap'
  },
  navBar: {
    background: '#e07b00',
    padding: '8px 32px',
    display: 'flex',
    gap: 28
  },
  navLink: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    cursor: 'pointer',
    paddingBottom: 2,
    letterSpacing: 0.3
  },
  btn: (bg, color) => ({
    background: bg,
    color,
    border: `1px solid ${bg === '#fff' ? '#003580' : bg}`,
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: '600'
  }),
};