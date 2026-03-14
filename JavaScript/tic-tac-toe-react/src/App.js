import { useState } from "react"; // React hook for managing state

// Square component - Single board cell
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}> // Click handler for the square
      {value} // Display the value of the square (X, O, or null)
    </button>
  );
}

// Board component - Tic-tac-toe board
function Board({ xIsNext, squares, onPlay }) {
    // Handle click on a square
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) { // Prevent overwrite
      return;
    }
    const nextSquares = squares.slice(); // Copy Array
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares); // Update the game state with the new move
  }

  const winner = calculateWinner(squares); // Check Winner
  let status;
  if (winner) {
    status = "Winner: " + winner; // Display winner
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O"); // Display next player
  }

  return (
    <>
      <div className="status">{status}</div> // Game status display
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Main Game Component/Controller - manages the state of the game and renders the Board and move history
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // Game history state
  const [currentMove, setCurrentMove] = useState(0); // Move index
  const xIsNext = currentMove % 2 === 0; // Player turn based on move index
  const currentSquares = history[currentMove]; // Current board state based on move index

  // Update game history
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); // Save history
    setCurrentMove(nextHistory.length - 1); // Update current move index
  }

  // Jump Move History
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} /> // Render Board
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Winner Logic - Check if there's a winner based on the current board state
function calculateWinner(squares) { 
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
