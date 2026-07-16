import React, { useState } from 'react';
import { Droplet, Heart, ShieldAlert, Award } from 'lucide-react';

export default function SamGame({ onComplete }) {
  const [confidence, setConfidence] = useState(100);
  const [hydration, setHydration] = useState(10);
  const [samHappiness, setSamHappiness] = useState(50);
  const [logs, setLogs] = useState(['You sit opposite Sam Akka at the Mafia round table. She looks extremely innocent.']);
  const [step, setStep] = useState(0);

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev]);
  };

  const gaslightPrompts = [
    {
      claim: "You were seen near the victim's house last night, Sam!",
      response: 'Sam: "Near the house? I was in my room eating chapati with raita and playing Hollow Knight! Plus, if I were the Mafia, why would I leave clues? Think about the game theory!"',
      confidenceDrop: 25
    },
    {
      claim: "Your arguments are too defensive. You must be Mafia!",
      response: 'Sam: "Defensive? I am literally a QSI contributor and Mazhavil co-founder, I literally built half the clubs here. Why would I destroy my own server? You are reaching."',
      confidenceDrop: 30
    },
    {
      claim: "You manipulated the vote in round 1!",
      response: 'Sam: "I didn\'t manipulate, I guided the town! Look at my earrings—do these look like the earrings of a Mafia boss? You are clearly trying to frame me to cover your own tracks."',
      confidenceDrop: 42
    }
  ];

  const handleInterrogate = () => {
    if (step >= gaslightPrompts.length) {
      addLog('Sam: "You have no evidence left, Shrayansh. Admit it, I am town!"');
      return;
    }

    const currentPrompt = gaslightPrompts[step];
    addLog(`You: "${currentPrompt.claim}"`);
    setTimeout(() => {
      addLog(currentPrompt.response);
      setConfidence((prev) => Math.max(3, prev - currentPrompt.confidenceDrop));
      setStep((prev) => prev + 1);
    }, 600);
  };

  const handleStealWater = () => {
    setHydration((prev) => Math.min(100, prev + 30));
    setSamHappiness((prev) => prev + 10);
    addLog('Water Steal: You forgot your water bottle (again) and drank from Sam\'s bottle. Sam: "Shrayansh! Drink your own water... wait, I\'ll let it slide if you vote for Niranjan next round."');
    
    // Water slurp sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  };

  const handleErodeSnacks = () => {
    setSamHappiness((prev) => prev + 25);
    addLog('Erode Snack Powerup: Sam shares banana chips from Erode, Tamil Nadu. Delicious! Sam happiness: +25');
  };

  const handleTease = () => {
    setSamHappiness((prev) => prev + 40);
    setConfidence((prev) => Math.max(3, prev - 5));
    addLog('Sam bullies Shrayansh: "Did you actually think you could solve this quiz? You forgot the basic Hollow Knight lore!"');
  };

  return (
    <div style={styles.container}>
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>TRUST NO ONE</span>
        <div style={styles.statContainer}>
          <span style={styles.statText}>HYDRATION: {hydration}%</span>
          <span style={styles.statText}>SAM JOY: {samHappiness}</span>
        </div>
      </div>

      <div style={styles.mafiaScreen}>
        {/* Interrogation HUD */}
        <div style={styles.statusBar}>
          <span style={styles.barLabel} className="text-retro">PLAYER CONFIDENCE: {confidence}%</span>
          <div style={styles.barContainer}>
            <div style={{ ...styles.barFill, width: `${confidence}%` }}></div>
          </div>
        </div>

        <div style={styles.tableCenter}>
          <div style={styles.suspectCard} className="animate-shake">
            <span style={styles.samAvatar}>🎭</span>
            <span style={styles.samTitle}>SAM (MAFIA SUSPECT)</span>
          </div>
        </div>

        {/* Dashboard Actions */}
        <div style={styles.actionsGrid}>
          <button
            onClick={handleInterrogate}
            disabled={step >= gaslightPrompts.length}
            className={`btn-neo ${step >= gaslightPrompts.length ? 'disabled' : 'secondary'}`}
            style={styles.actionBtn}
          >
            🔍 Accuse with Claim #{step + 1}
          </button>
          
          <button onClick={handleStealWater} className="btn-neo secondary" style={styles.actionBtn}>
            <Droplet size={14} /> Steal Sam's Water
          </button>

          <button onClick={handleErodeSnacks} className="btn-neo secondary" style={styles.actionBtn}>
            🍌 Share Erode Snacks
          </button>

          <button onClick={handleTease} className="btn-neo secondary" style={styles.actionBtn}>
            🗣️ Request Friendly Teasing
          </button>
        </div>

        {/* Live log messages */}
        <div style={styles.logBox}>
          {logs.map((log, i) => (
            <div key={i} style={styles.logLine}>
              <span style={{ color: '#ff477e', marginRight: '6px' }}>&gt;</span> {log}
            </div>
          ))}
        </div>
      </div>

      {confidence <= 3 && (
        <div style={styles.winBox}>
          <p style={styles.winText}>
            You accuse Sam anyway. She smiles, votes you out of the server, and says: "Told you. Trust no one!"
          </p>
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
    color: '#8338ec',
    margin: 0,
  },
  statContainer: {
    display: 'flex',
    gap: '15px',
    fontFamily: "'VT323', monospace",
    fontSize: '1.4rem',
  },
  statText: {
    backgroundColor: '#000',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '2.5px solid #333',
  },
  mafiaScreen: {
    backgroundColor: '#1e1b1b',
    border: '3px solid #000',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  statusBar: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  barLabel: {
    fontSize: '0.65rem',
    marginBottom: '6px',
    color: '#b2b2c2',
  },
  barContainer: {
    height: '14px',
    backgroundColor: '#371c1c',
    border: '2.5px solid #000',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#ff477e',
    transition: 'width 0.2s ease',
  },
  tableCenter: {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0',
  },
  suspectCard: {
    backgroundColor: '#2d1e2f',
    border: '3.5px solid #ff477e',
    borderRadius: '12px',
    padding: '15px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  samAvatar: {
    fontSize: '3rem',
  },
  samTitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '0.65rem',
    color: '#ff477e',
    fontWeight: 'bold',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    '@media (max-width: 500px)': {
      gridTemplateColumns: '1fr',
    },
  },
  actionBtn: {
    fontSize: '0.75rem',
    padding: '8px 12px',
    boxShadow: '2px 2px 0px #000',
    borderWidth: '2px',
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  logBox: {
    backgroundColor: '#0c0a0a',
    border: '2.5px solid #000',
    borderRadius: '8px',
    padding: '12px',
    height: '150px',
    overflowY: 'auto',
    textAlign: 'left',
    fontFamily: "'VT323', monospace",
    fontSize: '1.3rem',
  },
  logLine: {
    marginBottom: '6px',
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
    color: '#ffd166',
    marginBottom: '10px',
  },
  completeBtn: {
    width: '100%',
  },
};
