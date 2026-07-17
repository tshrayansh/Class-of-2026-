import React, { useState, useEffect } from 'react';
import LandingScreen from './pages/LandingScreen';
import CharacterSelect from './pages/CharacterSelect';
import GameContainer from './components/GameContainer';
import { Volume2, VolumeX } from 'lucide-react';
import './styles/games.css';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'select' | 'game'
  const [selectedChar, setSelectedChar] = useState(null);
  const [bgmActive, setBgmActive] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  // Global click feedback sound
  const playClick = () => {
    try {
      const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (!audioCtx) setAudioCtx(ctx);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  const toggleBgm = () => {
    playClick();

    if (bgmActive) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setBgmActive(false);
    } else {
      const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (!audioCtx) setAudioCtx(ctx);

      // Play soft arpeggiated progression: C -> Am -> F -> G
      const scale = [
        130.81, 164.81, 196.00, // C3, E3, G3
        110.00, 130.81, 164.81, // A2, C3, E3
        87.31, 130.81, 174.61,  // F2, C3, F3
        98.00, 146.83, 196.00   // G2, D3, G3
      ];

      let step = 0;
      const id = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'triangle'; // Soft and cozy

          // Determine current note in the chord progression arpeggio
          const chordIndex = Math.floor(step / 3) % 4;
          const noteIndex = (step % 3) + chordIndex * 3;
          const freq = scale[noteIndex];

          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Keep BGM volume very quiet
          gain.gain.setValueAtTime(0.012, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);

          osc.start();
          osc.stop(ctx.currentTime + 1.2);

          step++;
        } catch (err) {}
      }, 700); // 700ms beats

      setIntervalId(id);
      setBgmActive(true);
    }
  };

  const handleStart = () => {
    setView('select');
  };

  const handleSelectCharacter = (character) => {
    setSelectedChar(character);
    setView('game');
  };

  const handleBackToSelect = () => {
    playClick();
    setSelectedChar(null);
    setView('select');
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="game-layout">
      {/* Global Header with Music Control */}
      <div style={styles.globalHeader}>
        <span style={styles.logoText} className="text-retro">MNDL_RETRO_OS v2</span>
        <button onClick={toggleBgm} className="btn-neo accent" style={styles.musicBtn}>
          {bgmActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span style={styles.musicLabel}>{bgmActive ? 'BGM: ON' : 'BGM: OFF'}</span>
        </button>
      </div>

      {view === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}

      {view === 'select' && (
        <CharacterSelect onSelectCharacter={handleSelectCharacter} />
      )}

      {view === 'game' && selectedChar && (
        <GameContainer
          character={selectedChar}
          onBackToSelect={handleBackToSelect}
        />
      )}
    </div>
  );
}

const styles = {
  globalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#0a0a0c',
    borderBottom: '2.5px solid #000',
    zIndex: 100,
    flexWrap: 'wrap',
    gap: '10px',
  },
  logoText: {
    fontSize: '0.65rem',
    color: '#8e8e9f',
  },
  musicBtn: {
    fontSize: '0.75rem',
    padding: '4px 10px',
    boxShadow: '2.5px 2.5px 0px #000',
    borderWidth: '2px',
    transform: 'none',
  },
  musicLabel: {
    marginLeft: '5px',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 'bold',
  },
};
