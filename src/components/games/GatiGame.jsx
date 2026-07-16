import React, { useState } from 'react';
import { ArrowRight, HelpCircle, Utensils, Zap } from 'lucide-react';

export default function GatiGame({ onComplete }) {
  const [playerPosition, setPlayerPosition] = useState(0); // 0 to 4
  const [logs, setLogs] = useState(['You start moving Gati towards the CDH Cafeteria Exit. ETA: 30s.']);
  const [activePopup, setActivePopup] = useState(null);
  const [foodPoints, setFoodPoints] = useState(0);
  const [diwaliFight, setDiwaliFight] = useState(false);

  const gridNPCs = [
    { pos: 1, title: 'Batchmate Encounter', text: 'Batchmate: "Hey Gati! I saw your Twitter status post about evolutionary plasticity, it was epic!" Gati explains plasticity for 10 minutes. Delay: +10s.', type: 'plasticity' },
    { pos: 2, title: 'Diwali Decor Dispute', text: 'Diwali Fight: Gati complains that "No event on campus would happen if it weren\'t for me!" You argue playfully, then share sweets and hug it out. Delay: +15s.', type: 'diwali' },
    { pos: 3, title: 'Faculty Check-in', text: 'Professor: "Gati, could you handle the logistics checklist for next week\'s seminar?" Gati pulls it off at the last second. Delay: +20s.', type: 'logistics' },
    { pos: 4, title: 'Hydration Greeting', text: 'Water Filter: The CDH water filter nods in recognition. "Gati, my friend! Stay hydrated." Gati stops to chat. Delay: +5s.', type: 'filter' }
  ];

  const handleStep = () => {
    if (activePopup) {
      addLog('Dismiss the encounter card first!');
      return;
    }

    const nextPos = playerPosition + 1;
    setPlayerPosition(nextPos);

    // Look for NPC at this position
    const npc = gridNPCs.find((n) => n.pos === nextPos);
    if (npc) {
      setActivePopup(npc);
      addLog(`Encountered: ${npc.title}`);
    } else if (nextPos === 5) {
      addLog('Gati has successfully escaped the cafeteria! Exit time: 1 hour 30 seconds.');
    }

    // Step bleep sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200 + (nextPos * 80), audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  };

  const handleDismiss = () => {
    setActivePopup(null);
  };

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev]);
  };

  const handleFoodClick = (item) => {
    setFoodPoints((prev) => prev + 15);
    addLog(`Chennai Food Quest: Collected ${item}! Delicious workshop memory. +15 Foodie Points!`);
    
    // Slurp sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  };

  return (
    <div style={styles.container}>
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>EVERYONE KNOWS GATI</span>
        <div style={styles.statContainer}>
          <span style={styles.statText}>FOOD POINTS: {foodPoints}</span>
        </div>
      </div>

      <p style={styles.subtext}>
        Objective: Help Gati exit the cafeteria. Press "MOVE FORWARD" to walk, collect Chennai food on the side.
      </p>

      {/* Grid Track */}
      <div style={styles.gridTrack}>
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          let cellChar = '⬜';
          if (playerPosition === idx) cellChar = '🏃‍♂️';
          else if (idx === 5) cellChar = '🚪';
          else if (gridNPCs.some((n) => n.pos === idx)) cellChar = '💬';

          return (
            <div
              key={idx}
              style={{
                ...styles.gridCell,
                backgroundColor: playerPosition === idx ? '#ff477e' : '#2a2d34',
                borderColor: idx === 5 ? '#06d6a0' : '#000',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{cellChar}</span>
              <span style={styles.cellLabel}>
                {idx === 0 ? 'START' : idx === 5 ? 'EXIT' : `STEP ${idx}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Move buttons */}
      <div style={styles.moveArea}>
        <button
          onClick={handleStep}
          disabled={playerPosition >= 5}
          className={`btn-neo ${playerPosition >= 5 ? 'disabled' : 'secondary'}`}
          style={styles.moveBtn}
        >
          MOVE FORWARD <ArrowRight size={16} />
        </button>
      </div>

      {/* Interrogation Popups */}
      {activePopup && (
        <div style={styles.modalBg}>
          <div className="card-neo" style={styles.modalCard}>
            <h3 className="text-retro" style={styles.modalHeading}>{activePopup.title}</h3>
            <p style={styles.modalText}>{activePopup.text}</p>
            <button onClick={handleDismiss} className="btn-neo accent" style={styles.dismissBtn}>
              DISMISS DELAY ➔
            </button>
          </div>
        </div>
      )}

      {/* Chennai Food Quest Panel */}
      <div style={styles.chennaiQuest}>
        <h4 className="text-retro" style={styles.questTitle}>
          <Utensils size={14} /> Chennai Workshop Food Quest
        </h4>
        <div style={styles.foodGrid}>
          {['Ghee Roast Dosa', 'Filter Coffee', 'Idli Sambar', 'Malabar Parotta'].map((food) => (
            <button key={food} onClick={() => handleFoodClick(food)} className="btn-neo secondary" style={styles.foodBtn}>
              😋 Buy {food}
            </button>
          ))}
        </div>
      </div>

      {/* Log list */}
      <div style={styles.logBox}>
        {logs.map((log, i) => (
          <div key={i} style={styles.logLine}>
            <span style={{ color: '#06d6a0', marginRight: '6px' }}>&gt;</span> {log}
          </div>
        ))}
      </div>

      {playerPosition >= 5 && foodPoints >= 30 && (
        <div style={styles.winBox}>
          <p style={styles.winText}>
            Gati: "Oof, that took forever! But the food was amazing, and it was great catching up. Let's see the scrapbook!"
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
    color: '#06d6a0',
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
  subtext: {
    fontSize: '0.85rem',
    color: '#a3a3b3',
    margin: '0 0 20px 0',
    textAlign: 'left',
  },
  gridTrack: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
    marginBottom: '20px',
  },
  gridCell: {
    border: '2.5px solid #000',
    borderRadius: '8px',
    height: '65px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cellLabel: {
    fontSize: '0.55rem',
    fontWeight: 'bold',
    color: '#aaa',
    marginTop: '4px',
  },
  moveArea: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  moveBtn: {
    width: '100%',
    justifyContent: 'center',
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
    fontSize: '0.85rem',
    color: '#ffd166',
    margin: '0 0 12px 0',
  },
  modalText: {
    fontSize: '0.9rem',
    lineHeight: '1.4',
    marginBottom: '20px',
  },
  dismissBtn: {
    width: '100%',
    justifyContent: 'center',
  },
  chennaiQuest: {
    backgroundColor: '#1b1b22',
    border: '2.5px solid #000',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    textAlign: 'left',
  },
  questTitle: {
    fontSize: '0.75rem',
    color: '#ffd166',
    margin: '0 0 10px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  foodGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  foodBtn: {
    fontSize: '0.7rem',
    padding: '6px',
    boxShadow: '1.5px 1.5px 0px #000',
    borderWidth: '1.5px',
    transform: 'none',
  },
  logBox: {
    backgroundColor: '#0c0a0a',
    border: '2.5px solid #000',
    borderRadius: '8px',
    padding: '10px',
    height: '100px',
    overflowY: 'auto',
    textAlign: 'left',
    fontFamily: "'VT323', monospace",
    fontSize: '1.3rem',
  },
  logLine: {
    marginBottom: '4px',
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
