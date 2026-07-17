import React from 'react';
import { characters } from '../data/characters';
import { Sword, Shield, Zap, Sparkles, AlertCircle } from 'lucide-react';

export default function CharacterSelect({ onSelectCharacter, group }) {
  const isB21 = group === 'B21';
  const filteredCharacters = characters.filter((c) => {
    const isB21Member = ['aryan', 'gati', 'anuthi'].includes(c.id);
    return isB21 ? isB21Member : !isB21Member;
  });
  
  // Synthetic retro bleep on hover
  const playHoverSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  };

  const playSelectSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4
      osc2.frequency.setValueAtTime(329.63, audioCtx.currentTime + 0.1); // E4
      osc2.frequency.setValueAtTime(392.00, audioCtx.currentTime + 0.2); // G4
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.35);
      osc2.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  };

  const handleSelect = (char) => {
    playSelectSound();
    onSelectCharacter(char);
  };

  // Helper to render class icons
  const getClassIcon = (id) => {
    switch (id) {
      case 'yuktha': return <Sparkles size={16} style={{ color: '#ff477e' }} />;
      case 'anagha': return <Zap size={16} style={{ color: '#06d6a0' }} />;
      case 'anuthi': return <Shield size={16} style={{ color: '#ffd166' }} />;
      case 'aryan': return <Sword size={16} style={{ color: '#118ab2' }} />;
      default: return <Sparkles size={16} style={{ color: '#8338ec' }} />;
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="glitch-text text-retro" style={styles.title}>
        CHOOSE YOUR CHARACTER
      </h1>
      <p className="text-mono" style={styles.subtitle}>
        Select a player to begin their unique farewell experience.
      </p>

      {/* Grid of Characters */}
      <div style={styles.grid}>
        {filteredCharacters.map((char) => {
          // Construct portrait paths to try:
          // Because user can have profile.jpg or profile.jpeg
          const path = window.location.pathname.toLowerCase();
          const basePrefix = (path.includes('/b21') || path.includes('/mndl')) ? '../' : './';
          const imageUrl = `${basePrefix}characters/${char.id}/${char.portrait}`;

          return (
            <div
              key={char.id}
              onClick={() => handleSelect(char)}
              onMouseEnter={playHoverSound}
              className="card-neo animate-bounce-hover"
              style={styles.card}
            >
              {/* Image Container with SVG Fallback */}
              <div style={styles.imageWrapper}>
                <img
                  src={imageUrl}
                  alt={char.name}
                  style={styles.portrait}
                  onError={(e) => {
                    // Fallback to stylized SVG avatar if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{ ...styles.avatarFallback, backgroundColor: char.gender === 'female' ? '#ff477e' : '#118ab2' }}>
                  <span style={styles.fallbackText}>{char.name[0]}</span>
                  <span style={styles.fallbackSub}>PHOTO MISSING</span>
                </div>
              </div>

              {/* Title Badge */}
              <div style={styles.badgeRow}>
                <div style={styles.badge}>
                  {getClassIcon(char.id)}
                  <span style={styles.badgeText}>{char.title}</span>
                </div>
              </div>

              {/* Info Area */}
              <div style={styles.infoArea}>
                <h2 className="text-retro" style={styles.charName}>{char.name}</h2>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>CLASS STAT:</span>
                  <span style={styles.statVal} className="text-mono">{char.stat}</span>
                </div>
              </div>

              {/* Retro arcade details */}
              <div style={styles.cardFooter}>
                <span style={styles.footerText}>PRESS START TO PLAY</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '2rem',
    color: '#ff477e',
    margin: '0 0 10px 0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.4rem',
    color: '#8e8e9f',
    margin: '0 0 40px 0',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    width: '100%',
    maxWidth: '1200px',
    paddingBottom: '40px',
  },
  card: {
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1b1b22',
    height: '350px',
    justifyContent: 'space-between',
    padding: '15px',
    border: '3px solid #000',
    borderRadius: '16px',
  },
  imageWrapper: {
    width: '100%',
    height: '170px',
    borderRadius: '8px',
    border: '3px solid #000',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#2a2a35',
  },
  portrait: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarFallback: {
    display: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
  },
  fallbackText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#000',
  },
  fallbackSub: {
    fontFamily: "'VT323', monospace",
    fontSize: '1.2rem',
    marginTop: '5px',
    letterSpacing: '1px',
    backgroundColor: '#ffd166',
    padding: '2px 8px',
    border: '2px solid #000',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  badgeRow: {
    display: 'flex',
    marginTop: '12px',
  },
  badge: {
    backgroundColor: '#000',
    border: '2px solid #333',
    borderRadius: '20px',
    padding: '4px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  badgeText: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: '0.5px',
  },
  infoArea: {
    textAlign: 'left',
    marginTop: '10px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  charName: {
    fontSize: '1.4rem',
    color: '#fff',
    margin: '0 0 6px 0',
  },
  statBox: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#0f0f13',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1.5px solid #000',
    marginBottom: '8px',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '0.75rem',
    color: '#8e8e9f',
    fontWeight: 'bold',
  },
  statVal: {
    fontSize: '1.2rem',
    color: '#ffd166',
    fontWeight: 'bold',
  },
  bio: {
    fontSize: '0.85rem',
    color: '#b2b2c2',
    margin: '0',
    lineHeight: '1.4',
  },
  cardFooter: {
    borderTop: '2px dashed #333',
    paddingTop: '10px',
    marginTop: '10px',
    textAlign: 'center',
  },
  footerText: {
    fontFamily: "'VT323', monospace",
    fontSize: '1.2rem',
    color: '#ff477e',
    letterSpacing: '1px',
  },
};
