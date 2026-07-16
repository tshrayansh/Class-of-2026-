import React, { useState } from 'react';
import { Camera, Coffee, Film, Heart } from 'lucide-react';

export default function YukthaGame({ onComplete }) {
  const [step, setStep] = useState(0);
  const [yappingHistory, setYappingHistory] = useState([
    { speaker: 'Yuktha', text: 'Hey! So, let me tell you about this crazy thing that happened today in the lab... I was walking in, ready to inspect the fish...' }
  ]);
  const [showPhotoChooser, setShowPhotoChooser] = useState(false);
  const [photoPickCount, setPhotoPickCount] = useState(0);

  const dialogueTree = [
    // Step 0 options
    {
      storyText: 'Okay, so I was looking at the fish tanks. But then, wait, did I tell you about the movie I watched yesterday? Oh my god, it was a 3-hour Malayalam movie and...',
      options: [
        { text: 'Wait, what happened in the lab?', nextStep: 1, type: 'focus' },
        { text: 'Oh! Tell me the movie plot!', nextStep: 2, type: 'distraction' },
      ]
    },
    // Step 1: Lab focus route
    {
      storyText: 'Right! The lab! So I was checking the fish, and I saw a plate of laddoos on the table. You know me, my golden-retriever radar detected sugar instantly! I just had to check it out...',
      options: [
        { text: 'Yuktha, did you eat them all?', nextStep: 3, type: 'focus' },
        { text: 'Laddoos? Let\'s go eat!', nextStep: 4, type: 'distraction' },
      ]
    },
    // Step 2: Movie distraction route
    {
      storyText: 'So the movie is about this chef who falls in love with a curly-haired girl, and there are these emotional songs, and the choreography was so beautiful, which reminds me, I need to hunt for a dress for next week\'s event!',
      options: [
        { text: 'Yuktha, focus! What about the lab?', nextStep: 1, type: 'focus' },
        { text: 'A dress? What color are you looking for?', nextStep: 5, type: 'distraction' },
      ]
    },
    // Step 3: Laddoo eaten
    {
      storyText: 'Maybe! I mean, security guards gave them to me because they know I am a sweet little baby! But anyway, then I had a unprovoked tickle session with Sam akka, and she laughed so hard she spilled her water bottle!',
      options: [
        { text: 'Haha! Standard Sam Akka. Then what?', nextStep: 6, type: 'focus' },
        { text: 'Wait, did you steal her water too?', nextStep: 6, type: 'focus' },
      ]
    },
    // Step 4: Food route
    {
      storyText: 'Exactly! Gulab jamun, bondas, laddoos—I can sense them within a five-mile radius. In fact, I think there is a stray biscuit in Dr. Amrutha\'s office right now! Should we go inspect?',
      options: [
        { text: 'Yuktha, back to the lab story!', nextStep: 1, type: 'focus' },
        { text: 'Lead the way, Captain Food!', nextStep: 6, type: 'focus' },
      ]
    },
    // Step 5: Dress hunt
    {
      storyText: 'A red dress! I have been scrolling through Myntra for 14 hours. I found five red dresses. I took pictures. Here, look at them, they are so gorgeous! I need your help picking one right now.',
      options: [
        { text: 'Okay, show me the photos.', nextStep: 'photos', type: 'special' }
      ]
    },
    // Step 6: Final transition to photo picker
    {
      storyText: 'Anyway, I forgot where I was going with this story. Ah! I remember now. I need to post a photo on Instagram and I have these five options. They are literally the best photos ever. Pick one!',
      options: [
        { text: 'Show me the options!', nextStep: 'photos', type: 'special' }
      ]
    }
  ];

  const handleOptionClick = (option) => {
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
      setYappingHistory((prev) => [
        ...prev,
        { speaker: 'You', text: `Choose Photo #${idx}` },
        { speaker: 'Yuktha', text: `Hmm... but don't you think Photo #${idx === 1 ? 2 : 1} is slightly better? The lighting is more dramatic there! Look closely!` }
      ]);
    } else if (photoPickCount === 1) {
      setYappingHistory((prev) => [
        ...prev,
        { speaker: 'You', text: `Okay, let's go with that one.` },
        { speaker: 'Yuktha', text: `Wait, but what about Photo #3? The angle is so cute! Actually, let me ask three more people... Ah, whatever, you are the best! Let's just unlock my achievement!` }
      ]);
    } else {
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
                  {/* Styled photo thumbnail placeholder */}
                  <div style={styles.photoThumb}>
                    <Camera size={24} color="#555" />
                    <span style={styles.thumbText}>Red Dress #{idx}</span>
                  </div>
                  <button className="btn-neo" style={styles.selectBtn}>SELECT</button>
                </div>
              ))}
            </div>
            {photoPickCount >= 2 && (
              <button onClick={onComplete} className="btn-neo secondary animate-bounce-hover" style={styles.winBtn}>
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
    fontSize: '0.6rem',
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
