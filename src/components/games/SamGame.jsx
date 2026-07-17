import React, { useState } from 'react';
import { Droplet, Heart, ShieldAlert, Award } from 'lucide-react';

export default function SamGame({ onComplete }) {
  const [confidence, setConfidence] = useState(100);
  const [hydration, setHydration] = useState(10);
  const [samWater, setSamWater] = useState(100);
  const [samHappiness, setSamHappiness] = useState(50);
  const [isPouring, setIsPouring] = useState(false);
  const [logs, setLogs] = useState(['You are playing Mafia with Sam Akka. She is currently making a very convincing speech.']);
  const [step, setStep] = useState(0);

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev]);
  };

  const gaslightPrompts = [
    {
      claim: "You were seen near the victim's house last night, Sam!",
      response: 'Sam: "If I were the Mafia, do you really think I\'d leave obvious clues? I was in my room playing Hollow Knight and eating chapati with raita. Your logic makes no sense."',
      confidenceDrop: 25
    },
    {
      claim: "Your arguments are too defensive. You must be Mafia!",
      response: 'Sam: "Defensive? I literally run SnT and Mazhavil. Why would I sabotage the server? You are reaching to cover your own tracks."',
      confidenceDrop: 30
    },
    {
      claim: "You manipulated the vote in round 1!",
      response: 'Sam: "I guided the town! Look at my earrings—do these look like the earrings of a cold-blooded killer? You are clearly trying to frame me."',
      confidenceDrop: 42
    }
  ];

  const handleInterrogate = () => {
    if (step >= gaslightPrompts.length) {
      addLog('Sam: "You have no arguments left. Admit it, I am innocent town."');
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
    if (isPouring) return;
    if (samWater <= 10) {
      addLog('Sam\'s water bottle is empty! You need to bring your own bottle next time.');
      return;
    }

    setIsPouring(true);
    addLog('You steal water from Sam\'s bottle because you forgot yours again.');
    
    // Slurp sound
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

    // Complete pouring after 1 second
    setTimeout(() => {
      setIsPouring(false);
      setSamWater((prev) => Math.max(10, prev - 30));
      setHydration((prev) => Math.min(100, prev + 30));
      setSamHappiness((prev) => prev + 10);
      addLog('Sam: "Shrayansh, seriously? Buy a water bottle! Fine, I will let it slide if you vote for Niranjan with me."');
    }, 1000);
  };

  const handleErodeSnacks = () => {
    setSamHappiness((prev) => prev + 25);
    addLog('Erode Snacks: Sam shares banana chips from Erode. Tasty!');
  };

  const handleTease = () => {
    setSamHappiness((prev) => prev + 40);
    setConfidence((prev) => Math.max(3, prev - 10));
    addLog('Sam: "You think you can solve this quiz? You forgot the basic Hollow Knight lore!"');
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes drip {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(35px) scale(0.6); opacity: 0; }
        }
        .drip-effect {
          animation: drip 0.6s infinite linear;
          color: #00d2ff;
          font-size: 1.2rem;
          line-height: 1;
        }
      `}</style>

      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>TRUST NO ONE</span>
        <div style={styles.statContainer}>
          <span style={styles.statText}>HYDRATION: {hydration}%</span>
          <span style={styles.statText}>SAM HAPINESS: {samHappiness}</span>
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

        {/* Animation Visual Area */}
        <div style={styles.visualArea}>
          <div style={styles.suspectCard} className="animate-shake">
            <span style={styles.samAvatar}>🎭</span>
            <span style={styles.samTitle}>SAM</span>
          </div>

          {/* Interactive Water Bottle Container */}
          <div style={styles.bottleContainer}>
            <div style={styles.bottlePosition}>
              <svg width="35" height="80" viewBox="0 0 35 80" style={{
                transition: 'transform 0.5s ease',
                transform: isPouring ? 'rotate(-95deg) translate(-5px, -15px)' : 'rotate(0deg)',
                overflow: 'visible',
              }}>
                {/* Cap */}
                <rect x="11" y="2" width="13" height="6" rx="1.5" fill="#4b5563" stroke="#000" strokeWidth="2" />
                {/* Neck */}
                <rect x="13" y="8" width="9" height="5" fill="#6b7280" stroke="#000" strokeWidth="2" />
                {/* Bottle Body */}
                <rect x="4" y="13" width="27" height="64" rx="5" fill="rgba(173, 216, 230, 0.35)" stroke="#000" strokeWidth="2" />
                {/* Fluid inside bottle */}
                <rect x="6" y={15 + (60 - samWater * 0.6)} width="23" height={samWater * 0.6} rx="3" fill="#00b4d8" opacity="0.8" style={{ transition: 'y 0.5s ease, height 0.5s ease' }} />
              </svg>
              {isPouring && (
                <div style={styles.dripLine}>
                  <div className="drip-effect" style={{ animationDelay: '0s' }}>💧</div>
                  <div className="drip-effect" style={{ animationDelay: '0.2s' }}>💧</div>
                </div>
              )}
            </div>
            
            <div style={styles.cupContainer}>
              <span style={{ fontSize: '1.5rem' }}>🥤</span>
              <span style={styles.cupText}>YOUR CUP ({hydration}%)</span>
            </div>
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
            🔍 Claim #{step + 1}
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
            You accuse Sam. She smiles, vote-kicks you, and tells you to bring your own water next time.
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
  visualArea: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: '10px 0',
    backgroundColor: '#262323',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #000',
  },
  suspectCard: {
    backgroundColor: '#2d1e2f',
    border: '3.5px solid #ff477e',
    borderRadius: '12px',
    padding: '15px 25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  samAvatar: {
    fontSize: '2.5rem',
  },
  samTitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '0.65rem',
    color: '#ff477e',
    fontWeight: 'bold',
  },
  bottleContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '20px',
    position: 'relative',
  },
  bottlePosition: {
    position: 'relative',
    height: '90px',
  },
  dripLine: {
    position: 'absolute',
    top: '5px',
    left: '-20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
  },
  cupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  cupText: {
    fontFamily: "'VT323', monospace",
    fontSize: '1.2rem',
    color: '#00b4d8',
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
    height: '130px',
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
