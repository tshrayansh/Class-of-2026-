import React, { useState } from 'react';
import { HelpCircle, Terminal as TermIcon, RotateCcw } from 'lucide-react';

export default function AryanGame({ onComplete }) {
  const [round, setRound] = useState(1);
  const [chips, setChips] = useState(100);
  const [aryanChips, setAryanChips] = useState(100);
  const [calcLogs, setCalcLogs] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState(['coding_club_server v1.02. Type "help" or run system overrides.']);
  const [aryanMode, setAryanMode] = useState(false);
  const [currentHand, setCurrentHand] = useState('Pair of Jacks');
  const [pot, setPot] = useState(20);

  const handleAction = (type) => {
    if (type === 'fold') {
      setChips((prev) => Math.max(0, prev - 10));
      setTerminalLogs((prev) => [...prev, 'System: Folded. Hand terminated.']);
      setRound((prev) => prev + 1);
    } else if (type === 'call' || type === 'raise') {
      const bet = type === 'raise' ? 30 : 10;
      setChips((prev) => Math.max(0, prev - bet));
      setAryanChips((prev) => Math.max(0, prev - bet));
      setPot((prev) => prev + (bet * 2));
      setTerminalLogs((prev) => [...prev, `System: You bet ${bet} chips. Aryan matches.`]);
      
      setTimeout(() => {
        if (aryanMode) {
          setTerminalLogs((prev) => [...prev, 'Aryan: "Wait, you actually hit a Royal Flush? The probability of that is 0.00015%!"']);
        } else {
          setTerminalLogs((prev) => [...prev, 'Aryan: "Game theory suggests you are bluffing here. Expected value doesn\'t support this."']);
        }
        setRound((prev) => prev + 1);
      }, 500);
    }
  };

  const askAryan = () => {
    const mathFormulas = [
      'Aryan: "Nash Equilibrium for this hand suggests raising is optimal."',
      'Aryan: "Expected value calculation: EV = (0.33 * 80) - (0.67 * 20) = 13.0."',
      'Aryan: "Considering the pot odds are 4 to 1, folding here is mathematically incorrect."',
      'Aryan: "If we factor in physics and basic card-counting heuristics..."',
      'You: "Bro. Just tell me if I should fold or not."',
      'Aryan: "Well, strictly speaking, folding has a negative expectation value..."'
    ];

    const nextLogs = [
      mathFormulas[Math.floor(Math.random() * mathFormulas.length)]
    ];

    setCalcLogs((prev) => [...prev, ...nextLogs]);
    setTerminalLogs((prev) => [...prev, 'Aryan calculates the expected utility...']);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const command = terminalInput.trim().toLowerCase();
    setTerminalInput('');

    if (command === 'help') {
      setTerminalLogs((prev) => [...prev, '> ' + command, 'Commands: help, clear, sudo fix_everything']);
    } else if (command === 'clear') {
      setTerminalLogs([]);
    } else if (command === 'sudo fix_everything') {
      setAryanMode(true);
      setCurrentHand('Royal Flush');
      setTerminalLogs((prev) => [
        ...prev,
        '> ' + command,
        'OVERRIDE: SUCCESSFUL.',
        'CARD VALUE MODIFIED: Upgraded to Royal Flush.'
      ]);
      
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

  const getCards = () => {
    if (aryanMode) {
      return [
        { val: '10', suit: '♠', color: '#000' },
        { val: 'J', suit: '♠', color: '#000' },
        { val: 'Q', suit: '♠', color: '#000' },
        { val: 'K', suit: '♠', color: '#000' },
        { val: 'A', suit: '♠', color: '#000' }
      ];
    } else {
      return [
        { val: 'J', suit: '♠', color: '#000' },
        { val: 'J', suit: '♦', color: '#ff477e' },
        { val: '2', suit: '♣', color: '#000' },
        { val: '7', suit: '♥', color: '#ff477e' },
        { val: 'Q', suit: '♠', color: '#000' }
      ];
    }
  };

  const cards = getCards();
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
          <span style={styles.name}>Aryan (Bhopal / Physics)</span>
          <div style={styles.bubble}>"Let's see what the math says."</div>
        </div>

        {/* Player Cards rendering */}
        <div style={styles.playerCards}>
          <div style={styles.cardHeader}>YOUR HAND ({currentHand}):</div>
          <div style={styles.cardsRow}>
            {cards.map((card, i) => (
              <div key={i} style={{ ...styles.pokerCard, color: card.color }}>
                <span style={styles.cardCorner}>{card.val}</span>
                <span style={styles.cardSuit}>{card.suit}</span>
                <span style={{ ...styles.cardCorner, ...styles.cardCornerBottom }}>{card.val}</span>
              </div>
            ))}
          </div>
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
                placeholder="Type 'sudo fix_everything'..."
              />
            </form>
          </div>
        </div>
      </div>

      {gameWon && (
        <div style={styles.winBox}>
          <p style={styles.winText}>Aryan: "You actually won. The probability model didn't expect that override."</p>
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
    minHeight: '280px',
    border: '4px solid #5c4033',
    borderRadius: '24px',
    padding: '15px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#0b6623',
    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)',
  },
  opponentArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  avatar: {
    fontSize: '2rem',
  },
  name: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  bubble: {
    backgroundColor: '#000',
    border: '2px solid #555',
    borderRadius: '8px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    color: '#10b981',
    marginTop: '2px',
  },
  playerCards: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    border: '2px dashed #ffd166',
    borderRadius: '8px',
    padding: '10px 5px',
    margin: '10px 0',
  },
  cardHeader: {
    fontSize: '0.65rem',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: '5px',
  },
  cardsRow: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
  },
  pokerCard: {
    width: '45px',
    height: '68px',
    backgroundColor: '#fff',
    border: '2px solid #000',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '3px',
    boxShadow: '2.5px 2.5px 0px #000',
    position: 'relative',
  },
  cardCorner: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    fontFamily: "'Fredoka', sans-serif",
    textAlign: 'left',
    lineHeight: '1',
  },
  cardCornerBottom: {
    textAlign: 'right',
    transform: 'rotate(180deg)',
  },
  cardSuit: {
    fontSize: '1.5rem',
    textAlign: 'center',
    lineHeight: '1',
  },
  controls: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
  },
  btn: {
    fontSize: '0.75rem',
    padding: '6px 10px',
    boxShadow: '1.5px 1.5px 0px #000',
    borderWidth: '1.5px',
    transform: 'none',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginTop: '15px',
    '@media (max-width: 500px)': {
      gridTemplateColumns: '1fr',
    },
  },
  col: {
    textAlign: 'left',
  },
  label: {
    margin: '0 0 4px 0',
    fontSize: '0.7rem',
    color: '#b2b2c2',
  },
  calcPanel: {
    height: '110px',
    backgroundColor: '#0f0f13',
    padding: '8px',
    borderRadius: '6px',
    border: '2px solid #000',
    overflowY: 'auto',
  },
  calcLine: {
    fontSize: '0.7rem',
    marginBottom: '3px',
  },
  cli: {
    height: '110px',
    backgroundColor: '#000',
    padding: '8px',
    borderRadius: '6px',
    border: '2px solid #000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cliLogs: {
    overflowY: 'auto',
    flexGrow: 1,
    fontSize: '0.65rem',
    color: '#39ff14',
    marginBottom: '2px',
  },
  cliForm: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #222',
    paddingTop: '2px',
    color: '#39ff14',
    fontSize: '0.75rem',
  },
  cliInput: {
    background: 'transparent',
    border: 'none',
    color: '#39ff14',
    fontFamily: "'VT323', monospace",
    fontSize: '0.85rem',
    outline: 'none',
    width: '90%',
  },
  winBox: {
    marginTop: '15px',
    borderTop: '2px dashed #444',
    paddingTop: '12px',
    textAlign: 'center',
  },
  winText: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '0.9rem',
    color: '#10b981',
    marginBottom: '8px',
  },
  completeBtn: {
    width: '100%',
  },
};
