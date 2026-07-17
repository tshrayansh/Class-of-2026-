import React, { useState } from 'react';
import { Droplet, Heart, ShieldAlert, Award } from 'lucide-react';

export default function SamGame({ onComplete }) {
  const [confidence, setConfidence] = useState(100);
  const [hydration, setHydration] = useState(10);
  const [samWater, setSamWater] = useState(100);
  const [samHappiness, setSamHappiness] = useState(50);
  const [isPouring, setIsPouring] = useState(false);
  const [logs, setLogs] = useState(['You sit opposite Sam Akka at the Mafia table. She is defending herself.']);
  const [round, setRound] = useState(0); // 0, 1, 2, 3 (showdown)

  const playBleep = (pitch = 440, duration = 0.08, type = 'sine') => {
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

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev]);
  };

  // Interrogation dialogue data
  const mafiaRounds = [
    {
      claim: 'Sam: "I was in my room playing Hollow Knight and eating chapati with raita. I wasn\'t anywhere near the crime scene!"',
      options: [
        {
          text: '👉 Accuse food combo: "Raita with chapati is unhinged. You are guilty!"',
          logMsg: 'You: "Raita with chapati is a crime in itself. You must be guilty!"',
          reply: 'Sam: "Raita goes with everything, Shrayansh! Also, you have no evidence. Expected utility of your accusation: Zero."',
          confidenceDrop: 25
        },
        {
          text: '👉 Expose timeline: "You usually go downstairs at night for Red Cafe orders. Explain that!"',
          logMsg: 'You: "We know you slip downstairs to collect Red Cafe orders at midnight. Did anyone verify your timeline?"',
          reply: 'Sam: "I was eating noodles with raita in my room. Ask SnT, they saw me online. Try again."',
          confidenceDrop: 30
        }
      ]
    },
    {
      claim: 'Sam: "I run Mazhavil and QSI. Why would I sabotage the server? It would destroy my own work!"',
      options: [
        {
          text: '👉 Point to puzzles: "You love brain teasers. Sabotaging the server is the ultimate puzzle for you!"',
          logMsg: 'You: "You are a master of games and puzzles. Sabotaging is just another teaser for you!"',
          reply: 'Sam: "Puzzles have logical endings. This accusation is just messy. Your confidence is slipping."',
          confidenceDrop: 25
        },
        {
          text: '👉 Point to card manipulation: "You manipulate the hell out of us in board games. You are doing it now!"',
          logMsg: 'You: "You are a Mafia legend. You gaslight us in card games, and you are gaslighting me now!"',
          reply: 'Sam: "Gaslighting? That\'s just game theory! Look at my earrings—do they look like the earrings of a killer?"',
          confidenceDrop: 35
        }
      ]
    },
    {
      claim: 'Sam: "I am innocent town. If you vote me out, the town loses the game. Let\'s vote Niranjan instead."',
      options: [
        {
          text: '👉 Hold firm: "I don\'t care about the earrings or the rants. I am voting you out!"',
          logMsg: 'You: "I am locking in my vote on you, Sam!"',
          reply: 'Sam: "Then you just handed the win to the Mafia. Good job, detective!"',
          confidenceDrop: 40
        },
        {
          text: '👉 Check vote logic: "Why vote Niranjan? You are trying to deflect!"',
          logMsg: 'You: " Deflecting to Niranjan is a classic Mafia tell!"',
          reply: 'Sam: "Niranjan pacing in his Crocs is way more suspicious than me eating raita!"',
          confidenceDrop: 35
        }
      ]
    }
  ];

  const handleChooseOption = (opt) => {
    playBleep(520, 0.08);
    addLog(opt.logMsg);

    setTimeout(() => {
      playBleep(350, 0.12, 'triangle');
      addLog(opt.reply);
      setConfidence((prev) => Math.max(3, prev - opt.confidenceDrop));
      setRound((prev) => prev + 1);
    }, 600);
  };

  const handleStealWater = () => {
    if (isPouring) return;
    if (samWater <= 10) {
      playBleep(280, 0.1);
      addLog('Sam\'s water bottle is empty!');
      return;
    }

    setIsPouring(true);
    playBleep(300, 0.08);
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

    setTimeout(() => {
      setIsPouring(false);
      setSamWater((prev) => Math.max(10, prev - 30));
      setHydration((prev) => Math.min(100, prev + 30));
      setSamHappiness((prev) => prev + 15);
      addLog('Sam: "Seriously, Shrayansh? Go buy a water bottle! I\'ll let it pass if you check Niranjan next round."');
    }, 1000);
  };

  const handleErodeSnacks = () => {
    playBleep(580, 0.08);
    setSamHappiness((prev) => prev + 25);
    addLog('Erode Snacks: You eat banana chips from Erode. Sam smiles.');
  };

  const currentRoundData = mafiaRounds[round];
  const isShowdown = round >= 3 || confidence <= 3;

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
            <p style={styles.speechText}>
              {!isShowdown ? currentRoundData.claim : '"I rest my case. Vote now."'}
            </p>
          </div>

          {/* Interactive Water Bottle Container */}
          <div style={styles.bottleContainer}>
            <div style={styles.bottlePosition}>
              <svg width="35" height="80" viewBox="0 0 35 80" style={{
                transition: 'transform 0.5s ease',
                transform: isPouring ? 'rotate(-95deg) translate(-5px, -15px)' : 'rotate(0deg)',
                overflow: 'visible',
              }}>
                <rect x="11" y="2" width="13" height="6" rx="1.5" fill="#4b5563" stroke="#000" strokeWidth="2" />
                <rect x="13" y="8" width="9" height="5" fill="#6b7280" stroke="#000" strokeWidth="2" />
                <rect x="4" y="13" width="27" height="64" rx="5" fill="rgba(173, 216, 230, 0.35)" stroke="#000" strokeWidth="2" />
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
          {!isShowdown ? (
            currentRoundData.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChooseOption(opt)}
                className="btn-neo secondary"
                style={styles.actionBtn}
              >
                {opt.text}
              </button>
            ))
          ) : (
            <div style={styles.showdownLabel} className="text-retro">SHOWDOWN PHASE</div>
          )}
          
          <button onClick={handleStealWater} className="btn-neo secondary" style={styles.actionBtn}>
            💧 Steal Sam\'s Water
          </button>

          <button onClick={handleErodeSnacks} className="btn-neo secondary" style={styles.actionBtn}>
            🍌 Share Erode Snacks
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

      {isShowdown && (
        <div style={styles.winBox}>
          <p style={styles.winText}>
            You locks in your accusation. Sam smiles, vote-kicks you from the server, and tells you to buy your own water bottle next semester.
          </p>
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
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #000',
  },
  suspectCard: {
    backgroundColor: '#2d1e2f',
    border: '3.5px solid #ff477e',
    borderRadius: '12px',
    padding: '12px 15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    width: '60%',
  },
  samAvatar: {
    fontSize: '2rem',
  },
  samTitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '0.65rem',
    color: '#ff477e',
    fontWeight: 'bold',
  },
  speechText: {
    fontSize: '0.85rem',
    margin: '6px 0 0 0',
    lineHeight: '1.3',
    color: '#e5e7eb',
    fontStyle: 'italic',
  },
  bottleContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '15px',
    position: 'relative',
  },
  bottlePosition: {
    position: 'relative',
    height: '90px',
  },
  dripLine: {
    position: 'absolute',
    top: '5px',
    left: '-15px',
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
    fontSize: '1.1rem',
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
  showdownLabel: {
    gridColumn: '1 / -1',
    backgroundColor: '#3b0712',
    color: '#ef476f',
    padding: '8px',
    border: '2px solid #000',
    borderRadius: '4px',
    fontSize: '0.75rem',
  },
  logBox: {
    backgroundColor: '#0c0a0a',
    border: '2.5px solid #000',
    borderRadius: '8px',
    padding: '12px',
    height: '120px',
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
