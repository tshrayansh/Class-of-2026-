import React, { useState } from 'react';
import { Heart, Phone } from 'lucide-react';

export default function AnuthiGame({ onComplete }) {
  const [crises, setCrises] = useState([
    { id: 'course', title: 'Course Exam Crisis', status: 'pending', question: 'Help! The physics exam is in 5 minutes and I know zero topics!', response: 'Anuthi Di: "Sit down! First, stop crying. Open your lecture notes, memorize the main formulas, and if nothing works, just go sit next to Aryan. And remember to drink water!"' },
    { id: 'dj_setup', title: 'Diwali DJ Sound Crisis', status: 'pending', question: 'Diwali Garba is in 10 minutes and the sound system speakers are blowing fuses!', response: 'Anuthi Di: "Calm down! I am heading over right now. I already scheduled the logistics team and talked to the electricians. You go start the Garba circle, I will get the music running!"' },
    { id: 'life', title: 'Life Advice Crisis', status: 'pending', question: 'I don\'t know what I\'m doing with my major or my life...', response: 'Anuthi Di: "Hey. Everyone is figuring it out. You are doing amazing. Let\'s go to J Cafe at 11pm, buy a cold coffee, and talk about it for three hours. No stress."' },
    { id: 'intern', title: 'Internship Advice Crisis', status: 'pending', question: 'Help! My internship application is due and my draft SOP sounds like a recipe for Poha!', response: 'Anuthi Di: "Bring the draft here. Let\'s rewrite the introduction to make it professional and highlight your lab achievements. You will do great, don\'t worry!"' }
  ]);
  const [activeCrisis, setActiveCrisis] = useState(null);
  const [showHotline, setShowHotline] = useState(false);
  const [hotlineCall, setHotlineCall] = useState(false);
  const [mpSpecial, setMpSpecial] = useState(false);
  const [sevSprinkled, setSevSprinkled] = useState(0);

  const playBleep = (pitch = 440) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const resolveCrisis = (id) => {
    playBleep(660);
    setCrises((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved' } : c))
    );
    setActiveCrisis(null);
    setHotlineCall(false);
    setShowHotline(false);
  };

  const startHotline = (crisis) => {
    playBleep(350);
    setActiveCrisis(crisis);
    setShowHotline(true);
  };

  const triggerCall = () => {
    playBleep(440);
    setHotlineCall(true);
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch(e) {}
  };

  const handleSprinkle = () => {
    setSevSprinkled((prev) => prev + 1);
    // Crunch sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 + Math.random() * 80, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch(e) {}
  };

  const allResolved = crises.every((c) => c.status === 'resolved');

  return (
    <div style={styles.container}>
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>HOME AWAY FROM HOME</span>
        <span style={styles.badge} className="text-mono">SAFETY RATING: ★★★★★</span>
      </div>

      {!mpSpecial ? (
        <div className="notebook-page" style={styles.notebook}>
          <h3 className="text-retro" style={styles.noteTitle}>Hostel Survival Journal</h3>
          <p style={styles.noteSub}>Resolve the crises on campus. Help is just one call away.</p>

          <div style={styles.crisesGrid}>
            {crises.map((c) => (
              <div key={c.id} style={{ ...styles.crisisCard, opacity: c.status === 'resolved' ? 0.6 : 1 }}>
                <h4 style={styles.cardTitle}>{c.title}</h4>
                <p style={styles.cardDesc}>{c.question}</p>
                {c.status === 'pending' ? (
                  <button onClick={() => startHotline(c)} className="btn-neo secondary" style={styles.actionBtn}>
                    <Phone size={14} /> CALL DI
                  </button>
                ) : (
                  <span style={styles.resolvedLabel}>RESOLVED 💖</span>
                )}
              </div>
            ))}
          </div>

          {/* Hotline Modal Overlay */}
          {showHotline && activeCrisis && (
            <div style={styles.modalBg}>
              <div className="card-neo" style={styles.modalCard}>
                <h3 className="text-retro" style={styles.modalHeading}>Calling Hotline...</h3>
                
                {!hotlineCall ? (
                  <div style={styles.callState}>
                    <div style={styles.pulsingHeart} className="animate-shake">
                      <Heart size={48} fill="#ff477e" color="#000" />
                    </div>
                    <p style={styles.callerText}>ANUTHI DI</p>
                    <button onClick={triggerCall} className="btn-neo accent" style={styles.dialBtn}>
                      ANSWER CALL
                    </button>
                  </div>
                ) : (
                  <div style={styles.conversation}>
                    <div style={styles.advisorBubble}>
                      <p style={styles.adviseText}>{activeCrisis.response}</p>
                    </div>
                    <button onClick={() => resolveCrisis(activeCrisis.id)} className="btn-neo secondary" style={styles.okBtn}>
                      Thanks, Di! ❤️
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {allResolved && (
            <div style={styles.transitionBox}>
              <p style={styles.transitionText}>All crises managed! You survived the semester.</p>
              <button onClick={() => { playBleep(600); setMpSpecial(true); }} className="btn-neo accent animate-bounce-hover" style={styles.continueBtn}>
                GO TO MP DIWALI SPECIAL ➔
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Poha Jalebi Garnish Clicker Sequence */
        <div style={styles.mpContainer}>
          <h3 className="text-retro" style={styles.mpTitle}>Bhopali Poha-Jalebi Special</h3>
          <p style={styles.mpSub}>Tap the yellow Bhopal plate to garnish the Poha with Jalebi & Sev!</p>

          <div onClick={handleSprinkle} className="poha-plate" style={styles.plate}>
            <div style={styles.pohaBase}>
              <div style={styles.jalebiCenter}></div>
              {Array.from({ length: Math.min(sevSprinkled, 30) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.sevStrand,
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={styles.clickStats}>
            <span className="text-mono">SEV SPRINKLED: {sevSprinkled}</span>
          </div>

          {sevSprinkled >= 15 && (
            <div style={styles.homeEnding} className="animate-shake">
              <p style={styles.endingLine1}>LOCATION DISCOVERED:</p>
              <h2 className="glitch-text text-retro" style={styles.endingLine2}>HOME 🏡</h2>
              <p style={styles.endingSubText}>
                "Some people don't just become seniors. They become part of what makes a place feel like home."
              </p>
              <button onClick={() => { playBleep(880); onComplete(); }} className="btn-neo secondary animate-bounce-hover" style={styles.completeBtn}>
                CLAIM ACHIEVEMENT
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#16161a',
    border: '3px solid #000',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: 'var(--neo-shadow)',
    color: '#fff',
    maxWidth: '650px',
    margin: '0 auto',
  },
  hud: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '3px solid #000',
    paddingBottom: '12px',
    marginBottom: '15px',
  },
  hudTitle: {
    fontSize: '1.2rem',
    color: '#ffd166',
    margin: 0,
  },
  badge: {
    backgroundColor: '#ffd166',
    color: '#000',
    padding: '3px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    border: '2px solid #000',
  },
  notebook: {
    textAlign: 'left',
  },
  noteTitle: {
    margin: '0 0 5px 0',
    color: '#073b4c',
    fontSize: '1.2rem',
  },
  noteSub: {
    margin: '0 0 20px 0',
    color: '#555',
    fontStyle: 'italic',
    fontSize: '0.9rem',
  },
  crisesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    '@media (max-width: 500px)': {
      gridTemplateColumns: '1fr',
    },
  },
  crisisCard: {
    backgroundColor: '#fbfbf2',
    border: '2px solid #000',
    borderRadius: '6px',
    padding: '12px',
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    margin: '0 0 5px 0',
    fontSize: '0.95rem',
    color: '#073b4c',
  },
  cardDesc: {
    margin: '0 0 12px 0',
    fontSize: '0.8rem',
    color: '#444',
    lineHeight: '1.3',
  },
  actionBtn: {
    fontSize: '0.75rem',
    padding: '4px 10px',
    boxShadow: '2px 2px 0px #000',
    borderWidth: '2px',
  },
  resolvedLabel: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#ef476f',
    textAlign: 'center',
    display: 'block',
    marginTop: '5px',
  },
  modalBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  modalCard: {
    backgroundColor: '#1b1b22',
    color: '#fff',
    width: '80%',
    maxWidth: '350px',
    textAlign: 'center',
    padding: '25px',
  },
  modalHeading: {
    fontSize: '0.9rem',
    color: '#ffd166',
    margin: '0 0 20px 0',
  },
  callState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  pulsingHeart: {
    marginBottom: '10px',
  },
  callerText: {
    fontSize: '1.4rem',
    fontFamily: "'VT323', monospace",
    letterSpacing: '1px',
    color: '#ff477e',
    margin: 0,
  },
  dialBtn: {
    width: '100%',
    justifyContent: 'center',
  },
  conversation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  advisorBubble: {
    backgroundColor: '#2e2e3a',
    border: '2px solid #ff477e',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'left',
  },
  adviseText: {
    fontSize: '0.9rem',
    margin: 0,
    lineHeight: '1.4',
    color: '#f3f4f6',
  },
  okBtn: {
    width: '100%',
    justifyContent: 'center',
  },
  transitionBox: {
    marginTop: '25px',
    borderTop: '2px dashed #000',
    paddingTop: '15px',
    textAlign: 'center',
  },
  transitionText: {
    color: '#073b4c',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    marginBottom: '10px',
  },
  continueBtn: {
    width: '100%',
  },
  mpContainer: {
    textAlign: 'center',
    padding: '10px 0',
  },
  mpTitle: {
    color: '#ffd166',
    fontSize: '1.2rem',
    margin: '0 0 6px 0',
  },
  mpSub: {
    fontSize: '0.9rem',
    color: '#8e8e9f',
    margin: '0 0 20px 0',
  },
  plate: {
    width: '160px',
    height: '160px',
    margin: '0 auto 20px auto',
  },
  pohaBase: {
    width: '120px',
    height: '120px',
    backgroundColor: '#eed600', // Yellow Poha color
    borderRadius: '50%',
    position: 'relative',
    border: '3px solid #000',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
  },
  jalebiCenter: {
    width: '40px',
    height: '40px',
    backgroundColor: '#ff7700', // Orange Jalebi color
    borderRadius: '50%',
    position: 'absolute',
    top: '40px',
    left: '40px',
    border: '2.5px solid #000',
  },
  sevStrand: {
    position: 'absolute',
    width: '8px',
    height: '2px',
    backgroundColor: '#ffee55',
    border: '0.5px solid #000',
  },
  clickStats: {
    marginBottom: '20px',
  },
  homeEnding: {
    backgroundColor: '#1b1b22',
    border: '3px solid #ff477e',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '25px',
  },
  endingLine1: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '0.75rem',
    color: '#ffd166',
    margin: '0 0 5px 0',
  },
  endingLine2: {
    fontSize: '2rem',
    color: '#ff477e',
    margin: '0 0 12px 0',
  },
  endingSubText: {
    fontSize: '0.95rem',
    color: '#b2b2c2',
    lineHeight: '1.4',
    margin: '0 0 20px 0',
    fontStyle: 'italic',
  },
  completeBtn: {
    width: '100%',
  },
};
