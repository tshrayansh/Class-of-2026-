import React, { useState } from 'react';
import { Heart, ShieldAlert, Award, Smile } from 'lucide-react';

export default function NiranjanGame({ onComplete }) {
  const [health, setHealth] = useState(100);
  const [tolerance, setTolerance] = useState(100);
  const [knowledge, setKnowledge] = useState(0);
  const [logs, setLogs] = useState(['You entered MNDL Lab. Niranjan is pacing around in her Crocs.']);
  const [proteusHealth, setProteusHealth] = useState(0);
  const [proteusActive, setProteusActive] = useState(false);
  const [argentinaCheer, setArgentinaCheer] = useState(false);

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev]);
  };

  const handleAction = (type) => {
    if (proteusActive && type !== 'smash') {
      addLog('Niranjan: "Focus on Proteus first!"');
      return;
    }

    switch (type) {
      case 'academic':
        setKnowledge((prev) => prev + 15);
        addLog('Niranjan: "Check page 42 of the Sanger Sequencing manual. It is obvious."');
        // Custom sound
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } catch(e) {}
        break;

      case 'random':
        addLog('Niranjan: "Ningal thammil adi ano? (Are you guys fighting?)"');
        setTolerance((prev) => Math.max(0, prev - 10));
        break;

      case 'exist':
        setTolerance((prev) => Math.max(0, prev - 20));
        setHealth((prev) => Math.max(10, prev - 5));
        const quotes = [
          'Niranjan: "Shrayansh, did you write this code or did a sleep-deprived zebrafish do it?"',
          'Niranjan: "Only 156 days left for the final exams. PANIC!"',
          'Niranjan: "Why are you wearing shorts? I mean, mine are shorter, but still..."',
          'Niranjan: "Vacuuming up this plate of food in 3 seconds flat. Watch me."'
        ];
        addLog(quotes[Math.floor(Math.random() * quotes.length)]);
        break;

      case 'veggie':
        setHealth((prev) => Math.min(100, prev + 25));
        addLog('Vegetarian Alliance: Sharing paneer tikka with Niranjan in the lab canteen. +25 Health!');
        break;

      case 'argentina':
        setArgentinaCheer(true);
        addLog('Argentina Mentioned: Niranjan starts dancing! "VAMOS ARGENTINA!" 🇦🇷');
        setTimeout(() => setArgentinaCheer(false), 2000);
        break;

      case 'crocs':
        addLog('Crocs Trek Event: Niranjan shows up for a mountain trek wearing Crocs. "They are comfortable!"');
        setTolerance((prev) => Math.min(100, prev + 15));
        break;

      case 'spawn_proteus':
        setProteusActive(true);
        setProteusHealth(100);
        addLog('⚠️ WILD PROTEUS SOFTWARE GLITCH APPEARED! Niranjan joins the battle!');
        break;

      default:
        break;
    }
  };

  const handleSmash = () => {
    setProteusHealth((prev) => {
      const next = Math.max(0, prev - 20);
      if (next === 0) {
        setProteusActive(false);
        addLog('🎉 PROTEUS DEFEATED! Mutual hatred of Proteus binds the alliance!');
      } else {
        addLog(`Smashed Proteus! Remaining glitch: ${next}%`);
      }
      return next;
    });

    // Retro punch hit sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch(e) {}
  };

  const gameWon = knowledge >= 30 && tolerance < 80 && proteusHealth === 0;

  return (
    <div style={styles.container}>
      {/* HUD status bars */}
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>SURVIVE THE LAB</span>
        <span style={styles.badge} className="text-mono">MNDL LOGS</span>
      </div>

      <div style={styles.statusBar}>
        <div style={styles.barBox}>
          <span style={styles.barLabel} className="text-retro">HEALTH: {health}%</span>
          <div className="hud-bar"><div className="hud-fill green" style={{ width: `${health}%`, height: '10px' }}></div></div>
        </div>
        <div style={styles.barBox}>
          <span style={styles.barLabel} className="text-retro">TOLERANCE: {tolerance}%</span>
          <div className="hud-bar"><div className="hud-fill yellow" style={{ width: `${tolerance}%`, height: '10px' }}></div></div>
        </div>
      </div>

      {argentinaCheer && (
        <div style={styles.argentinaBanner} className="animate-shake">
          🇦🇷 VAMOS ARGENTINA! MESSI MODE ACTIVE 🇦🇷
        </div>
      )}

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
            🥱 Try to Exist Peacefully
          </button>
          <button onClick={() => handleAction('veggie')} className="btn-neo secondary" style={styles.actionBtn}>
            🧀 Vegetarian Alliance
          </button>
          <button onClick={() => handleAction('argentina')} className="btn-neo secondary" style={styles.actionBtn}>
            ⚽ Argentina Match
          </button>
          <button onClick={() => handleAction('crocs')} className="btn-neo secondary" style={styles.actionBtn}>
            🐊 Crocs Trek
          </button>
          {!proteusActive && proteusHealth === 0 && (
            <button onClick={() => handleAction('spawn_proteus')} className="btn-neo accent" style={styles.actionBtn}>
              💥 Exist near Proteus
            </button>
          )}
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
          <h4 style={styles.bossTitle} className="text-retro">⚠️ BOSS: PROTEUS GLITCH</h4>
          <div style={styles.bossBar}>
            <div style={{ ...styles.bossFill, width: `${proteusHealth}%` }}></div>
          </div>
          <button onClick={handleSmash} className="btn-neo accent animate-bounce-hover" style={styles.smashBtn}>
            💥 SMASH PROTEUS SOFTWARE
          </button>
        </div>
      )}

      {gameWon && (
        <div style={styles.winBox}>
          <p style={styles.winText}>Niranjan shrugs nonchalantly, adjust her Crocs, and calls it a day.</p>
          <button onClick={onComplete} className="btn-neo secondary animate-bounce-hover" style={styles.completeBtn}>
            CLAIM ACHIEVEMENT
          </button>
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
  argentinaBanner: {
    backgroundColor: '#74acdf',
    color: '#000',
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '0.75rem',
    padding: '8px',
    border: '2.5px solid #000',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
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
    height: '240px',
    overflowY: 'auto',
    textAlign: 'left',
    fontFamily: "'VT323', monospace",
    fontSize: '1.3rem',
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
