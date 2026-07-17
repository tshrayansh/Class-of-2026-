import React, { useState } from 'react';
import { Heart, ShieldAlert, Award, Smile } from 'lucide-react';

export default function NiranjanGame({ onComplete }) {
  const [health, setHealth] = useState(100);
  const [tolerance, setTolerance] = useState(100);
  const [progress, setProgress] = useState(0); // Work Day Progress (0 - 100%)
  const [logs, setLogs] = useState(['You entered MNDL Lab. Niranjan is pacing around in his Crocs.']);
  const [proteusHealth, setProteusHealth] = useState(100);
  const [proteusActive, setProteusActive] = useState(true); // Proteus starts active as a roadblock
  const [messiFlash, setMessiFlash] = useState(false);

  const playBleep = (pitch = 440, duration = 0.1, type = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  const playWhistle = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Soccer whistle double tone
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc1.frequency.setValueAtTime(900, audioCtx.currentTime + 0.1);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(805, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(905, audioCtx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      
      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.25);
      osc2.stop(audioCtx.currentTime + 0.25);
    } catch(e) {}
  };

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev]);
  };

  const handleAction = (type) => {
    // Cannot progress lab day while Proteus is active
    if (proteusActive && type !== 'smash') {
      playBleep(280, 0.15, 'sawtooth');
      addLog('Lab Glitch: Proteus software is crashing. Resolve it first!');
      return;
    }

    playBleep(480, 0.08);
    // Increase day progress
    setProgress((prev) => Math.min(100, prev + 20));

    switch (type) {
      case 'academic':
        addLog('Niranjan: "Open the sequencing log on page 4, I already wrote the solution."');
        setTolerance((prev) => Math.min(100, prev + 10));
        break;

      case 'random':
        addLog('Niranjan: "Ningal thammil adi ano? (Are you guys fighting?)"');
        setTolerance((prev) => Math.max(0, prev - 15));
        break;

      case 'exist':
        setTolerance((prev) => Math.max(0, prev - 20));
        setHealth((prev) => Math.max(10, prev - 10));
        const quotes = [
          'Niranjan: "Shrayansh, did you write this code or did a sleep-deprived fish do it?"',
          'Niranjan: "156 days left for exams. Start panicking!"',
          'Niranjan: "Why are you wearing shorts? Mine are shorter, but still..."'
        ];
        addLog(quotes[Math.floor(Math.random() * quotes.length)]);
        break;

      case 'veggie':
        setHealth((prev) => Math.min(100, prev + 30));
        addLog('Vegetarian Alliance: Sharing paneer tikka. Health increased! 🧀');
        break;

      case 'messi':
        playWhistle();
        setMessiFlash(true);
        setHealth(100);
        setTolerance(100);
        addLog('GOAL! Messi scores for Argentina! Niranjan cheers: "VAMOS ARGENTINA!" 🇦🇷');
        setTimeout(() => setMessiFlash(false), 2000);
        break;

      case 'crocs':
        addLog('Crocs Trek: Niranjan shows up for a mountain trek wearing Crocs. "Pacing holes in the soles!"');
        setTolerance((prev) => Math.min(100, prev + 20));
        break;

      default:
        break;
    }
  };

  const handleSmash = () => {
    playBleep(700, 0.06, 'sawtooth');
    setProteusHealth((prev) => {
      const next = Math.max(0, prev - 25);
      if (next === 0) {
        setProteusActive(false);
        addLog('🎉 Proteus Glitch Defeated! The lab day can now progress.');
      } else {
        addLog(`Glitch suppressed: ${next}%`);
      }
      return next;
    });
  };

  const gameWon = progress >= 100 && !proteusActive;

  return (
    <div style={{ ...styles.container, backgroundColor: messiFlash ? '#74acdf' : '#16161a', transition: 'background-color 0.3s ease' }}>
      {messiFlash && (
        <style>{`
          .messi-text {
            color: #000 !important;
            text-shadow: 2px 2px #fff;
          }
        `}</style>
      )}

      {/* HUD status bars */}
      <div style={styles.hud}>
        <span className="text-retro messi-text" style={styles.hudTitle}>SURVIVE THE LAB</span>
        <span style={styles.badge} className="text-mono">MNDL LOGS</span>
      </div>

      {/* Progress Bars */}
      <div style={styles.statusBar}>
        <div style={styles.barBox}>
          <span style={styles.barLabel} className="text-retro messi-text">WORK PROGRESS: {progress}%</span>
          <div style={styles.barBorder}>
            <div style={{ ...styles.barFill, width: `${progress}%`, backgroundColor: '#06d6a0' }}></div>
          </div>
        </div>
        <div style={styles.barBox}>
          <span style={styles.barLabel} className="text-retro messi-text">TOLERANCE: {tolerance}%</span>
          <div style={styles.barBorder}>
            <div style={{ ...styles.barFill, width: `${tolerance}%`, backgroundColor: '#ffd166' }}></div>
          </div>
        </div>
      </div>

      {/* Main Console Area */}
      <div style={styles.consoleGrid}>
        {/* Actions panel */}
        <div style={styles.actionsPanel}>
          <button onClick={() => handleAction('academic')} className="btn-neo secondary" style={styles.actionBtn}>
            📚 Ask Academic Q
          </button>
          <button onClick={() => handleAction('random')} className="btn-neo secondary" style={styles.actionBtn}>
            💬 Ask Random Q
          </button>
          <button onClick={() => handleAction('exist')} className="btn-neo secondary" style={styles.actionBtn}>
            🥱 Exist Peacefully
          </button>
          <button onClick={() => handleAction('veggie')} className="btn-neo secondary" style={styles.actionBtn}>
            🧀 Vegetarian lunch
          </button>
          <button onClick={() => handleAction('messi')} className="btn-neo secondary" style={styles.actionBtn}>
            ⚽ Messi Scores Goal!
          </button>
          <button onClick={() => handleAction('crocs')} className="btn-neo secondary" style={styles.actionBtn}>
            🐊 Crocs Trek
          </button>
        </div>

        {/* Live log messages */}
        <div style={styles.logBox}>
          {logs.map((log, i) => (
            <div key={i} style={styles.logLine}>
              <span style={{ color: '#06d6a0', marginRight: '6px' }}>&gt;</span> {log}
            </div>
          ))}
        </div>
      </div>

      {/* Special Boss Battle HUD */}
      {proteusActive && (
        <div style={styles.bossBox} className="animate-shake">
          <h4 style={styles.bossTitle} className="text-retro">⚠️ ROADBLOCK: PROTEUS CRASH</h4>
          <div style={styles.bossBar}>
            <div style={{ ...styles.bossFill, width: `${proteusHealth}%` }}></div>
          </div>
          <button onClick={handleSmash} className="btn-neo accent" style={styles.smashBtn}>
            💥 SMASH SOFTWARE GLITCH (TAP!)
          </button>
        </div>
      )}

      {gameWon && (
        <div style={styles.winBox}>
          <p style={styles.winText}>Work day completed. Niranjan checks the fish, shrugs, and walks out in his Crocs.</p>
          <button onClick={() => { playBleep(880); onComplete(); }} className="btn-neo secondary animate-bounce-hover" style={styles.completeBtn}>
            CLAIM ACHIEVEMENT
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
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
    color: '#ff477e',
    margin: 0,
  },
  badge: {
    backgroundColor: '#ff477e',
    color: '#000',
    padding: '3px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    border: '2px solid #000',
  },
  statusBar: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '20px',
  },
  barBox: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  barLabel: {
    fontSize: '0.65rem',
    marginBottom: '5px',
    color: '#8e8e9f',
  },
  barBorder: {
    height: '14px',
    backgroundColor: '#000',
    border: '2.5px solid #333',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  consoleGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 3fr',
    gap: '15px',
    '@media (max-width: 500px)': {
      gridTemplateColumns: '1fr',
    },
  },
  actionsPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  actionBtn: {
    fontSize: '0.8rem',
    padding: '8px',
    boxShadow: '2px 2px 0px #000',
    borderWidth: '2px',
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  logBox: {
    backgroundColor: '#0f0f13',
    border: '2.5px solid #000',
    borderRadius: '8px',
    padding: '12px',
    height: '220px',
    overflowY: 'auto',
    textAlign: 'left',
    fontFamily: "'VT323', monospace",
    fontSize: '1.3rem',
    color: '#fff',
  },
  logLine: {
    marginBottom: '6px',
  },
  bossBox: {
    backgroundColor: '#371c1c',
    border: '3px solid #ef476f',
    borderRadius: '10px',
    padding: '15px',
    marginTop: '20px',
    textAlign: 'center',
  },
  bossTitle: {
    fontSize: '0.8rem',
    color: '#ef476f',
    margin: '0 0 10px 0',
  },
  bossBar: {
    height: '14px',
    backgroundColor: '#1f1313',
    border: '2.5px solid #000',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  bossFill: {
    height: '100%',
    backgroundColor: '#ef476f',
    transition: 'width 0.2s ease',
  },
  smashBtn: {
    width: '100%',
    justifyContent: 'center',
  },
  winBox: {
    marginTop: '20px',
    borderTop: '2px dashed #444',
    paddingTop: '15px',
    textAlign: 'center',
  },
  winText: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '0.95rem',
    color: '#06d6a0',
    marginBottom: '10px',
  },
  completeBtn: {
    width: '100%',
  },
};
