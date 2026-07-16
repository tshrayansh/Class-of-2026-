import React, { useState } from 'react';
import { HelpCircle, Star, Award } from 'lucide-react';

export default function SoujatyaGame({ onComplete }) {
  const [nodes, setNodes] = useState([
    { id: 'start', label: 'Dada, seen this movie?', x: 50, y: 50, active: true, quotes: 'Soujatya: "Ah, yes! Speaking of films, did you know that the director was heavily inspired by the cultural shift in postwar Bengal? In fact..."' }
  ]);
  const [logs, setLogs] = useState(['You asked Dada an innocent question about a movie...']);
  const [topicCount, setTopicCount] = useState(1);

  const topicPool = [
    { label: '70s Bollywood', quotes: 'Soujatya: "The lyrics in Kishore Kumar songs were pure poetry. Let me quote a couple of Urdu shayaris that capture this exact feeling..."' },
    { label: 'Urdu Poetry', quotes: 'Soujatya: "Ghalib once wrote about the pain of existence. If you translate the Punjabi folklore from the same era, you find this beautiful cultural impact..."' },
    { label: 'Bhopal History', quotes: 'Soujatya: "Bhopal has such rich architecture. Speaking of that, the political landscape of central India in the 19th century was..."' },
    { label: 'Zebrafish Heartrate', quotes: 'Soujatya: "From a scientific standpoint, the heartrate changes under adrenaline. Which is similar to the metabolic curves in evolutionary biology..."' },
    { label: 'Obscure Fact #42', quotes: 'Soujatya: "Did you know that the first printing press in India was actually imported by Jesuits in Goa in 1556? Which changed education policy..."' },
    { label: 'Classical Music', quotes: 'Soujatya: "Rabindra Sangeet has these ragas that resemble old Sufi tunes. If you listen to this 1952 recording, you can hear..."' },
    { label: 'Political Philosophy', quotes: 'Soujatya: "The impact of early socialist newsletters in Kolkata was massive. In fact, if you look at their literary columns..."' }
  ];

  const handleNodeClick = (node) => {
    addLog(node.quotes || 'Dada explains the connections with passion...');

    // Spawn 2 new nodes in random places
    const availablePool = topicPool.filter((p) => !nodes.some((n) => n.label === p.label));
    if (availablePool.length === 0) return;

    // Pick random topics
    const spawnedCount = Math.min(availablePool.length, 2);
    const newNodes = [];
    
    for (let i = 0; i < spawnedCount; i++) {
      const idx = Math.floor(Math.random() * availablePool.length);
      const item = availablePool[idx];
      availablePool.splice(idx, 1);

      // Random position inside the coordinate boundaries
      const rx = Math.floor(Math.random() * 70) + 15; // percentage-based
      const ry = Math.floor(Math.random() * 65) + 20;

      newNodes.push({
        id: Date.now() + Math.random(),
        label: item.label,
        x: rx,
        y: ry,
        quotes: item.quotes
      });
    }

    setNodes((prev) => [...prev, ...newNodes]);
    setTopicCount((prev) => prev + spawnedCount);
    
    // Synth audio pluck sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + (nodes.length * 40), audioCtx.currentTime); // increase pitch as nodes grow!
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  };

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>THE NEVER-ENDING CONVERSATION</span>
        <span style={styles.badge} className="text-mono">TOPICS OPEN: {topicCount}</span>
      </div>

      <p style={styles.subtext}>
        Objective: Return to the original topic. (Warning: Clicking nodes will branch the conversation further!)
      </p>

      {/* Interactive Mind Map Space */}
      <div className="map-canvas-container" style={styles.mapCanvas}>
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => handleNodeClick(node)}
            className="node-bubble"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {node.label}
          </div>
        ))}
      </div>

      <div style={styles.logPanel}>
        <h4 style={styles.logLabel} className="text-retro">DADA COMMITS SHAYARI & WISDOM:</h4>
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
          <button onClick={onComplete} className="btn-neo secondary animate-bounce-hover" style={styles.completeBtn}>
            SUBMIT TO THE RABBIT HOLE 🌌
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
