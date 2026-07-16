import React, { useState } from 'react';
import { HelpCircle, Terminal as TermIcon, RotateCcw } from 'lucide-react';

export default function AryanGame({ onComplete }) {
  const [round, setRound] = useState(1);
  const [chips, setChips] = useState(100);
  const [aryanChips, setAryanChips] = useState(100);
  const [calcLogs, setCalcLogs] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState(['coding_club_server v1.02. Type help for commands.']);
  const [aryanMode, setAryanMode] = useState(false);
  const [currentHand, setCurrentHand] = useState('Pair of Jacks');
  const [pot, setPot] = useState(20);

  const handleAction = (type) => {
    if (type === 'fold') {
      setChips((prev) => Math.max(0, prev - 10));
      setTerminalLogs((prev) => [...prev, 'System: You folded. Expected Value (EV) dropped.']);
      setRound((prev) => prev + 1);
    } else if (type === 'call' || type === 'raise') {
      const bet = type === 'raise' ? 30 : 10;
      setChips((prev) => Math.max(0, prev - bet));
      setAryanChips((prev) => Math.max(0, prev - bet));
      setPot((prev) => prev + (bet * 2));
      setTerminalLogs((prev) => [...prev, `System: You bet ${bet} chips. Aryan bets ${bet} chips.`]);
      
      // Aryan reacts
      setTimeout(() => {
        if (aryanMode) {
          setTerminalLogs((prev) => [...prev, 'Aryan: "Wait, you have a Royal Flush?! That is statistically impossible!"']);
        } else {
          setTerminalLogs((prev) => [...prev, 'Aryan: "Interesting play... but game theory suggests you are bluffing."']);
        }
        setRound((prev) => prev + 1);
      }, 500);
    }
  };

  const askAryan = () => {
    const mathFormulas = [
      'EV(Fold) = -10',
      'P(Royal Flush) = 1/649,740',
      'EV(Call) = P(Win) * Pot - P(Loss) * Bet',
      'E = mc^2 -> Expected value is mathematically optimized.',
      'Game Theory Nash Equilibrium reached at raise parameter theta = 0.42.',
      'Aryan: "Considering expected value, expected utility, and the current pot odds of 3.2:1..."',
      'Player: "Bro. Just tell me if I should fold."',
      'Aryan: "Well, mathematically, it depends on your risk tolerance coefficient..."'
    ];

    // Pick 3 random lines or cycle
    const nextLogs = [
      mathFormulas[Math.floor(Math.random() * mathFormulas.length)],
      mathFormulas[Math.floor(Math.random() * mathFormulas.length)]
    ];

    setCalcLogs((prev) => [...prev, ...nextLogs]);
    setTerminalLogs((prev) => [...prev, 'Aryan starts calculating Nash equilibria...']);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const command = terminalInput.trim().toLowerCase();
    setTerminalInput('');

    if (command === 'help') {
      setTerminalLogs((prev) => [...prev, '> ' + command, 'Available commands: help, clear, sudo fix_everything']);
    } else if (command === 'clear') {
      setTerminalLogs([]);
    } else if (command === 'sudo fix_everything') {
      setAryanMode(true);
      setCurrentHand('ROYAL FLUSH (A, K, Q, J, 10 of Spades)');
      setTerminalLogs((prev) => [
        ...prev,
        '> ' + command,
        'ACCESS: GRANTED.',
        'INITIALIZING ARYAN MODE...',
        'Hacking server...',
        'Card conversion complete: Hand upgraded to Royal Flush.'
      ]);
      // Play retro hack sound
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch(e) {}
    } else {
      setTerminalLogs((prev) => [...prev, '> ' + command, 'bash: command not found: ' + command]);
    }
  };

  const gameWon = round >= 4 || aryanMode;

  return (
    <div style={styles.container}>
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>ALL IN</span>
        <div style={styles.statContainer}>
          <span style={styles.statText}>CHIPS: {chips}</span>
          <span style={styles.statText}>POT: {pot}</span>
        </div>
      </div>

      {/* Poker Table felt */}
      <div className="poker-felt" style={styles.felt}>
        {/* Opponent Area */}
        <div style={styles.opponentArea}>
          <span style={styles.avatar}>🧑‍💻</span>
          <span style={styles.name}>Aryan (Bhopal Physics)</span>
          <div style={styles.bubble}>"Let's calculate the wagers."</div>
        </div>

        {/* Player Cards */}
        <div style={styles.playerCards}>
          <div style={styles.cardHeader}>YOUR HAND:</div>
          <div className="text-mono" style={styles.cardVal}>{currentHand}</div>
        </div>

        {/* Control actions */}
        <div style={styles.controls}>
          <button onClick={() => handleAction('fold')} className="btn-neo secondary" style={styles.btn}>FOLD</button>
          <button onClick={() => handleAction('call')} className="btn-neo secondary" style={styles.btn}>CALL</button>
          <button onClick={() => handleAction('raise')} className="btn-neo secondary" style={styles.btn}>RAISE</button>
          <button onClick={askAryan} className="btn-neo accent" style={styles.btn}>
            <HelpCircle size={16} /> ASK ARYAN
          </button>
        </div>
      </div>

      {/* Sidebar Nerd Calculations & Secret Terminal */}
      <div style={styles.columns}>
        <div style={styles.col}>
          <h4 style={styles.label} className="text-retro">Calculations.log</h4>
          <div className="calculator-sidebar" style={styles.calcPanel}>
            {calcLogs.length === 0 ? (
              <p style={{ color: '#6b7280', margin: 0 }}>Click 'ASK ARYAN' to compute odds...</p>
            ) : (
              calcLogs.map((log, i) => <div key={i} style={styles.calcLine}>{log}</div>)
            )}
          </div>
        </div>

        <div style={styles.col}>
          <h4 style={styles.label} className="text-retro">Terminal Console</h4>
          <div className="cli-console" style={styles.cli}>
            <div style={styles.cliLogs}>
              {terminalLogs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
            <form onSubmit={handleTerminalSubmit} style={styles.cliForm}>
              <span style={{ marginRight: '6px' }}>$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="cli-input"
                placeholder="type 'sudo fix_everything'..."
              />
            </form>
          </div>
        </div>
      </div>

      {gameWon && (
        <div style={styles.winBox}>
          <p style={styles.winText}>Aryan: "Fair enough. That was a high EV hand. Let's see my memories."</p>
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
    color: '#118ab2',
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
  felt: {
    minHeight: '260px',
    border: '4px solid #5c4033',
    borderRadius: '24px',
    padding: '20px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  opponentArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  avatar: {
    fontSize: '2.5rem',
  },
  name: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  bubble: {
    backgroundColor: '#000',
    border: '2px solid #555',
    borderRadius: '8px',
    padding: '4px 10px',
    fontSize: '0.8rem',
    color: '#10b981',
    marginTop: '4px',
  },
  playerCards: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '2px dashed #ff477e',
    borderRadius: '8px',
    padding: '10px',
    margin: '15px 0',
  },
  cardHeader: {
    fontSize: '0.7rem',
    color: '#aaa',
  },
  cardVal: {
    fontSize: '1.2rem',
    color: '#ffd166',
    fontWeight: 'bold',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  btn: {
    fontSize: '0.8rem',
    padding: '6px 12px',
    boxShadow: '2px 2px 0px #000',
    borderWidth: '2px',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginTop: '20px',
    '@media (max-width: 500px)': {
      gridTemplateColumns: '1fr',
    },
  },
  col: {
    textAlign: 'left',
  },
  label: {
    margin: '0 0 6px 0',
    fontSize: '0.75rem',
    color: '#b2b2c2',
  },
  calcPanel: {
    height: '140px',
    backgroundColor: '#0f0f13',
    padding: '8px',
    borderRadius: '6px',
    border: '2.5px solid #000',
    overflowY: 'auto',
  },
  calcLine: {
    fontSize: '0.75rem',
    marginBottom: '4px',
  },
  cli: {
    height: '140px',
    backgroundColor: '#000',
    padding: '8px',
    borderRadius: '6px',
    border: '2.5px solid #000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cliLogs: {
    overflowY: 'auto',
    flexGrow: 1,
    fontSize: '0.7rem',
    color: '#39ff14',
    marginBottom: '4px',
  },
  cliForm: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #222',
    paddingTop: '4px',
    color: '#39ff14',
    fontSize: '0.8rem',
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
    color: '#10b981',
    marginBottom: '10px',
  },
  completeBtn: {
    width: '100%',
  },
};
