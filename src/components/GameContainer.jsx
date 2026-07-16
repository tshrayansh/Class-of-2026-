import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Eye } from 'lucide-react';
import PolaroidMemories from './PolaroidMemories';

// Import all games
import YukthaGame from './games/YukthaGame';
import AnaghaGame from './games/AnaghaGame';
import AnuthiGame from './games/AnuthiGame';
import AryanGame from './games/AryanGame';
import NiranjanGame from './games/NiranjanGame';
import SamGame from './games/SamGame';
import SoujatyaGame from './games/SoujatyaGame';
import GatiGame from './games/GatiGame';

export default function GameContainer({ character, onBackToSelect }) {
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'completed' | 'scrapbook'

  // Synthetic 8-bit win fanfare sfx
  const playWinSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
      
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.08);
        
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.08 + 0.15);
        
        osc.start(audioCtx.currentTime + index * 0.08);
        osc.stop(audioCtx.currentTime + index * 0.08 + 0.16);
      });
    } catch (e) {}
  };

  const handleGameComplete = () => {
    playWinSound();
    
    // Blast confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    setGameState('completed');
  };

  const handleOpenScrapbook = () => {
    setGameState('scrapbook');
  };

  const handlePlayAgain = () => {
    setGameState('playing');
  };

  // Render the correct game component
  const renderGame = () => {
    switch (character.id) {
      case 'yuktha':
        return <YukthaGame onComplete={handleGameComplete} />;
      case 'anagha':
        return <AnaghaGame onComplete={handleGameComplete} />;
      case 'anuthi':
        return <AnuthiGame onComplete={handleGameComplete} />;
      case 'aryan':
        return <AryanGame onComplete={handleGameComplete} />;
      case 'niranjan':
        return <NiranjanGame onComplete={handleGameComplete} />;
      case 'sam':
        return <SamGame onComplete={handleGameComplete} />;
      case 'soujatya':
        return <SoujatyaGame onComplete={handleGameComplete} />;
      case 'gati':
        return <GatiGame onComplete={handleGameComplete} />;
      default:
        return <div>Game Not Found.</div>;
    }
  };

  return (
    <div style={styles.container}>
      {gameState === 'playing' && (
        <div style={styles.gameWrapper}>
          <div style={styles.header}>
            <button onClick={onBackToSelect} className="btn-neo secondary" style={styles.backBtn}>
              ⇤ SELECT SELECT SELECT
            </button>
            <span style={styles.nowPlaying} className="text-retro">PLAYER: {character.name.toUpperCase()}</span>
          </div>
          <div style={styles.gameContent}>{renderGame()}</div>
        </div>
      )}

      {gameState === 'completed' && (
        <div style={styles.overlay}>
          <div className="card-neo animate-shake" style={styles.badgeCard}>
            <div style={styles.badgePulse}>
              <Award size={64} color="#000" fill="#ffd166" />
            </div>
            <p style={styles.unlockedText} className="text-retro">ACHIEVEMENT UNLOCKED!</p>
            <h2 style={styles.achievementName} className="text-retro">{character.achievement}</h2>
            
            <p style={styles.congratsSub}>
              Congratulations! You completed {character.name}'s challenge. A chest of memories has unlocked.
            </p>

            <button onClick={handleOpenScrapbook} className="btn-neo secondary animate-bounce-hover" style={styles.scrapbookBtn}>
              <Eye size={18} /> OPEN SCRAPBOOK MEMORIES
            </button>
          </div>
        </div>
      )}

      {gameState === 'scrapbook' && (
        <PolaroidMemories
          character={character}
          onPlayAgain={handlePlayAgain}
          onBackToSelect={onBackToSelect}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  gameWrapper: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    animation: 'fadeIn 0.5s ease forwards',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  backBtn: {
    fontSize: '0.85rem',
    padding: '6px 12px',
    boxShadow: '2px 2px 0px #000',
    borderWidth: '2px',
  },
  nowPlaying: {
    fontSize: '0.8rem',
    color: '#ff477e',
    backgroundColor: '#000',
    padding: '4px 10px',
    borderRadius: '4px',
    border: '2px solid #333',
  },
  gameContent: {
    marginTop: '10px',
  },
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.4s ease forwards',
  },
  badgeCard: {
    maxWidth: '450px',
    backgroundColor: '#1b1b22',
    color: '#fff',
    textAlign: 'center',
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '4px solid #000',
    borderRadius: '16px',
  },
  badgePulse: {
    animation: 'pulse 1.5s infinite alternate',
    marginBottom: '20px',
  },
  unlockedText: {
    fontSize: '0.75rem',
    color: '#ffd166',
    margin: '0 0 10px 0',
  },
  achievementName: {
    fontSize: '1.4rem',
    color: '#ff477e',
    margin: '0 0 20px 0',
    lineHeight: '1.3',
  },
  congratsSub: {
    fontSize: '0.9rem',
    color: '#b2b2c2',
    lineHeight: '1.4',
    margin: '0 0 30px 0',
  },
  scrapbookBtn: {
    width: '100%',
    justifyContent: 'center',
    padding: '12px',
    fontSize: '1.05rem',
  },
};
