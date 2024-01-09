import { useCallback, useEffect, useMemo, useState } from 'react';

import { wordsList } from './data/words';

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

import './App.css';

function App() {
  const stages = useMemo(() => {
    return [
      { id: 1, name: 'start' },
      { id: 2, name: 'game' },
      { id: 3, name: 'end' },
    ];
  }, []);

  const maxGuesses = 3;

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(maxGuesses);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    clearLettersStates();

    const { word, category } = pickWordAndCategory();

    const wordLetters = word.toLowerCase().split('');

    setPickedCategory(category);
    setLetters(wordLetters);
    setGuesses(maxGuesses);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory, stages]);

  // handle letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check if guessed letter has already been used
    if (
      guessedLetters.includes(normalizedLetter)
      || wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // add guessed letter or remove a chance
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

  // restart the game
  const retry = () => {
    setScore(0);
    setGuesses(maxGuesses);
    setGameStage(stages[0].name);
  };

  // clear letters state
  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // game ends and clear all states
      clearLettersStates();

      setGameStage(stages[2].name);
    }
  }, [guesses, stages]);

  // check win condition
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)];

    // win contition
    if (
      gameStage === 'game'
      && guessedLetters.length === uniqueLetters.length
    ) {
      // add score
      setScore((currentScore) => currentScore + 100);

      // restart game with a new word
      startGame();
    }
  }, [letters, guessedLetters, gameStage, startGame]);

  return (
    <>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
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
