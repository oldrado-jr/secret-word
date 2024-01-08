import { useEffect, useState } from 'react';

import { wordsList } from './data/words';

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

import './App.css';

function App() {
  const stages = [
    { id: 1, name: 'start' },
    { id: 2, name: 'game' },
    { id: 3, name: 'end' },
  ];

  const maxGuesses = 3;

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(maxGuesses);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = () => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];

    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  };

  const startGame = () => {
    const { word, category } = pickWordAndCategory();

    const wordLetters = word.toLowerCase().split('');

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  };

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter)
      || wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((currentGuessedLetters) => [
        ...currentGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((currentWrongLetters) => [
        ...currentWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((currentGuesses) => currentGuesses - 1);
    }
  };

  const retry = () => {
    setScore(0);
    setGuesses(maxGuesses);
    setGameStage(stages[0].name);
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  const endStageName = stages[2].name;

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      setGameStage(endStageName);
    }
  }, [guesses, endStageName]);

  return (
    <>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </>
  );
}

export default App;
