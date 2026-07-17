import React, { useState, useEffect } from 'react';
import { ShieldAlert, Laptop, Coffee } from 'lucide-react';

export default function AnaghaGame({ onComplete }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Write Data Science Script', x: 20, y: 40 },
    { id: 2, title: 'Genotyping Checklist', x: 120, y: 100 },
  ]);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [cpuTemp, setCpuTemp] = useState(45);
  const [message, setMessage] = useState('');

  const playBleep = (pitch = 500) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  };

  // Spawn work tasks over time
  useEffect(() => {
    const timer = setInterval(() => {
      if (resolvedCount < 10) {
        spawnTask();
      }
    }, 1800);

    return () => clearInterval(timer);
  }, [resolvedCount]);

  // Adjust CPU temp based on active tasks
  useEffect(() => {
    setCpuTemp(40 + tasks.length * 12);
  }, [tasks]);

  const spawnTask = (customTitle = null) => {
    const taskTitles = [
      'Write Data Science Script',
      'Track Zebrafish Embryos',
      'Calibrate Microscope setup',
      'Read BioRxiv papers',
      'Analyze behavior data',
      'Fix centrifuge speed',
      'Debug analysis script'
    ];

    const randomTitle = customTitle || taskTitles[Math.floor(Math.random() * taskTitles.length)];
    const rx = Math.floor(Math.random() * 200) + 10;
    const ry = Math.floor(Math.random() * 160) + 30;

    setTasks((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), title: randomTitle, x: rx, y: ry }
    ]);
  };

  const handleResolve = (id) => {
    playBleep(600);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setResolvedCount((prev) => prev + 1);
  };

  const handleSelfCare = (type) => {
    playBleep(300);
    setMessage(`MAYBE LATER. Too busy working!`);
    setTimeout(() => setMessage(''), 1500);

    // Trap! Spawns 3 more tasks instantly
    spawnTask(`Analyse ${type} Data`);
    spawnTask(`Check ${type} System`);
    spawnTask(`Urgent Lab Request`);
  };

  return (
    <div style={styles.container}>
      {/* HUD Bar */}
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>50 TABS OPEN</span>
        <div style={styles.statContainer}>
          <span style={styles.statText}>TASKS RESOLVED: {resolvedCount}/10</span>
          <span style={{ ...styles.statText, color: cpuTemp > 80 ? '#ff477e' : '#ffd166' }}>
            CPU TEMP: {cpuTemp}°C
          </span>
        </div>
      </div>

      {/* OS Desktop Screen */}
      <div className="desktop-container" style={styles.desktop}>
        <div style={styles.bgWallpaper}>
          <Laptop size={70} opacity={0.1} />
          <p style={styles.bgText}>ANAGHA-OS v1.0</p>
          <p style={styles.bgSub}>Clear 10 research tasks. Avoid self-care triggers.</p>
        </div>

        {/* Dynamic Task Windows */}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="os-window"
            style={{
              ...styles.window,
              left: `${task.x}px`,
              top: `${task.y}px`,
            }}
          >
            <div style={styles.windowHeader}>
              <span style={styles.windowTitle}>task.exe</span>
              <button onClick={() => handleResolve(task.id)} style={styles.closeBtn}>×</button>
            </div>
            <div style={styles.windowBody}>
              <p style={styles.taskText}>{task.title}</p>
              <button onClick={() => handleResolve(task.id)} className="btn-neo secondary" style={styles.taskBtn}>
                RESOLVE
              </button>
            </div>
          </div>
        ))}

        {/* Warning Toast message */}
        {message && (
          <div className="distraction-alert" style={styles.alert}>
            <ShieldAlert size={16} />
            <span>{message}</span>
          </div>
        )}

        {/* Bottom Taskbar */}
        <div className="desktop-taskbar" style={styles.taskbar}>
          <div style={styles.startBtnBox}>
            <span style={styles.startBtn} className="text-retro">★ ANAGHA</span>
          </div>
          
          {/* Trap Buttons */}
          <div style={styles.trapsBox}>
            <button onClick={() => handleSelfCare('Food')} className="btn-neo accent" style={styles.trapBtn}>
              <Coffee size={14} /> EAT FOOD
            </button>
            <button onClick={() => handleSelfCare('Sleep')} className="btn-neo accent" style={styles.trapBtn}>
              💤 GO SLEEP
            </button>
          </div>
        </div>
      </div>

      {/* Win Trigger */}
      {resolvedCount >= 10 && (
        <div style={styles.winBox}>
          <p style={styles.winText}>Somehow, Anagha manages everything! CPU is cooling down.</p>
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
  desktop: {
    position: 'relative',
    height: '380px',
    backgroundColor: '#0a3c36',
    border: '3px solid #000',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  bgWallpaper: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.15)',
    pointerEvents: 'none',
  },
  bgText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '1rem',
    margin: '10px 0 5px 0',
  },
  bgSub: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '0.8rem',
    margin: 0,
  },
  window: {
    position: 'absolute',
    width: '180px',
    backgroundColor: '#dfdfdf',
    border: '2.5px solid #000',
    borderRadius: '4px',
    boxShadow: '3px 3px 0px #000',
    color: '#000',
    zIndex: 5,
  },
  windowHeader: {
    backgroundColor: '#0b6623',
    color: '#fff',
    borderBottom: '2px solid #000',
    padding: '3px 6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  windowTitle: {
    fontSize: '0.65rem',
    fontFamily: "'Press Start 2P', monospace",
  },
  closeBtn: {
    background: '#ef4444',
    color: '#000',
    border: '1.5px solid #000',
    fontSize: '0.65rem',
    width: '14px',
    height: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '2px',
    fontWeight: 'bold',
  },
  windowBody: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  taskText: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  taskBtn: {
    fontSize: '0.65rem',
    padding: '3px 10px',
    boxShadow: '1.5px 1.5px 0px #000',
    borderRadius: '4px',
    borderWidth: '1.5px',
    transform: 'none',
  },
  alert: {
    position: 'absolute',
    top: '15px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
  },
  taskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '42px',
    backgroundColor: '#c0c0c0',
    borderTop: '3px solid #000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
  },
  startBtnBox: {
    backgroundColor: '#06d6a0',
    border: '2px solid #000',
    padding: '2px 8px',
    borderRadius: '4px',
    boxShadow: '1.5px 1.5px 0px #000',
  },
  startBtn: {
    color: '#000',
    fontSize: '0.65rem',
    fontWeight: 'bold',
  },
  trapsBox: {
    display: 'flex',
    gap: '6px',
  },
  trapBtn: {
    fontSize: '0.7rem',
    padding: '4px 8px',
    boxShadow: '1.5px 1.5px 0px #000',
    borderWidth: '1.5px',
    borderRadius: '4px',
    transform: 'none',
  },
  winBox: {
    marginTop: '20px',
    borderTop: '2px dashed #444',
    paddingTop: '15px',
    textAlign: 'center',
  },
  winText: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '1rem',
    color: '#06d6a0',
    marginBottom: '10px',
  },
  completeBtn: {
    width: '100%',
  },
};
