import './styles.css';

function Game({
  verifyLetter,
  pickedWord,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) {
  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Adivinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>
      <div className="word-container">
        {letters.map((letter, index) => (
          guessedLetters.includes(letter) ? (
            <span key={index} className="letter">{letter}</span>
          ) : (
            <span key={index} className="blank-square"></span>
          )
        ))}
      </div>
      <div className="letter-container">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form>
          <input type="text" name="letter" maxLength="1" required />
          <button type="button">Jogar!</button>
        </form>
        <div className="wrong-letters-container">
          <p>Letras já utilizadas:</p>
          {wrongLetters.map((wrongLetter, index) => (
            <span key={index}>{wrongLetter},</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Game;
