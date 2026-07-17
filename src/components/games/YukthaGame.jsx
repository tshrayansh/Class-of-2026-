import React, { useState } from 'react';
import { Camera, Coffee, Film, Heart } from 'lucide-react';

export default function YukthaGame({ onComplete }) {
  const [step, setStep] = useState(0);
  const [yappingHistory, setYappingHistory] = useState([
    { speaker: 'Yuktha', text: 'Okay, listen! So yesterday in the lab, I was setting up the zebrafish crosses, right? But then, oh my god, did you see the lunch menu? They had these gulab jamuns...' }
  ]);

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
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
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
      storyText: 'Nothing! But the chef had this really cool red apron, and I realized I need to post a photo on Instagram. I have five copies of the same photo and they look exactly identical, but I cannot decide which one looks better!',
      options: [
        { text: '👉 "Yuktha, just post the first one. They look identical!"', nextStep: 6, type: 'focus' }
      ]
    },
    // Step 4: Movie plot tangent
    {
      storyText: 'Exactly! So in the second half, he meets this old friend, which reminded me of the genotyping protocol because they both had to solve a genetic mystery! It was so chaotic. Anyway, speaking of photos, I need to post one right now.',
      options: [
        { text: '👉 "Post the first copy, it looks fine. Let\'s get back to genotyping!"', nextStep: 6, type: 'focus' }
      ]
    },
    // Step 5: Hollow Knight tangent
    {
      storyText: 'No, she didn\'t get mad, but she did steal my coffee! That reminded me of how I always try to learn Hindi and make you laugh. Let\'s check my photo options first though, I need to post them today.',
      options: [
        { text: '👉 "Haha, no more Hindi lessons! Just upload the first photo already."', nextStep: 6, type: 'focus' }
      ]
    },
    // Step 6: Resolution Node
    {
      storyText: 'Yuktha: "Okay, fine! I will post the first one. But wait, did I tell you about the other Malayalam movie? No? Haha, alright, I\'ll let you get back to your work. You are the best! Let\'s unlock my achievement!"',
      options: [
        { text: '🎉 CLAIM ACHIEVEMENT', nextStep: 'complete', type: 'special' }
      ]
    }
  ];

  const handleOptionClick = (option) => {
    if (option.nextStep === 'complete') {
      playBleep(880);
      onComplete();
      return;
    }

    playBleep(option.type === 'focus' ? 440 : 550);
    const nextIdx = option.nextStep;
    const nextStory = dialogueTree[nextIdx];

    setYappingHistory((prev) => [
      ...prev,
      { speaker: 'You', text: option.text },
      { speaker: 'Yuktha', text: nextStory.storyText }
    ]);
    setStep(nextIdx);
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

        {/* Branching Options */}
        <div style={styles.optionsBox}>
          {currentStoryState.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt)}
              className={`btn-neo ${opt.type === 'focus' ? 'secondary' : 'accent'}`}
              style={styles.optBtn}
            >
              {opt.text}
            </button>
          ))}
        </div>
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
    fontSize: '1.3rem',
    color: '#ff477e',
    margin: 0,
  },
  badge: {
    backgroundColor: '#ff477e',
    color: '#000',
    padding: '4px 12px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    border: '2px solid #000',
  },
  consoleBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dialogueScroll: {
    height: '280px',
    overflowY: 'auto',
    backgroundColor: '#0f0f12',
    border: '2.5px solid #000',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  bubbleYuktha: {
    alignSelf: 'flex-start',
    backgroundColor: '#23232f',
    border: '2px solid #3b3b4f',
    borderRadius: '12px 12px 12px 0px',
    padding: '12px 16px',
    maxWidth: '85%',
    textAlign: 'left',
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff477e',
    color: '#000',
    border: '2px solid #000',
    borderRadius: '12px 12px 0px 12px',
    padding: '12px 16px',
    maxWidth: '85%',
    textAlign: 'left',
    marginLeft: 'auto',
  },
  speakerName: {
    display: 'block',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    marginBottom: '3px',
    opacity: 0.9,
    fontFamily: "'VT323', monospace",
  },
  bubbleText: {
    margin: 0,
    fontSize: '1.05rem',
    lineHeight: '1.45',
  },
  optionsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optBtn: {
    width: '100%',
    textAlign: 'left',
    justifyContent: 'flex-start',
    fontSize: '1.05rem',
    padding: '10px 15px',
  },
};
