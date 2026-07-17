import React, { useState } from 'react';
import { HelpCircle, Terminal as TermIcon, Play } from 'lucide-react';

export default function AryanGame({ onComplete }) {
  const [phase, setPhase] = useState('preflop'); // 'preflop' | 'flop' | 'turn' | 'river' | 'showdown'
  const [chips, setChips] = useState(100);
  const [pot, setPot] = useState(10);
  const [calcLogs, setCalcLogs] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState(['coding_club_server v1.02. Type "help" or run overrides.']);
  const [aryanMode, setAryanMode] = useState(false);

  const playBleep = (pitch = 440, duration = 0.08, type = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  const playAllInSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
  };

  const playVictorySound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 0.15);
        osc.start(audioCtx.currentTime + idx * 0.1);
        osc.stop(audioCtx.currentTime + idx * 0.1 + 0.18);
      });
    } catch(e) {}
  };

  // Cards data definition
  const getPlayerHand = () => {
    if (aryanMode) {
      return [
        { val: 'A', suit: '♥', color: '#ff477e' },
        { val: 'K', suit: '♥', color: '#ff477e' }
      ];
    }
    return [
      { val: 'J', suit: '♠', color: '#000' },
      { val: 'J', suit: '♦', color: '#ff477e' }
    ];
  };

  const getAryanHand = () => {
    return [
      { val: 'Q', suit: '♣', color: '#000' },
      { val: 'Q', suit: '♥', color: '#ff477e' }
    ];
  };

  const getCommunityCards = () => {
    const cards = [
      { val: '2', suit: '♣', color: '#000', stage: 'flop' },
      { val: '7', suit: '♥', color: '#ff477e', stage: 'flop' },
      { val: 'K', suit: '♠', color: '#000', stage: 'flop' },
      { val: 'J', suit: '♣', color: '#000', stage: 'turn' },
      { val: 'A', suit: '♠', color: '#000', stage: 'river' }
    ];

    if (aryanMode) {
      return [
        { val: '10', suit: '♥', color: '#ff477e', stage: 'flop' },
        { val: 'J', suit: '♥', color: '#ff477e', stage: 'flop' },
        { val: 'Q', suit: '♥', color: '#ff477e', stage: 'flop' },
        { val: '3', suit: '♣', color: '#000', stage: 'turn' },
        { val: '8', suit: '♠', color: '#000', stage: 'river' }
      ];
    }

    if (phase === 'preflop') return [];
    if (phase === 'flop') return cards.filter(c => c.stage === 'flop');
    if (phase === 'turn') return cards.filter(c => c.stage === 'flop' || c.stage === 'turn');
    return cards;
  };

  const handleAction = (type) => {
    if (type === 'fold') {
      playBleep(300, 0.15, 'triangle');
      setChips((prev) => Math.max(0, prev - 10));
      setTerminalLogs((prev) => [...prev, 'System: You folded. Aryan wins the current pot.']);
      setPhase('preflop');
      setPot(10);
    } else if (type === 'allin') {
      playAllInSound();
      const allInBet = chips;
      setChips(0);
      setPot((prev) => prev + allInBet * 2);
      setTerminalLogs((prev) => [
        ...prev,
        `System: YOU went ALL IN with ${allInBet} chips! Aryan calls.`,
        'Dealer: Commencing immediate SHOWDOWN!'
      ]);
      setPhase('showdown');
      
      setTimeout(() => {
        playVictorySound();
        setTerminalLogs((prev) => [
          ...prev,
          aryanMode ? 'Aryan: "Royal Flush?! This is mathematically impossible!"' : 'Aryan: "Set of Jacks beats my pair of Queens. Nice hand."'
        ]);
      }, 500);
    } else {
      const bet = type === 'raise' ? 20 : 10;
      playBleep(520, 0.1);
      setChips((prev) => Math.max(0, prev - bet));
      setPot((prev) => prev + bet * 2);
      setTerminalLogs((prev) => [...prev, `System: You bet ${bet} chips. Aryan checks.`]);

      setTimeout(() => {
        playBleep(650, 0.12);
        if (phase === 'preflop') {
          setPhase('flop');
          setTerminalLogs((prev) => [...prev, 'Dealer: Dealing the FLOP.']);
        } else if (phase === 'flop') {
          setPhase('turn');
          setTerminalLogs((prev) => [...prev, 'Dealer: Dealing the TURN. Player hits a Set of Jacks!']);
        } else if (phase === 'turn') {
          setPhase('river');
          setTerminalLogs((prev) => [...prev, 'Dealer: Dealing the RIVER. Showdown is active!']);
        } else if (phase === 'river') {
          setPhase('showdown');
          playVictorySound();
          setTerminalLogs((prev) => [...prev, aryanMode ? 'Aryan: "Royal Flush?! This is mathematically impossible!"' : 'Aryan: "Set of Jacks beats my pair of Queens. Nice hand."']);
        }
      }, 500);
    }
  };

  const askAryan = () => {
    playBleep(380, 0.1);
    const mathFormulas = [
      'Aryan: "Pre-flop: Pocket Jacks have 54% equity against random hands."',
      'Aryan: "Flop: Community has K, 7, 2. Pocket Queens are ahead with 82% probability."',
      'Aryan: "Turn: Jack of Clubs falls! Your equity increases to 96% with a Set of Jacks."',
      'Aryan: "Expected value of calling: EV = (0.96 * Pot) - (0.04 * Bet) = positive utility."',
      'You: "Bro, just tell me if I should fold."',
      'Aryan: "Well, mathematically speaking, folding here is a negative expectation value action."'
    ];

    const nextLogs = [
      mathFormulas[Math.floor(Math.random() * mathFormulas.length)]
    ];
    setCalcLogs((prev) => [...prev, ...nextLogs]);
    setTerminalLogs((prev) => [...prev, 'Aryan calculates hand equities...']);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const command = terminalInput.trim().toLowerCase();
    setTerminalInput('');

    if (command === 'help') {
      playBleep(440, 0.08);
      setTerminalLogs((prev) => [...prev, '> ' + command, 'Commands: help, clear, sudo fix_everything']);
    } else if (command === 'clear') {
      playBleep(400, 0.08);
      setTerminalLogs([]);
    } else if (command === 'sudo fix_everything') {
      playVictorySound();
      setAryanMode(true);
      setPhase('showdown');
      setTerminalLogs((prev) => [
        ...prev,
        '> ' + command,
        'OVERRIDE: INITIATED.',
        'Converting pocket cards to A-K of Hearts...',
        'Modifying community flop to Q-J-10 of Hearts...',
        'Hand Upgraded: Royal Flush successfully completed!'
      ]);
    } else {
      playBleep(220, 0.12);
      setTerminalLogs((prev) => [...prev, '> ' + command, 'bash: command not found: ' + command]);
    }
  };

  const communityCards = getCommunityCards();
  const playerHand = getPlayerHand();
  const aryanHand = getAryanHand();
  const gameWon = phase === 'showdown' || aryanMode;

  return (
    <div style={styles.container}>
      <div style={styles.hud}>
        <span className="text-retro" style={styles.hudTitle}>TEXAS HOLD'EM POKER</span>
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
          <div style={styles.opponentCards}>
            {phase === 'showdown' ? (
              <div style={styles.cardsRowSmall}>
                {aryanHand.map((card, i) => (
                  <div key={i} style={{ ...styles.pokerCardSmall, color: card.color }}>
                    <span>{card.val}{card.suit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.cardBacks}>🎴 🎴</div>
            )}
          </div>
        </div>

        {/* Community Cards Display */}
        <div style={styles.communityArea}>
          <div style={styles.sectionLabel}>COMMUNITY CARDS</div>
          <div style={styles.cardsRow}>
            {communityCards.map((card, i) => (
              <div key={i} style={{ ...styles.pokerCard, color: card.color }}>
                <span style={styles.cardCorner}>{card.val}</span>
                <span style={styles.cardSuit}>{card.suit}</span>
                <span style={{ ...styles.cardCorner, ...styles.cardCornerBottom }}>{card.val}</span>
              </div>
            ))}
            {/* Render placeholder cards if empty */}
            {Array.from({ length: 5 - communityCards.length }).map((_, i) => (
              <div key={i} style={styles.cardPlaceholder}>?</div>
            ))}
          </div>
        </div>

        {/* Victory Splash Banner */}
        {phase === 'showdown' && (
          <div style={styles.winBanner} className="animate-shake">
            <span style={{ fontSize: '2rem' }}>🪙</span>
            <span style={styles.winBannerText}>YOU WON THE POT!</span>
            <span style={{ fontSize: '2rem' }}>🪙</span>
          </div>
        )}

        {/* Player Cards rendering */}
        <div style={styles.playerCards}>
          <div style={styles.cardHeader}>YOUR HAND:</div>
          <div style={styles.cardsRow}>
            {playerHand.map((card, i) => (
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
          <button onClick={() => handleAction('call')} className="btn-neo secondary" style={styles.btn}>
            {phase === 'river' ? 'SHOWDOWN' : 'CALL'}
          </button>
          <button onClick={() => handleAction('raise')} className="btn-neo secondary" style={styles.btn}>RAISE</button>
          <button onClick={() => handleAction('allin')} className="btn-neo accent" style={{ ...styles.btn, backgroundColor: '#ef476f', color: '#000' }}>ALL IN</button>
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
                onChange={(e) => { playBleep(800, 0.02, 'sine'); setTerminalInput(e.target.value); }}
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
          <button onClick={() => { playBleep(880); onComplete(); }} className="btn-neo secondary animate-bounce-hover" style={styles.completeBtn}>
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
    minHeight: '340px',
    border: '4px solid #5c4033',
    borderRadius: '24px',
    padding: '15px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#0b6623',
    boxShadow: 'inset 0 0 35px rgba(0,0,0,0.6)',
  },
  opponentArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  avatar: {
    fontSize: '1.8rem',
  },
  name: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  opponentCards: {
    marginTop: '2px',
  },
  cardBacks: {
    fontSize: '1.2rem',
    letterSpacing: '4px',
  },
  communityArea: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '2px solid #044416',
    borderRadius: '8px',
    padding: '8px 5px',
    margin: '8px 0',
  },
  sectionLabel: {
    fontSize: '0.6rem',
    color: '#06d6a0',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  playerCards: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    border: '2px dashed #ffd166',
    borderRadius: '8px',
    padding: '6px 5px',
    margin: '5px 0',
  },
  cardHeader: {
    fontSize: '0.6rem',
    color: '#ccc',
    textAlign: 'center',
  },
  cardsRow: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    marginTop: '4px',
  },
  cardsRowSmall: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
  },
  pokerCard: {
    width: '42px',
    height: '62px',
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
  pokerCardSmall: {
    width: '32px',
    height: '42px',
    backgroundColor: '#fff',
    border: '1.5px solid #000',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.75rem',
  },
  cardPlaceholder: {
    width: '42px',
    height: '62px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '2px dashed #044416',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#044416',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  winBanner: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    border: '3px solid #ffd166',
    borderRadius: '12px',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 10,
    boxShadow: '0px 10px 20px rgba(0,0,0,0.5)',
  },
  winBannerText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '0.75rem',
    color: '#ffd166',
    fontWeight: 'bold',
  },
  cardCorner: {
    fontSize: '0.7rem',
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
    fontSize: '1.4rem',
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
    padding: '5px 10px',
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
    fontSize: '0.75rem',
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
    fontSize: '1rem',
    fontFamily: "'VT323', monospace",
    color: '#39ff14',
    marginBottom: '2px',
  },
  cliForm: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #222',
    paddingTop: '2px',
    color: '#39ff14',
    fontSize: '1rem',
  },
  cliInput: {
    background: 'transparent',
    border: 'none',
    color: '#39ff14',
    fontFamily: "'VT323', monospace",
    fontSize: '1.05rem',
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
