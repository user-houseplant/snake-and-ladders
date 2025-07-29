import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [numPlayers, setNumPlayers] = useState(2);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceResult, setDiceResult] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [tiles, setTiles] = useState([]);

  const ladders = [
    { start: 8, end: 26 },
    { start: 19, end: 38 },
    { start: 20, end: 82 },
    { start: 28, end: 53 },
    { start: 36, end: 57 },
    { start: 43, end: 77 },
    { start: 54, end: 88 },
    { start: 62, end: 96 },
    { start: 66, end: 87 },
    { start: 80, end: 99 }
  ];

  const snakes = [
    { start: 44, end: 22 },
    { start: 46, end: 15 },
    { start: 48, end: 9 },
    { start: 52, end: 11 },
    { start: 59, end: 18 },
    { start: 64, end: 24 },
    { start: 68, end: 2 },
    { start: 69, end: 33 },
    { start: 83, end: 22 },
    { start: 92, end: 51 },
    { start: 95, end: 37 },
    { start: 98, end: 15 }
  ];

  useEffect(() => {
    const newTiles = [];
    for (let row = 0; row < 10; row++) {
      const currentRow = [];
      for (let col = 0; col < 10; col++) {
        const num = row % 2 === 0 ? row * 10 + col + 1 : row * 10 + (9 - col) + 1;
        currentRow.push(num);
      }
      newTiles.unshift(...currentRow);
    }
    setTiles(newTiles);
  }, []);

  const startGame = () => {
    const initPlayers = [];
    for (let i = 0; i < numPlayers; i++) {
      initPlayers.push({ id: i, pos: 1 });
    }
    setPlayers(initPlayers);
    setCurrentPlayer(0);
    setGameStarted(true);
    setDiceResult(null);
  };

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(roll);

    setPlayers((prevPlayers) => {
      return prevPlayers.map((player, i) => {
        if (i === currentPlayer) {
          let newPos = player.pos + roll;

          if (newPos > 100) newPos = player.pos;

          const ladder = ladders.find(l => l.start === newPos);
          if (ladder) newPos = ladder.end;

          const snake = snakes.find(s => s.start === newPos);
          if (snake) newPos = snake.end;

          if (newPos === 100) {
            alert(`🎉 Player ${i + 1} wins!`);
            setGameStarted(false);
          }

          return { ...player, pos: newPos };
        }
        return player;
      });
    });

    setTimeout(() => {
      setCurrentPlayer((prev) => (prev + 1) % numPlayers);
    }, 500);
  };

  const playerColors = ['blue', 'red', 'green', 'purple'];

  return (
    <div
      className="game"
      style={{
        backgroundImage: "url('/img/art.png')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center"
      }}
    >
      <h1>Snakes and Ladders</h1>

      {!gameStarted ? (
        <div className="setup">
          <label>Select number of players:</label>
          <select value={numPlayers} onChange={(e) => setNumPlayers(Number(e.target.value))}>
            {[2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button className="button" onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <>
          <div className="controls">
            <p>🎲 Player {currentPlayer + 1}'s turn</p>
            <button className="button" onClick={rollDice}>Roll Dice</button>
            {diceResult && (
              <div className="dice-container">
                <img
                  src={`/img/dice${diceResult}.png`}
                  alt={`Dice ${diceResult}`}
                  className="dice-img"
                />
                <div id="dice-results">You rolled: {diceResult}</div>
              </div>
            )}
          </div>

          <div className="board-container">
            <img src="/img/SnakeLadder.png" alt="Board" className="board-img" />
            {players.map((p, i) => {
  const posIndex = tiles.indexOf(p.pos);
  const row = Math.floor(posIndex / 10);
  const col = posIndex % 10;

  const top = `${row * 10 + 5}%`; // 10% per row, +5% to center in tile
  const left = `${col * 10 + 5}%`; // 10% per col, +5% to center in tile

  return (
    <div
      key={i}
      className="player-piece"
      style={{
        position: 'absolute',
        top,
        left,
        backgroundColor: playerColors[p.id],
        width: '5%', // size of the token
        height: '5%',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)', // center visually
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.8rem'
      }}
    >
      {p.id + 1}
    </div>
  );
})}

          </div>
        </>
      )}
    </div>
  );
}

export default App;











