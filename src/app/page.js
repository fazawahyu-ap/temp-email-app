// app/page.js
'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [tempEmail, setTempEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fungsi untuk membuat email baru
  const generateEmail = async () => {
    setLoading(true);
    setMessages([]);
    setSelectedMessage(null);
    try {
      const response = await fetch('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
      const data = await response.json();
      setTempEmail(data[0]);
    } catch (error) {
      console.error("Gagal membuat email:", error);
      alert("Gagal membuat email. Coba lagi.");
    }
    setLoading(false);
  };

  // Fungsi untuk memeriksa email secara berkala
  useEffect(() => {
    if (!tempEmail) return;

    const interval = setInterval(async () => {
      try {
        const [login, domain] = tempEmail.split('@');
        const response = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
        const data = await response.json();
        if (data.length > messages.length) {
           setMessages(data);
        }
      } catch (error) {
        console.error("Gagal memeriksa pesan:", error);
      }
    }, 5000); // Periksa setiap 5 detik

    return () => clearInterval(interval); // Hentikan interval saat komponen di-unmount
  }, [tempEmail, messages.length]);

  // Fungsi untuk melihat detail email
  const viewMessage = async (id) => {
      const [login, domain] = tempEmail.split('@');
      const response = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
      const data = await response.json();
      setSelectedMessage(data);
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>📧 Email Sementara Gratis</h1>

      <button onClick={generateEmail} disabled={loading}>
        {loading ? 'Membuat...' : 'Buat Alamat Email Baru'}
      </button>

      {tempEmail && (
        <div style={{ marginTop: '20px' }}>
          <h3>Alamat Email Anda:</h3>
          <p style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            <b>{tempEmail}</b>
          </p>
        </div>
      )}

      <hr style={{margin: '20px 0'}} />

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
            <h2>Kotak Masuk</h2>
            {messages.length === 0 && tempEmail && <p>Menunggu email masuk...</p>}
            <ul>
                {messages.map(msg => (
                    <li key={msg.id} onClick={() => viewMessage(msg.id)} style={{cursor: 'pointer', borderBottom: '1px solid #ccc', padding: '8px'}}>
                        <b>Dari:</b> {msg.from} <br/>
                        <b>Subjek:</b> {msg.subject}
                    </li>
                ))}
            </ul>
        </div>

        {selectedMessage && (
            <div style={{ flex: 2, borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
                <h2>Isi Email</h2>
                <p><b>Dari:</b> {selectedMessage.from}</p>
                <p><b>Subjek:</b> {selectedMessage.subject}</p>
                <p><b>Tanggal:</b> {selectedMessage.date}</p>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: selectedMessage.htmlBody || selectedMessage.textBody }} />
            </div>
        )}
      </div>

    </div>
  );
}