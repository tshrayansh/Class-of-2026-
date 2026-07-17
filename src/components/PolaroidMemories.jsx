import React, { useState, useRef, useEffect } from 'react';
import { RefreshCcw, Home } from 'lucide-react';

export default function PolaroidMemories({ character, onPlayAgain, onBackToSelect }) {
  const containerRef = useRef(null);
  const [polaroids, setPolaroids] = useState([]);

  // Default doodle names for fallback
  const fallbackDoodles = [
    'Zebrafish Lab Shenanigans 🐟',
    'Canteen Late Night Food Hunt 🍽️',
    'Diwali Garba Night 💃',
    'Late Night Exam Cram ☕',
  ];

  // Initialize scattered polaroids
  useEffect(() => {
    if (character && character.memories) {
      const initial = character.memories.map((filename, index) => {
        // Scatter positions within safe ranges
        const x = 30 + (index * 80) % 250;
        const y = 20 + (index * 60) % 150;
        const rot = Math.random() * 24 - 12; // rotate -12 to 12 degrees
        return {
          id: index,
          filename,
          title: fallbackDoodles[index % fallbackDoodles.length],
          x,
          y,
          rotation: rot,
          isDragging: false,
          zIndex: index + 10,
        };
      });
      setPolaroids(initial);
    }
  }, [character]);

  const bringToFront = (id) => {
    setPolaroids((prev) => {
      const maxZ = Math.max(...prev.map((p) => p.zIndex), 0);
      return prev.map((p) => (p.id === id ? { ...p, zIndex: maxZ + 1 } : p));
    });
  };

  // Drag handlers
  const handleDragStart = (id, e) => {
    e.preventDefault();
    bringToFront(id);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const target = polaroids.find((p) => p.id === id);
    if (!target) return;

    const startX = clientX - target.x;
    const startY = clientY - target.y;

    const handleDragMove = (moveEvt) => {
      const moveX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const moveY = moveEvt.touches ? moveEvt.touches[0].clientY : moveEvt.clientY;

      setPolaroids((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, x: moveX - startX, y: moveY - startY }
            : p
        )
      );
    };

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('touchend', handleDragEnd);
  };

  return (
    <div style={styles.container}>
      <h1 className="text-retro" style={styles.heading}>
        MEMORIES OF {character.name.toUpperCase()}
      </h1>
      <p style={styles.subtext}>
        Drag and sort the polaroids to tidy up the scrapbook! Click on the letter below to read the message.
      </p>

      {/* Draggable Scrapbook Board Canvas */}
      <div className="scrapbook-canvas" ref={containerRef} style={styles.canvas}>
        {polaroids.map((p) => {
          const imageUrl = `./characters/${character.id}/${p.filename}`;
          
          return (
            <div
              key={p.id}
              className="polaroid"
              onMouseDown={(e) => handleDragStart(p.id, e)}
              onTouchStart={(e) => handleDragStart(p.id, e)}
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                transform: `rotate(${p.rotation}deg)`,
                zIndex: p.zIndex,
              }}
            >
              <img
                src={imageUrl}
                alt={p.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={styles.polaroidDoodle}>
                <span style={styles.doodleEmoji}>📸</span>
                <span style={styles.doodleText}>Memory Photo</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sincere handwritten letter */}
      <div className="handwritten-letter-box" style={styles.letterBox}>
        <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{character.farewellMessage}</p>
      </div>

      {/* Navigation Footer */}
      <div style={styles.navFooter}>
        <button onClick={onPlayAgain} className="btn-neo secondary animate-bounce-hover" style={styles.navBtn}>
          <RefreshCcw size={16} /> PLAY AGAIN
        </button>
        <button onClick={onBackToSelect} className="btn-neo accent animate-bounce-hover" style={styles.navBtn}>
          <Home size={16} /> CHARACTER SELECT
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    boxSizing: 'border-box',
    animation: 'fadeIn 0.6s ease forwards',
  },
  heading: {
    fontSize: '2rem',
    color: '#ff477e',
    margin: '0 0 10px 0',
  },
  subtext: {
    fontSize: '0.95rem',
    color: '#a3a3b3',
    margin: '0 0 20px 0',
    lineHeight: '1.4',
  },
  canvas: {
    width: '100%',
    height: '420px',
    position: 'relative',
    backgroundColor: '#eedec9',
    borderRadius: '12px',
    border: '3px solid #000',
    overflow: 'hidden',
  },
  polaroidDoodle: {
    display: 'none',
    width: '100%',
    aspectRatio: '1',
    backgroundColor: '#fffdf0',
    border: '1.5px dashed #aaa',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    padding: '10px',
    boxSizing: 'border-box',
  },
  doodleEmoji: {
    fontSize: '2.5rem',
    marginBottom: '8px',
  },
  doodleText: {
    fontFamily: "'Gochi Hand', cursive",
    fontSize: '1.2rem',
    color: '#2b2b2b',
    textAlign: 'center',
    lineHeight: '1.2',
  },
  letterBox: {
    marginTop: '30px',
    textAlign: 'left',
  },
  navFooter: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '30px',
    paddingBottom: '4px',
  },
  navBtn: {
    fontSize: '1rem',
    padding: '12px 24px',
  },
};
