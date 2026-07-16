import React, { useState } from 'react';
import LandingScreen from './pages/LandingScreen';
import CharacterSelect from './pages/CharacterSelect';
import GameContainer from './components/GameContainer';
import './styles/games.css';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'select' | 'game'
  const [selectedChar, setSelectedChar] = useState(null);

  const handleStart = () => {
    setView('select');
  };

  const handleSelectCharacter = (character) => {
    setSelectedChar(character);
    setView('game');
  };

  const handleBackToSelect = () => {
    setSelectedChar(null);
    setView('select');
  };

  return (
    <div className="game-layout">
      {view === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}

      {view === 'select' && (
        <CharacterSelect onSelectCharacter={handleSelectCharacter} />
      )}

      {view === 'game' && selectedChar && (
        <GameContainer
          character={selectedChar}
          onBackToSelect={handleBackToSelect}
        />
      )}
    </div>
  );
}
