import React, { useState, useEffect } from 'react';
import LandingScreen from './pages/LandingScreen';
import CharacterSelect from './pages/CharacterSelect';
import GameContainer from './components/GameContainer';
import { Volume2, VolumeX } from 'lucide-react';
import './styles/games.css';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'select' | 'game'
  const [selectedChar, setSelectedChar] = useState(null);
  const [bgmActive, setBgmActive] = useState(true); // default BGM on
  const [audioCtx, setAudioCtx] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  // Group parsing logic: defaults to 'MNDL', changes to 'B21' if specified in path/hash/search
  const getGroupFromURL = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    
    if (path.includes('b21') || hash.includes('b21') || search.includes('b21')) {
      return 'B21';
    }
    return 'MNDL';
  };

  const [group, setGroup] = useState(getGroupFromURL());

  // Listen to navigation events to swap groups reactively
  useEffect(() => {
    const handleLocationChange = () => {
      setGroup(getGroupFromURL());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Catchy NES step sequencer
  const startSequencer = (ctx) => {
    const melody = [
      261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00, 493.88,
      329.63, 392.00, 523.25, 659.25, 587.33, 493.88, 523.25, 0
    ];

    let step = 0;
    const id = setInterval(() => {
      try {
        if (ctx.state === 'suspended') return;

        const note = melody[step % melody.length];
        if (note > 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note, ctx.currentTime);

          gain.gain.setValueAtTime(0.015, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);

          osc.start();
          osc.stop(ctx.currentTime + 0.18);
        }

        if (step % 2 === 0) {
          const bassProgress = [130.81, 110.00, 87.31, 98.00]; // C3 -> A2 -> F2 -> G2
          const bassFreq = bassProgress[Math.floor(step / 4) % bassProgress.length];

          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.connect(bassGain);
          bassGain.connect(ctx.destination);

          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(bassFreq, ctx.currentTime);

          bassGain.gain.setValueAtTime(0.02, ctx.currentTime);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);

          bassOsc.start();
          bassOsc.stop(ctx.currentTime + 0.35);
        }

        step++;
      } catch (err) {}
    }, 180);

    return id;
  };

  const initAudio = () => {
    let ctx = audioCtx;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioCtx(ctx);
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  };

  const playClick = () => {
    try {
      const ctx = initAudio();
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

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioCtx(ctx);

    const id = startSequencer(ctx);
    setIntervalId(id);

    return () => {
      clearInterval(id);
      ctx.close();
    };
  }, []);

  const toggleBgm = () => {
    playClick();

    if (bgmActive) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setBgmActive(false);
    } else {
      const ctx = initAudio();
      const id = startSequencer(ctx);
      setIntervalId(id);
      setBgmActive(true);
    }
  };

  const handleStart = () => {
    initAudio();
    setView('select');
  };

  const handleSelectCharacter = (character) => {
    initAudio();
    setSelectedChar(character);
    setView('game');
  };

  const handleBackToSelect = () => {
    playClick();
    setSelectedChar(null);
    setView('select');
  };

  return (
    <div className="game-layout">
      {/* Global Header with Music Control */}
      <div style={styles.globalHeader}>
        <span style={styles.logoText} className="text-retro">
          {group === 'B21' ? 'B21_RETRO_OS v2' : 'MNDL_RETRO_OS v2'}
        </span>
        <button onClick={toggleBgm} className="btn-neo accent" style={styles.musicBtn}>
          {bgmActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span style={styles.musicLabel}>{bgmActive ? 'BGM: ON' : 'BGM: OFF'}</span>
        </button>
      </div>

      {view === 'landing' && (
        <LandingScreen onStart={handleStart} initAudio={initAudio} group={group} />
      )}

      {view === 'select' && (
        <CharacterSelect onSelectCharacter={handleSelectCharacter} group={group} />
      )}

      {view === 'game' && selectedChar && (
        <GameContainer
          character={selectedChar}
          onBackToSelect={handleBackToSelect}
          initAudio={initAudio}
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
