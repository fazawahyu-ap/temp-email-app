// app/page.js
'use client';

import { useState, useEffect } from 'react';

// --- DICTIONARY FOR LANGUAGES ---
const content = {
  en: {
    logo: "TempMail by Za",
    navBenefits: "Benefits",
    navHowItWorks: "How It Works",
    navFaq: "FAQ",
    heroHeadline: "Temporary Email, Permanent Privacy.",
    heroSubtitle: "Get a free anonymous email address in a flash. Protect your main inbox from spam.",
    generatorCardPlaceholder: "Your email address will appear here...",
    generatorButtonCreate: "Generate New Email",
    generatorButtonCreating: "Generating...",
    copyButton: "Copy",
    copiedButton: "Copied!",
    inboxTitle: "Inbox",
    inboxWaiting: "Waiting for incoming mail...",
    whatIsTitle: "What is a Temporary Email?",
    whatIsText: "A temporary email is a disposable, short-lived email address that doesn't require registration. Use it to sign up for online services without exposing your real email, avoiding spam and keeping your privacy intact.",
    benefitsTitle: "Main Benefits",
    benefit1Title: "Protect Privacy",
    benefit1Text: "Avoid giving your personal email to untrusted sites.",
    benefit2Title: "Spam-Free",
    benefit2Text: "Your main inbox will be clean from promotions and junk mail.",
    benefit3Title: "Free & Fast",
    benefit3Text: "No sign-up or payment needed. Get a new email in seconds.",
    benefit4Title: "Super Easy",
    benefit4Text: "Just one click to generate and use your new email address.",
    howItWorksTitle: "How It Works",
    step1Title: "Generate",
    step1Text: "Click the 'Generate New Email' button to instantly get a unique email address.",
    step2Title: "Use It",
    step2Text: "Copy and use the email address to register for any online service or app.",
    step3Title: "Check Inbox",
    step3Text: "Emails sent to that address will appear on this page instantly.",
    faqTitle: "Frequently Asked Questions (FAQ)",
    faq1Question: "How long is this email active?",
    faq1Answer: "The email address is active as long as this browser tab is open. Received emails are periodically deleted by the service provider.",
    faq2Question: "Is this service secure?",
    faq2Answer: "It's secure enough for general sign-ups. However, do not use it to receive sensitive data or important personal information.",
    faq3Question: "Can I send emails?",
    faq3Answer: "No. This service is designed only to receive emails, not to send them.",
    alertError: "Failed to generate email. The API service might be down. Please try again later.",
    messageFrom: "From",
    messageSubject: "Subject",
    messageDate: "Date"
  },
  id: {
    logo: "TempMail by Za",
    navBenefits: "Keuntungan",
    navHowItWorks: "Cara Kerja",
    navFaq: "Tanya Jawab",
    heroHeadline: "Email Sementara, Privasi Utama.",
    heroSubtitle: "Dapatkan alamat email anonim gratis dalam sekejap. Lindungi kotak masuk utama Anda dari spam.",
    generatorCardPlaceholder: "Alamat email Anda akan muncul di sini...",
    generatorButtonCreate: "Buat Email Baru",
    generatorButtonCreating: "Membuat...",
    copyButton: "Salin",
    copiedButton: "Tersalin!",
    inboxTitle: "Kotak Masuk",
    inboxWaiting: "Menunggu email masuk...",
    whatIsTitle: "Apa itu Email Sementara?",
    whatIsText: "Email sementara adalah alamat email sekali pakai dengan masa aktif terbatas yang tidak memerlukan registrasi. Gunakan untuk mendaftar di layanan online tanpa membocorkan email pribadi Anda, menghindari spam, dan menjaga privasi Anda tetap aman.",
    benefitsTitle: "Keuntungan Utama",
    benefit1Title: "Jaga Privasi",
    benefit1Text: "Hindari memberikan email pribadi Anda ke situs yang tidak terpercaya.",
    benefit2Title: "Bebas Spam",
    benefit2Text: "Kotak masuk utama Anda akan bersih dari email promosi dan spam yang mengganggu.",
    benefit3Title: "Gratis & Cepat",
    benefit3Text: "Tidak perlu mendaftar atau membayar. Dapatkan email baru dalam hitungan detik.",
    benefit4Title: "Sangat Mudah",
    benefit4Text: "Cukup satu klik untuk membuat dan menggunakan alamat email baru Anda.",
    howItWorksTitle: "Bagaimana Cara Kerjanya?",
    step1Title: "Buat Email",
    step1Text: "Klik tombol 'Buat Email Baru' untuk mendapatkan alamat email unik secara instan.",
    step2Title: "Gunakan Email",
    step2Text: "Salin dan gunakan alamat email tersebut untuk mendaftar di layanan online atau aplikasi.",
    step3Title: "Cek Kotak Masuk",
    step3Text: "Email yang dikirim ke alamat tersebut akan langsung muncul di halaman ini.",
    faqTitle: "Pertanyaan Umum (FAQ)",
    faq1Question: "Berapa lama email ini aktif?",
    faq1Answer: "Alamat email akan aktif selama tab browser ini terbuka. Email yang masuk juga akan dihapus secara berkala oleh penyedia layanan.",
    faq2Question: "Apakah layanan ini aman?",
    faq2Answer: "Cukup aman untuk registrasi umum. Namun, jangan gunakan untuk menerima data sensitif atau informasi pribadi yang penting.",
    faq3Question: "Bisakah saya mengirim email?",
    faq3Answer: "Tidak. Layanan ini dirancang hanya untuk menerima email, bukan untuk mengirim.",
    alertError: "Gagal membuat email. Coba lagi nanti, layanan API mungkin sedang bermasalah.",
    messageFrom: "Dari",
    messageSubject: "Subjek",
    messageDate: "Tanggal"
  }
};

