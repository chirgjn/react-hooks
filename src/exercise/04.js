// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({selectSquare, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [moves, setMoves] = useLocalStorageState('game-history', []);
  const [currentStep, setCurrentStep] = React.useState(moves.length);
  const squares = React.useMemo(() => {
    const arr = Array(9).fill(null);
    for (let i = 0; i < currentStep; i++) {
      arr[moves[i]] = calculateNextValue(arr);
    }
    return arr;
  }, [moves, currentStep]);
  const nextValue = calculateNextValue(squares);
  const winner = calculateWinner(squares);
  const gameStatus = calculateStatus(winner, squares, nextValue);

  const selectSquare = (square) => {
    if (squares[square] || winner) { return; }
    const copyMoves = [...moves];
    copyMoves[currentStep] = square;
    setMoves(copyMoves);
    setCurrentStep(step => step + 1);
  }

  const restart = () => {
    setMoves([]);
    setCurrentStep(0);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} selectSquare={selectSquare} />
      <button className="restart" onClick={restart}>
        restart
      </button>
      </div>
      <div className="game-info">
        <div className="status">{gameStatus}</div>
	  <ol>
	 <li><button onClick={() => setCurrentStep(0)} disabled={currentStep === 0}>Go to game start{currentStep === 0 ? ' (current)' : ''}</button></li>
	  {moves.map((m, i) => <li><button onClick={() => setCurrentStep(i+1)} disabled={currentStep === i+1}>Go to move #{i+1} {currentStep === i+1 ? ' (current)' : ''}</button></li>)}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
