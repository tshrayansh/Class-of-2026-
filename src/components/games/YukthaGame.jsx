import React, { useState } from 'react';
import { Camera, Coffee, Film, Heart } from 'lucide-react';

export default function YukthaGame({ onComplete }) {
  const [step, setStep] = useState(0);
  const [yappingHistory, setYappingHistory] = useState([
    { speaker: 'Yuktha', text: 'Okay, listen! So yesterday in the lab, I was setting up the zebrafish crosses, right? But then, oh my god, did you see the lunch menu? They had these gulab jamuns...' }
  ]);
  const [showPhotoChooser, setShowPhotoChooser] = useState(false);
  const [photoPickCount, setPhotoPickCount] = useState(0);

  const playBleep = (pitch = 440) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const dialogueTree = [
    // Step 0: Initial
    {
      storyText: 'Anyway, back to the fish. I went to collect the embryos, but I saw a stray biscuit on the desk. You know me, my sugar radar went off immediately! I just had to check if it was edible...',
      options: [
        { text: 'Yuktha, focus! Did you get the embryos?', nextStep: 1, type: 'focus' },
        { text: 'Wait, did you actually eat the desk biscuit?', nextStep: 2, type: 'distraction' },
      ]
    },
    // Step 1: Embryos focus
    {
      storyText: 'Yes, of course! But as I was labeling the petri dishes, I remembered the plot of the Malayalam movie I watched. It was about this chef who opens a restaurant in Kerala, and the cinematography was so beautiful! It had these long panning shots of the backwaters...',
      options: [
        { text: 'What does this chef have to do with the zebrafish?', nextStep: 3, type: 'focus' },
        { text: 'Oh, tell me the entire movie plot!', nextStep: 4, type: 'distraction' },
      ]
    },
    // Step 2: Desk biscuit distraction
    {
      storyText: 'Maybe! The security guards usually leave sweets for me anyway because they know I love them. But while I was searching for the biscuit owner, I accidentally ambushed Sam Akka and started a yapping session about Hollow Knight!',
      options: [
        { text: 'Did Sam Akka get mad?', nextStep: 5, type: 'focus' },
        { text: 'Wait, you play Hollow Knight too?', nextStep: 5, type: 'focus' },
      ]
    },
    // Step 3: Chef to zebrafish connection
    {
      storyText: 'Nothing! But the chef had this really cool red apron, and I realized I need to post a photo on Instagram. I have these five photos from the event and I cannot decide which one looks better. Look at them, they look exactly identical!',
      options: [
        { text: 'Let me see the photos.', nextStep: 'photos', type: 'special' }
      ]
    },
    // Step 4: Movie plot tangent
    {
      storyText: 'Exactly! So in the second half, he meets this old friend, which reminded me of the genotyping protocol because they both had to solve a genetic mystery! It was so chaotic. Anyway, speaking of photos, I need to post one right now.',
      options: [
        { text: 'Show me the photo options.', nextStep: 'photos', type: 'special' }
      ]
    },
    // Step 5: Hollow Knight tangent
    {
      storyText: 'No, she didn\'t get mad, but she did steal my coffee! That reminded me of how I always try to learn Hindi and make you laugh. Let\'s check my photo options first though, I need to post them today.',
      options: [
        { text: 'Alright, show me the photos.', nextStep: 'photos', type: 'special' }
      ]
    }
  ];

  const handleOptionClick = (option) => {
    playBleep(option.type === 'focus' ? 440 : 550);

    if (option.nextStep === 'photos') {
      setShowPhotoChooser(true);
      return;
    }

    const nextIdx = option.nextStep;
    const nextStory = dialogueTree[nextIdx];

    setYappingHistory((prev) => [
      ...prev,
      { speaker: 'You', text: option.text },
      { speaker: 'Yuktha', text: nextStory.storyText }
    ]);
    setStep(nextIdx);
  };

  const handlePhotoSelect = (idx) => {
    setPhotoPickCount((prev) => prev + 1);

    if (photoPickCount === 0) {
      playBleep(350);
      setYappingHistory((prev) => [
        ...prev,
        { speaker: 'You', text: `Choose Photo #${idx}` },
        { speaker: 'Yuktha', text: `Hmm... but don't you think Photo #${idx === 1 ? 2 : 1} is slightly better? The angle is different! Look closely!` }
      ]);
    } else if (photoPickCount === 1) {
      playBleep(523);
      setYappingHistory((prev) => [
        ...prev,
        { speaker: 'You', text: `Okay, let's go with that one.` },
        { speaker: 'Yuktha', text: `Wait, but what about Photo #3? The lighting is so cute! Actually, let me ask three more people... Ah, whatever, you are the best! Let's unlock my achievement!` }
      ]);
    } else {
      playBleep(880);
      onComplete();
    }
  };

  const currentStoryState = dialogueTree[step];

  return (
    <div style={styles.gameWrapper}>
      <div style={styles.hudHeader}>
        <span className="text-retro" style={styles.hudTitle}>THE LOST STORY</span>
        <span style={styles.badge} className="text-mono">YAP LEVEL: 100%</span>
      </div>

      <div style={styles.consoleBody}>
        {/* Dialogue Scroll Area */}
        <div style={styles.dialogueScroll}>
          {yappingHistory.map((item, i) => (
            <div key={i} style={item.speaker === 'Yuktha' ? styles.bubbleYuktha : styles.bubbleUser}>
              <strong style={styles.speakerName}>{item.speaker}:</strong>
              <p style={styles.bubbleText}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Photo Chooser Special State */}
        {showPhotoChooser ? (
          <div style={styles.photoContainer}>
            <h3 style={styles.photoTitle} className="text-retro">WHICH ONE SHOULD I POST?</h3>
            <div style={styles.photoGrid}>
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} onClick={() => handlePhotoSelect(idx)} style={styles.photoCard}>
                  <div style={styles.photoThumb}>
                    <Camera size={24} color="#555" />
                    <span style={styles.thumbText}>Option #{idx}</span>
                  </div>
                  <button className="btn-neo" style={styles.selectBtn}>SELECT</button>
                </div>
              ))}
            </div>
            {photoPickCount >= 2 && (
              <button onClick={() => { playBleep(880); onComplete(); }} className="btn-neo secondary animate-bounce-hover" style={styles.winBtn}>
                CLAIM ACHIEVEMENT
              </button>
            )}
          </div>
        ) : (
          /* Normal Branching Options */
          <div style={styles.optionsBox}>
            {currentStoryState.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                className={`btn-neo ${opt.type === 'focus' ? 'secondary' : 'accent'}`}
                style={styles.optBtn}
              >
                {opt.type === 'focus' ? <Coffee size={16} /> : <Film size={16} />}
                {opt.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  gameWrapper: {
    backgroundColor: '#16161a',
    border: '3px solid #000',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: 'var(--neo-shadow)',
    color: '#fff',
    maxWidth: '650px',
    margin: '0 auto',
  },
  hudHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '3px solid #000',
    paddingBottom: '12px',
    marginBottom: '15px',
  },
  hudTitle: {
    fontSize: '1.2rem',
    color: '#ff477e',
    margin: 0,
  },
  badge: {
    backgroundColor: '#ff477e',
    color: '#000',
    padding: '3px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    border: '2px solid #000',
  },
  consoleBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dialogueScroll: {
    maxHeight: '260px',
    overflowY: 'auto',
    backgroundColor: '#0f0f12',
    border: '2px solid #000',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bubbleYuktha: {
    alignSelf: 'flex-start',
    backgroundColor: '#23232f',
    border: '2px solid #3b3b4f',
    borderRadius: '12px 12px 12px 0px',
    padding: '10px 14px',
    maxWidth: '85%',
    textAlign: 'left',
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff477e',
    color: '#000',
    border: '2px solid #000',
    borderRadius: '12px 12px 0px 12px',
    padding: '10px 14px',
    maxWidth: '85%',
    textAlign: 'left',
    marginLeft: 'auto',
  },
  speakerName: {
    display: 'block',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    marginBottom: '2px',
    opacity: 0.8,
  },
  bubbleText: {
    margin: 0,
    fontSize: '0.95rem',
    lineHeight: '1.4',
  },
  optionsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  optBtn: {
    width: '100%',
    textAlign: 'left',
    justifyContent: 'flex-start',
    fontSize: '0.95rem',
  },
  photoContainer: {
    borderTop: '2px dashed #444',
    paddingTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  photoTitle: {
    color: '#ffd166',
    fontSize: '1rem',
    marginBottom: '15px',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '10px',
    width: '100%',
    marginBottom: '20px',
  },
  photoCard: {
    backgroundColor: '#2a2a35',
    border: '2px solid #000',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
  },
  photoThumb: {
    width: '100%',
    height: '70px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    marginBottom: '8px',
  },
  thumbText: {
    fontSize: '0.65rem',
    fontWeight: 'bold',
    marginTop: '2px',
  },
  selectBtn: {
    fontSize: '0.65rem',
    padding: '3px 8px',
    boxShadow: '2px 2px 0px #000',
    borderWidth: '1.5px',
    transform: 'none',
  },
  winBtn: {
    marginTop: '10px',
    width: '100%',
  },
};
