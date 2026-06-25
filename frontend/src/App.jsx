import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // ---------------- STATE MANAGEMENT ----------------
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  // Auth Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Studio States
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingScript, setLoadingScript] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [voiceDone, setVoiceDone] = useState(false);

  // History States (NEW)
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ---------------- HISTORY FUNCTION (NEW) ----------------
  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/history/${user.id}`);
      setHistory(response.data);
    } catch (error) {
      console.error("History Error: ", error);
    }
    setLoadingHistory(false);
  };

  // जब भी यूज़र डैशबोर्ड पर आए, उसकी हिस्ट्री लोड करें
  useEffect(() => {
    if (currentView === 'dashboard' && user) {
      fetchHistory();
    }
  }, [currentView, user]);

  // ---------------- AUTHENTICATION FUNCTIONS ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/register', { username, email, password });
      alert("अकाउंट सफलतापूर्वक बन गया! कृपया अब लॉग इन करें।");
      setCurrentView('login');
      setPassword(''); 
    } catch (error) {
      alert(error.response?.data?.error || "Registration Error!");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
      setUser(response.data.user); 
      setCurrentView('dashboard');
    } catch (error) {
      alert(error.response?.data?.error || "Invalid Credentials!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    setEmail(''); setPassword(''); setTopic(''); setScript(''); setVideoUrl(''); setVoiceDone(false); setHistory([]);
  };

  // ---------------- STUDIO FUNCTIONS ----------------
  const generateScript = async () => {
    if (!topic.trim()) return alert("कृपया कोई टॉपिक लिखें!");
    setLoadingScript(true); setVoiceDone(false); setVideoUrl('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate-script', { topic });
      setScript(response.data.script);
    } catch (error) {
      alert("Script Generation Error!");
    }
    setLoadingScript(false);
  };

  const generateVoice = async () => {
    setLoadingVoice(true);
    try {
      await axios.post('http://127.0.0.1:5000/generate-voice', { script });
      setVoiceDone(true);
    } catch (error) {
      alert("Voice Generation Error!");
    }
    setLoadingVoice(false);
  };

  const generateVideo = async () => {
    setLoadingVideo(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate-video', { 
        topic, script, user_id: user.id 
      });
      setVideoUrl(`${response.data.video_url}?t=${new Date().getTime()}`);
      
      // नया वीडियो बनने के बाद हिस्ट्री को अपडेट करें
      fetchHistory();
    } catch (error) {
      alert("Video Generation Error!");
    }
    setLoadingVideo(false);
  };

  // ---------------- RENDER UI ----------------
  return (
    <div className="container mt-5 mb-5">
      
      {/* ---------------- LOGIN VIEW ---------------- */}
      {currentView === 'login' && (
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg p-4 border-0" style={{ borderRadius: '15px' }}>
              <h2 className="text-center mb-4 text-primary font-weight-bold">VidSnapAI Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
              </form>
              <p className="text-center mt-2">
                अकाउंट नहीं है? <span className="text-primary" style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setCurrentView('register')}>यहाँ रजिस्टर करें</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- REGISTER VIEW ---------------- */}
      {currentView === 'register' && (
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg p-4 border-0" style={{ borderRadius: '15px' }}>
              <h2 className="text-center mb-4 text-success font-weight-bold">Create Account</h2>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success w-100 mb-3">Sign Up</button>
              </form>
              <p className="text-center mt-2">
                पहले से अकाउंट है? <span className="text-primary" style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setCurrentView('login')}>यहाँ लॉगिन करें</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- DASHBOARD (STUDIO) VIEW ---------------- */}
      {currentView === 'dashboard' && user && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            
            {/* Header Navbar */}
            <div className="d-flex justify-content-between align-items-center bg-white p-3 shadow-sm rounded mb-4 border">
              <h4 className="text-primary mb-0 font-weight-bold">VidSnapAI Studio</h4>
              <div>
                <span className="me-3 font-weight-bold text-dark">Welcome, {user.username}!</span>
                <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>

            {/* Studio Input */}
            <div className="card shadow-lg p-4 border-0" style={{ borderRadius: '15px' }}>
              <div className="mb-3">
                <label className="form-label font-weight-bold">अपना टॉपिक डालें:</label>
                <input type="text" className="form-control form-control-lg" placeholder="उदा. Cyberpunk city 2077" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-lg w-100 shadow-sm" onClick={generateScript} disabled={loadingScript}>
                {loadingScript ? "Generating AI Script..." : "1. Generate AI Script"}
              </button>
            </div>

            {/* Script & Voice */}
            {script && (
              <div className="card mt-4 p-4 bg-white border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <h5 className="text-primary font-weight-bold mb-3">📝 Generated Script:</h5>
                <div className="p-3 bg-light rounded text-dark border" style={{ whiteSpace: 'pre-wrap', fontSize: '15px' }}>{script}</div>
                <button className="btn btn-dark btn-lg w-100 mt-3 shadow-sm" onClick={generateVoice} disabled={loadingVoice}>
                  {loadingVoice ? "Generating Audio..." : "2. Generate AI Voice"}
                </button>
              </div>
            )}

            {/* Video Render */}
            {voiceDone && (
               <div className="card mt-4 p-4 bg-white border-0 shadow-sm text-center" style={{ borderRadius: '15px' }}>
                  <button className="btn btn-danger btn-lg w-100 mb-3 shadow-sm" onClick={generateVideo} disabled={loadingVideo}>
                    {loadingVideo ? "Rendering Cinematic Video..." : "3. Render Final Video"}
                  </button>
                  {videoUrl && (
                    <div className="mt-4 d-flex flex-column align-items-center">
                      <h4 className="text-success font-weight-bold mb-3">🎬 Your AI Reel is Ready!</h4>
                      <video controls className="shadow-lg rounded border border-dark" style={{ width: '100%', maxWidth: '340px', backgroundColor: '#000', borderRadius: '10px' }} src={videoUrl} />
                    </div>
                  )}
               </div>
            )}

            {/* ---------------- HISTORY SECTION (NEW) ---------------- */}
            <div className="mt-5 mb-5">
              <h4 className="text-primary font-weight-bold mb-4 border-bottom pb-2">📚 My Previous Videos</h4>
              
              {loadingHistory ? (
                <div className="text-center text-muted">लोड हो रहा है...</div>
              ) : history.length === 0 ? (
                <div className="text-center text-muted bg-white p-4 rounded shadow-sm border">
                  अभी तक कोई वीडियो नहीं बनाया गया है। अपना पहला वीडियो जनरेट करें!
                </div>
              ) : (
                <div className="row">
                  {history.map((vid) => (
                    <div key={vid.id} className="col-md-6 mb-4">
                      <div className="card shadow-sm border-0 h-100 p-3" style={{ borderRadius: '15px' }}>
                        <h6 className="font-weight-bold text-dark text-uppercase text-center text-truncate" title={vid.topic}>
                          {vid.topic}
                        </h6>
                        <p className="text-muted small text-center mb-3">{vid.date}</p>
                        <video 
                          controls 
                          className="rounded border border-dark w-100" 
                          style={{ backgroundColor: '#000', maxHeight: '250px' }} 
                          src={`${vid.video_url}?t=${vid.id}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* End of History Section */}
            
          </div>
        </div>
      )}

    </div>
  );
}

export default App;