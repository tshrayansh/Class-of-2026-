import React, { useState } from 'react';
import { Play } from 'lucide-react';

export default function SoujatyaGame({ onComplete }) {
  const [nodes, setNodes] = useState([
    { id: 'start', label: 'Dada, seen this movie?', x: 50, y: 50, parentId: null, noteName: 'C4', freq: 261.63, quotes: 'Soujatya: "Ah, yes! Speaking of films, did you know that the director was heavily inspired by the postwar Bengal culture? In fact..."' }
  ]);
  const [logs, setLogs] = useState(['You asked Dada an innocent question about a movie. Try clicking nodes to play notes!']);
  const [topicCount, setTopicCount] = useState(1);
  const [activeLineId, setActiveLineId] = useState(null);

  const topicPool = [
    { label: '70s Bollywood', noteName: 'D4', freq: 293.66, quotes: 'Soujatya: "The lyrics in Kishore Kumar songs were pure poetry. Let me quote a couple of Urdu shayaris that capture this exact feeling..."' },
    { label: 'Urdu Poetry', noteName: 'E4', freq: 329.63, quotes: 'Soujatya: "Ghalib once wrote about the pain of existence. If you translate the Punjabi folklore from the same era, you find this beautiful connection..."' },
    { label: 'Bhopal History', noteName: 'G4', freq: 392.00, quotes: 'Soujatya: "Bhopal has such rich architecture. Speaking of that, the political landscape of central India in the 19th century was..."' },
    { label: 'Zebrafish Biology', noteName: 'A4', freq: 440.00, quotes: 'Soujatya: "From a scientific standpoint, the heart rate changes under adrenaline. Which is similar to the metabolic curves in evolutionary biology..."' },
    { label: 'Obscure Fact #42', noteName: 'C5', freq: 523.25, quotes: 'Soujatya: "Did you know that the first printing press in India was actually imported by Jesuits in Goa in 1556? Which changed education policy..."' },
    { label: 'Classical Music', noteName: 'D5', freq: 587.33, quotes: 'Soujatya: "Rabindra Sangeet has these ragas that resemble old Sufi tunes. If you listen to this 1952 recording, you can hear..."' },
    { label: 'Political Philosophy', noteName: 'E5', freq: 659.25, quotes: 'Soujatya: "The impact of early socialist newsletters in Kolkata was massive. In fact, if you look at their literary columns..."' }
  ];

  const playSynthNode = (freq) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'triangle'; // Cozy chiptune pluck
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      // Make it sound like a nice musical synth key pluck
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}
  };

  const handleNodeClick = (node) => {
    // Play the node's chiptune note!
    playSynthNode(node.freq);
    addLog(`[Note: ${node.noteName}] - ${node.quotes}`);
    
    // Set line active for glowing flash
    if (node.parentId) {
      setActiveLineId(node.id);
      setTimeout(() => setActiveLineId(null), 300);
    }

    // Spawn new nodes
    const availablePool = topicPool.filter((p) => !nodes.some((n) => n.label === p.label));
    if (availablePool.length === 0) return;

    const spawnedCount = Math.min(availablePool.length, 2);
    const newNodes = [];
    
    for (let i = 0; i < spawnedCount; i++) {
      const idx = Math.floor(Math.random() * availablePool.length);
      const item = availablePool[idx];
      availablePool.splice(idx, 1);

      // Distribute coordinates nicely around parent
      const angle = Math.random() * Math.PI * 2;
      const distance = 25; // radius distance %
      const rx = Math.max(10, Math.min(90, node.x + Math.cos(angle) * distance));
      const ry = Math.max(15, Math.min(85, node.y + Math.sin(angle) * distance));

      newNodes.push({
        id: Date.now() + Math.random(),
        label: item.label,
        x: rx,
        y: ry,
        noteName: item.noteName,
        freq: item.freq,
        parentId: node.id,
        quotes: item.quotes
      });
    }

    setNodes((prev) => [...prev, ...newNodes]);
    setTopicCount((prev) => prev + spawnedCount);
  };

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>CONVERSATION SYNTHESIZER</span>
        <span style={styles.badge} className="text-mono">NODES ACTIVE: {topicCount}</span>
      </div>

      <p style={styles.subtext}>
        Click on conversation nodes to read Dada's commentary and compose your own chiptune arpeggio!
      </p>

      {/* Interactive Mind Map Space */}
      <div className="map-canvas-container" style={styles.mapCanvas}>
        {/* SVG connection lines overlay */}
        <svg style={styles.svgOverlay}>
          {nodes.map((node) => {
            if (!node.parentId) return null;
            const parent = nodes.find((n) => n.id === node.parentId);
            if (!parent) return null;
            const isActive = activeLineId === node.id;
            return (
              <line
                key={node.id}
                x1={`${parent.x}%`}
                y1={`${parent.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke={isActive ? '#ffd166' : '#475569'}
                strokeWidth={isActive ? '4' : '2.5'}
                strokeDasharray="4 4"
                style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
              />
            );
          })}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => handleNodeClick(node)}
            className="node-bubble"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              border: '2.5px solid #000',
              boxShadow: '3px 3px 0px #000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '6px 12px',
              backgroundColor: '#1b1b22',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>{node.label}</span>
            <span style={{ fontSize: '0.55rem', color: '#ff477e', fontFamily: "'Press Start 2P', monospace", marginTop: '2px' }}>
              [{node.noteName}]
            </span>
          </div>
        ))}
      </div>

      <div style={styles.logPanel}>
        <h4 style={styles.logLabel} className="text-retro">DADA DIALOGUE LOG & NOTE LOG:</h4>
        <div style={styles.logBox}>
          {logs.map((log, i) => (
            <div key={i} style={styles.logLine}>
              <span style={{ color: '#ffd166', marginRight: '6px' }}>&gt;</span> {log}
            </div>
          ))}
        </div>
      </div>

      {topicCount >= 7 && (
        <div style={styles.winBox}>
          <p style={styles.winText}>
            You accept the Dada wisdom. Getting lost in a conversation with him is the best part.
          </p>
          <button onClick={() => { playSynthNode(880); onComplete(); }} className="btn-neo secondary animate-bounce-hover" style={styles.completeBtn}>
            ACCEPT DADA WISDOM 🌌
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
    position: 'relative',
  },
  hud: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '3px solid #000',
    paddingBottom: '12px',
    marginBottom: '10px',
  },
  hudTitle: {
    fontSize: '1.2rem',
    color: '#ffd166',
    margin: 0,
  },
  badge: {
    backgroundColor: '#ffd166',
    color: '#000',
    padding: '3px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    border: '2px solid #000',
  },
  subtext: {
    fontSize: '0.85rem',
    color: '#a3a3b3',
    margin: '0 0 15px 0',
    textAlign: 'left',
  },
  mapCanvas: {
    height: '240px',
    backgroundColor: '#0b0f19',
    position: 'relative',
    border: '3px solid #000',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  },
  logPanel: {
    textAlign: 'left',
    marginTop: '15px',
  },
  logLabel: {
    fontSize: '0.75rem',
    color: '#ffd166',
    margin: '0 0 6px 0',
  },
  logBox: {
    backgroundColor: '#070a13',
    border: '2.5px solid #000',
    borderRadius: '6px',
    padding: '10px',
    height: '100px',
    overflowY: 'auto',
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