// Icon Component
const Icon = ({ path }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  const [language, setLanguage] = useState('en'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [tempEmail, setTempEmail] = useState('');
  const [apiToken, setApiToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const T = content[language]; 

  // --- FUNCTIONS ---
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const generateEmail = async () => {
    setLoading(true);
    setMessages([]);
    setSelectedMessage(null);
    setTempEmail('');
    setApiToken(null);
    try {
      const domainResponse = await fetch('https://api.mail.tm/domains');
      const domains = await domainResponse.json();
      const domain = domains['hydra:member'][0].domain;
      const username = Math.random().toString(36).substring(7);
      const newEmail = `${username}@${domain}`;
      const password = Math.random().toString(36).substring(7);
      await fetch('https://api.mail.tm/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: newEmail, password: password }),
      });
      const tokenResponse = await fetch('https://api.mail.tm/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: newEmail, password: password }),
      });
      if (!tokenResponse.ok) throw new Error('Failed to get token');
      const tokenData = await tokenResponse.json();
      setTempEmail(newEmail);
      setApiToken(tokenData.token);
    } catch (error) {
      console.error("Gagal membuat email:", error);
      alert(T.alertError);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (tempEmail) {
      navigator.clipboard.writeText(tempEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!apiToken) return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://api.mail.tm/messages', {
          headers: { 'Authorization': `Bearer ${apiToken}` },
        });
        const data = await response.json();
        const newMessages = data['hydra:member'] || [];
        if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
          setMessages(newMessages);
        }
      } catch (error) {
        console.error("Gagal memeriksa pesan:", error);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [apiToken, messages]);

  const viewMessage = async (messageId) => {
    try {
      const response = await fetch(`https://api.mail.tm/messages/${messageId}`, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
      });
      const data = await response.json();
      setSelectedMessage(data);
      setIsMenuOpen(false); 
    } catch(error) {
      console.error("Gagal membuka pesan:", error);
    }
  };

  return (
    <>
      <div className={`page-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>
        <header className="header">
          <div className="container">
            <div className="logo">📧 {T.logo}</div>
            <nav className="desktop-nav">
              <a href="#benefits">{T.navBenefits}</a>
              <a href="#how-it-works">{T.navHowItWorks}</a>
              <a href="#faq">{T.navFaq}</a>
              <div className="lang-switcher">
                <button onClick={() => setLanguage('id')} className={language === 'id' ? 'active' : ''}>ID</button>
                <span>|</span>
                <button onClick={() => setLanguage('en')} className={language === 'en' ? 'active' : ''}>EN</button>
              </div>
            </nav>
            <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </button>
          </div>
        </header>

        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
            <a href="#benefits" onClick={toggleMenu}>{T.navBenefits}</a>
            <a href="#how-it-works" onClick={toggleMenu}>{T.navHowItWorks}</a>
            <a href="#faq" onClick={toggleMenu}>{T.navFaq}</a>
            <div className="lang-switcher">
              <button onClick={() => { setLanguage('id'); toggleMenu(); }} className={language === 'id' ? 'active' : ''}>Indonesia</button>
              <button onClick={() => { setLanguage('en'); toggleMenu(); }} className={language === 'en' ? 'active' : ''}>English</button>
            </div>
        </div>

        <main>
          <section className="hero section">
            <div className="container text-center">
              <h1>{T.heroHeadline}</h1>
              <p className="subtitle">{T.heroSubtitle}</p>
              <div className="email-generator-card">
                <div className="email-display">
                  <span>{tempEmail || T.generatorCardPlaceholder}</span>
                  {tempEmail && <button onClick={copyToClipboard} className="btn-copy">{copied ? T.copiedButton : T.copyButton}</button>}
                </div>
                <button onClick={generateEmail} className="btn btn-primary" disabled={loading}>
                  {loading ? T.generatorButtonCreating : T.generatorButtonCreate}
                </button>
              </div>

              {tempEmail && (
                <div className="inbox-section">
                  <div className="inbox-container">
                    <h2 className="inbox-title">{T.inboxTitle}</h2>
                    {messages.length === 0 ? (
                      <p className="inbox-empty">{T.inboxWaiting}</p>
                    ) : (
                      <ul className="message-list">
                        {messages.map(msg => (
                          <li key={msg.id} onClick={() => viewMessage(msg.id)}>
                            <div className="message-details">
                              <div className="from">{msg.from.address}</div>
                              <div className="subject">{msg.subject}</div>
                            </div>
                            <div className="date">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {selectedMessage && (
                <div className="message-view card">
                  <button onClick={() => setSelectedMessage(null)} className="btn-close">X</button>
                  <h3>{selectedMessage.subject}</h3>
                  <p><strong>{T.messageFrom}:</strong> {selectedMessage.from.address}</p>
                  <p><strong>{T.messageDate}:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  <hr />
                  <div className="message-body" dangerouslySetInnerHTML={{ __html: selectedMessage.html[0] || selectedMessage.text.replace(/\n/g, '<br />') }} />
                </div>
              )}
            </div>
          </section>

          <section id="what-is" className="section bg-light">
            <div className="container text-center">
              <h2>{T.whatIsTitle}</h2>
              <p className="max-width-lg">{T.whatIsText}</p>
            </div>
          </section>
          
          <section id="benefits" className="section">
            <div className="container">
              <h2 className="text-center">{T.benefitsTitle}</h2>
              <div className="benefits-grid">
                <div className="card">
                  <div className="card-icon"><Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></div>
                  <h3>{T.benefit1Title}</h3>
                  <p>{T.benefit1Text}</p>
                </div>
                <div className="card">
                  <div className="card-icon"><Icon path="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></div>
                  <h3>{T.benefit2Title}</h3>
                  <p>{T.benefit2Text}</p>
                </div>
                <div className="card">
                  <div className="card-icon"><Icon path="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></div>
                  <h3>{T.benefit3Title}</h3>
                  <p>{T.benefit3Text}</p>
                </div>
                <div className="card">
                  <div className="card-icon"><Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></div>
                  <h3>{T.benefit4Title}</h3>
                  <p>{T.benefit4Text}</p>
                </div>
              </div>
            </div>
          </section>
          
          <section id="how-it-works" className="section bg-light">
            <div className="container text-center">
              <h2>{T.howItWorksTitle}</h2>
              <div className="steps-container">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3>{T.step1Title}</h3>
                  <p>{T.step1Text}</p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3>{T.step2Title}</h3>
                  <p>{T.step2Text}</p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3>{T.step3Title}</h3>
                  <p>{T.step3Text}</p>
                </div>
              </div>
            </div>
          </section>
          
          <section id="faq" className="section">
            <div className="container max-width-md">
              <h2 className="text-center">{T.faqTitle}</h2>
              <div className="faq-item">
                <h4>{T.faq1Question}</h4>
                <p>{T.faq1Answer}</p>
              </div>
              <div className="faq-item">
                <h4>{T.faq2Question}</h4>
                <p>{T.faq2Answer}</p>
              </div>
              <div className="faq-item">
                <h4>{T.faq3Question}</h4>
                <p>{T.faq3Answer}</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="footer">
          <div className="container text-center">
            <p>&copy; {new Date().getFullYear()} {T.logo}. {T.footerText}</p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        :root {
          --primary-accent: #64ffda;
          --text-color: #ccd6f6;
          --light-text-color: #8892b0;
          --background-color: #0a192f;
          --light-background: #112240;
          --border-color: #233554;
          --card-shadow: none;
          --border-radius: 8px;
          --dark-navy-text: #0a192f;
        }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: var(--background-color); color: var(--text-color); line-height: 1.6; scroll-behavior: smooth; }
        .page-wrapper.menu-open { overflow: hidden; }
        h1, h2, h3, h4 { margin-top: 0; color: #e6f1ff; }
        a { color: var(--primary-accent); text-decoration: none; }
      `}</style>
      <style jsx>{`
        .page-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
        main { flex-grow: 1; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .header { padding: 15px 0; border-bottom: 1px solid var(--border-color); background-color: rgba(10, 25, 47, 0.85); position: sticky; top: 0; z-index: 1000; backdrop-filter: blur(10px); }
        .header .container { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; color: #e6f1ff; }
        .desktop-nav { display: flex; align-items: center; gap: 25px; }
        .desktop-nav a { color: var(--text-color); font-weight: 500; transition: color 0.2s; }
        .desktop-nav a:hover { color: var(--primary-accent); }
        .lang-switcher button.active { color: var(--primary-accent); }
        .hamburger-menu .bar { background-color: var(--text-color); }
        .mobile-nav { background-color: var(--light-background); }
        .btn-primary { background-color: var(--primary-accent); color: var(--dark-navy-text); }
        .btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .btn-copy { background-color: var(--light-text-color); color: var(--background-color); }
        .inbox-section { margin-top: 60px; max-width: 800px; margin-left: auto; margin-right: auto; }
        
        .inbox-container {
          background-color: var(--light-background);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          padding: 10px 0;
          margin-top: 40px;
          overflow: hidden;
        }
        .inbox-title {
          padding: 0 25px 15px 25px;
          border-bottom: 1px solid var(--border-color);
        }
        .inbox-empty {
          padding: 40px 25px;
          text-align: center;
          color: var(--light-text-color);
        }
        .message-list { list-style-type: none; padding: 0; text-align: left; }
        .message-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding: 15px 25px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .message-list li:hover { background-color: var(--background-color); }
        .message-list li:last-child { border-bottom: none; }
        .message-details { display: flex; flex-direction: column; }
        .from { font-weight: bold; color: var(--text-color); font-size: 1rem; }
        .subject { font-size: 0.9rem; color: var(--light-text-color); margin-top: 2px; }
        .date { font-size: 0.8rem; color: var(--light-text-color); white-space: nowrap; margin-left: 15px; }

        .email-generator-card { background-color: var(--light-background); }
        .email-display { background-color: var(--background-color); }
        .message-view { background: var(--light-background); border: 1px solid var(--border-color); }
        .card { background-color: var(--light-background); }
        .card-icon { color: var(--primary-accent); margin-bottom: 15px; }
        .step-number { background-color: var(--primary-accent); color: var(--dark-navy-text); }
        .footer { background-color: transparent; }
        .lang-switcher { display: flex; align-items: center; gap: 5px; }
        .desktop-nav .lang-switcher { margin-left: 15px; border-left: 1px solid var(--border-color); padding-left: 25px; }
        .lang-switcher button { background: none; border: none; cursor: pointer; font-size: 1rem; font-weight: bold; color: var(--light-text-color); padding: 5px; }
        .lang-switcher span { color: var(--border-color); }
        .hamburger-menu { display: none; flex-direction: column; justify-content: space-around; width: 30px; height: 25px; background: transparent; border: none; cursor: pointer; padding: 0; z-index: 1051; }
        .hamburger-menu .bar { width: 100%; height: 3px; border-radius: 5px; transition: all 0.3s ease-in-out; }
        .mobile-nav { display: none; flex-direction: column; align-items: center; justify-content: center; gap: 40px; position: fixed; top: 0; right: 0; width: 80%; height: 100vh; z-index: 1050; transform: translateX(100%); transition: transform 0.3s ease-in-out; box-shadow: -5px 0 15px rgba(0,0,0,0.1); }
        .mobile-nav.open { transform: translateX(0); }
        .mobile-nav a { font-size: 1.5rem; font-weight: bold; color: var(--text-color); }
        .mobile-nav .lang-switcher { flex-direction: column; gap: 15px; font-size: 1.2rem; position: absolute; bottom: 40px; }
        @media (max-width: 768px) { .desktop-nav { display: none; } .hamburger-menu, .mobile-nav { display: flex; } }
        .section { padding: 80px 0; }
        .bg-light { background-color: var(--light-background); }
        .text-center { text-align: center; }
        .subtitle { font-size: 1.25rem; color: var(--light-text-color); margin-bottom: 40px; }
        .hero { padding-top: 60px; }
        .email-generator-card { max-width: 600px; margin: 0 auto; padding: 20px; border-radius: var(--border-radius); box-shadow: var(--card-shadow); border: 1px solid var(--border-color); }
        .email-display { border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 15px; font-size: 1.1rem; font-family: monospace; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; word-break: break-all; }
        .btn { padding: 12px 24px; border-radius: var(--border-radius); border: none; font-size: 1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s, filter 0.2s; }
        .btn:disabled { background-color: #555; color: #999; cursor: not-allowed; }
        .btn-copy { padding: 5px 10px; border-radius: 5px; border: none; cursor: pointer; margin-left: 10px; white-space: nowrap; }
        .message-view { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 700px; max-height: 80vh; overflow-y: auto; padding: 30px; z-index: 1001; text-align: left; }
        .btn-close { position: absolute; top: 15px; right: 15px; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-color); }
        .message-body { margin-top: 20px; white-space: pre-wrap; word-wrap: break-word; }
        .benefits-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; margin-top: 50px; }
        @media (max-width: 1024px) { .benefits-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .benefits-grid { grid-template-columns: 1fr; } }
        .card { border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 30px; text-align: center; box-shadow: var(--card-shadow); }
        .card-icon { color: var(--primary-accent); margin-bottom: 15px; }
        .card-icon :global(svg) { width: 48px; height: 48px; }
        .steps-container { display: flex; justify-content: space-around; gap: 30px; margin-top: 50px; flex-wrap: wrap; }
        .step-card { flex: 1; min-width: 280px; }
        .step-number { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; margin: 0 auto 20px auto; }
        .faq-item { text-align: left; border-bottom: 1px solid var(--border-color); padding: 20px 0; }
        .faq-item:first-of-type { border-top: 1px solid var(--border-color); }
        .faq-item h4 { margin-bottom: 10px; }
        .footer { padding: 40px 0; border-top: 1px solid var(--border-color); color: var(--light-text-color); }
      `}</style>
    </>
  );
}