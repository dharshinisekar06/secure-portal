import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Upload() {
  const [doc, setDoc] = useState(null);
  const [video, setVideo] = useState(null);

  const [minutes, setMinutes] = useState(60); // ✅ fixed
  const [notifyBefore, setNotifyBefore] = useState('');

  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // 🔥 Notify options
  const getNotifyOptions = () => {
    const m = parseInt(minutes);
    const opts = [{ label: 'No notification', value: '' }];

    if (m >= 1) opts.push({ label: '30 seconds before', value: '30' });
    if (m >= 2) opts.push({ label: '1 minute before', value: '60' });
    if (m >= 5) opts.push({ label: '5 minutes before', value: '300' });
    if (m >= 30) opts.push({ label: '30 minutes before', value: '1800' });

    return opts;
  };

  const submit = async () => {
    if (!doc) return alert('Please select a document');

    setLoading(true);

    const fd = new FormData();
    fd.append('document', doc);

    if (video) fd.append('consent', video);

    fd.append('expiryMinutes', minutes);

    if (notifyBefore) fd.append('notifyBefore', notifyBefore);

    try {
      await API.post('/upload', fd);
      nav('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f0f4f8' }}>

      {/* Header */}
      <div style={s.header}>
        <div style={{ fontWeight: 'bold', fontSize: 18 }}>🏛️ SECURE DOCUMENT PORTAL</div>
        <button onClick={() => nav('/dashboard')} style={s.backBtn}>
          ← Dashboard
        </button>
      </div>

      <div style={s.container}>
        <h3 style={s.title}>Upload Document & Consent</h3>

        {/* File Inputs */}
        <input type="file" onChange={e => setDoc(e.target.files[0])} style={s.input} />
        <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} style={s.input} />

        {/* 🔥 Expiry Buttons */}
        <div style={{ marginBottom: 15 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[5, 10, 30, 60, 120, 300].map(m => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                style={{
                  ...s.expiryBtn,
                  ...(minutes === m ? s.expiryBtnActive : {})
                }}
              >
                {m}m
              </button>
            ))}
          </div>

          <input
            type="number"
            value={minutes}
            min={1}
            onChange={e => setMinutes(Number(e.target.value))}
            style={s.expiryInput}
          />
        </div>

        {/* 🔥 Info Box */}
        <div style={s.infoBox}>
          ⏱ Link will expire on:{' '}
          <strong>
            {new Date(Date.now() + minutes * 60000).toLocaleString('en-IN')}
          </strong>
        </div>

        {/* 🔥 Notify */}
        <select value={notifyBefore} onChange={e => setNotifyBefore(e.target.value)} style={s.input}>
          {getNotifyOptions().map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Submit */}
        <button onClick={submit} disabled={loading} style={s.btn}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>

      </div>
    </div>
  );
}


// 🔥 Styles
const s = {
  header: {
    background: '#003580',
    color: '#fff',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  backBtn: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    padding: '6px 12px',
    cursor: 'pointer'
  },
  container: {
    maxWidth: 500,
    margin: '40px auto',
    background: '#fff',
    padding: 30,
    borderRadius: 8
  },
  title: {
    marginBottom: 20,
    color: '#003580'
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 15
  },
  btn: {
    width: '100%',
    padding: 12,
    background: '#003580',
    color: '#fff',
    border: 'none'
  },
  expiryBtn: {
    padding: '6px 10px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer'
  },
  expiryBtnActive: {
    background: '#003580',
    color: '#fff'
  },
  expiryInput: {
    marginTop: 10,
    padding: 6,
    width: 100
  },
  infoBox: {
    background: '#f5f7fa',
    padding: 10,
    marginBottom: 15
  }
};