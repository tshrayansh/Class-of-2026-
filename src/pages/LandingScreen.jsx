import React, { useState, useEffect } from 'react';
import { Terminal, Play } from 'lucide-react';

export default function LandingScreen({ onStart }) {
  const [logs, setLogs] = useState([]);
  const [bootComplete, setBootComplete] = useState(false);

  const bootLogs = [
    'Initializing MNDL-OS v2026.07...',
    'Scanning zebrafish research facility...',
    'Loading academic advice databases...',
    'Warning: 8 players are about to disconnect from server.',
    'Establishing MP-Bhopal connection...',
    'Importing Erode snacks cache...',
    'Vegetarian alliance status: ACTIVE.',
    'Argentina supporter flags: DETECTED.',
    'System ready.'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 600);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const playStartSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Node 1: Synth beep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime); // start at 300Hz
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.35); // sweep up
      
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.log('AudioContext not allowed or not supported yet');
    }
  };

  const handleStart = () => {
    playStartSound();
    onStart();
  };

  return (
    <div style={styles.container}>
      {/* Dynamic Grid Background */}
      <div style={styles.scanlines}></div>

      {/* Floating retro emoji stickers */}
      <span className="sticker" style={{ top: '15%', left: '10%', fontSize: '3rem' }}>🐟</span>
      <span className="sticker" style={{ top: '20%', right: '12%', fontSize: '2.5rem', animationDelay: '1s' }}>🎓</span>
      <span className="sticker" style={{ bottom: '25%', left: '15%', fontSize: '2.8rem', animationDelay: '2s' }}>🎮</span>
      <span className="sticker" style={{ bottom: '15%', right: '15%', fontSize: '3.2rem', animationDelay: '1.5s' }}>💌</span>

      <div style={styles.terminalCard}>
        {/* Terminal Header */}
        <div style={styles.terminalHeader}>
          <div style={styles.dots}>
            <span style={{ ...styles.dot, backgroundColor: '#ff5f56' }}></span>
            <span style={{ ...styles.dot, backgroundColor: '#ffbd2e' }}></span>
            <span style={{ ...styles.dot, backgroundColor: '#27c93f' }}></span>
          </div>
          <span style={styles.titleText}>mndl_server_log.sh</span>
        </div>

        {/* Terminal Body */}
        <div style={styles.terminalBody}>
          {logs.map((log, i) => (
            <div key={i} style={styles.logLine}>
              <span style={styles.promptChar}>&gt;</span> {log}
            </div>
          ))}
          {!bootComplete && <span style={styles.cursor}>█</span>}
        </div>
      </div>

      {bootComplete && (
        <div style={styles.contentBox}>
          <h1 className="glitch-text text-retro" style={styles.heading}>
            8 PLAYERS ARE ABOUT TO LEAVE THE SERVER.
          </h1>
          <p className="text-mono" style={styles.subtitle}>
            Before they log out, there's one last game to play.
          </p>

          <button onClick={handleStart} className="btn-neo accent animate-bounce-hover" style={styles.startButton}>
            <Play size={20} fill="#000" />
            START GAME
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#0a0a0c',
    position: 'relative',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  scanlines: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
    backgroundSize: '100% 4px, 6px 100%',
    zIndex: 2,
    pointerEvents: 'none',
  },
  terminalCard: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#1c1c1f',
    border: '3px solid #000',
    borderRadius: '10px',
    boxShadow: '8px 8px 0px #000',
    overflow: 'hidden',
    marginBottom: '30px',
    textAlign: 'left',
    zIndex: 3,
  },
  terminalHeader: {
    backgroundColor: '#2e2e33',
    borderBottom: '3px solid #000',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    position: 'relative',
  },
  dots: {
    display: 'flex',
    gap: '6px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '1.5px solid #000',
  },
  titleText: {
    fontFamily: "'VT323', monospace",
    fontSize: '1.3rem',
    color: '#8e8e9f',
    marginLeft: '15px',
  },
  terminalBody: {
    fontFamily: "'VT323', monospace",
    fontSize: '1.5rem',
    color: '#00ff66',
    padding: '15px',
    minHeight: '180px',
  },
  logLine: {
    marginBottom: '4px',
  },
  promptChar: {
    color: '#ff477e',
  },
  cursor: {
    animation: 'blink 1s step-end infinite',
    color: '#00ff66',
  },
  contentBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '750px',
    zIndex: 3,
    animation: 'fadeIn 0.5s ease forwards',
  },
  heading: {
    fontSize: '2.2rem',
    color: '#ffd166',
    margin: '0 0 15px 0',
    letterSpacing: '-1px',
    lineHeight: '1.3',
  },
  subtitle: {
    color: '#fff',
    fontSize: '1.6rem',
    margin: '0 0 25px 0',
  },
  startButton: {
    fontSize: '1.3rem',
    padding: '14px 28px',
  },
};
