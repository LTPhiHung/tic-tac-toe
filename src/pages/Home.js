import { useState } from 'react';
import "./home.css";

function Square({ value, onSquareClick, highLight }) {
    return (
        <button className={"square" + (highLight ? " highLight" : "")} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay, moves }) {
    function handleClick(i, indexRow, indexColum) {
        if (calculateWinner(squares.moves) || squares.moves[i]) {
            return;
        }
        const nextSquaresMoves = squares.moves.slice();
        if (xIsNext) {
            nextSquaresMoves[i] = 'X';
        } else {
            nextSquaresMoves[i] = 'O';
        }
        const nextSquares = {
            moves: nextSquaresMoves,
            lastMove: { row: indexRow, col: indexColum }
        };
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares.moves);
    let status;
    if (winner) {
        status = 'Winner: ' + winner.icon;
    } else if (moves.length > 3 * 3) {
        status = 'This game is a draw';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    const gridData = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
    ];

    const rows = gridData.map((row, indexRow) => (
        <div className="board-row">
            {
                row.map((cell, indexColum) => (
                    <Square value={squares.moves[cell]} highLight={winner && winner.winningMove.includes(cell)} onSquareClick={() => handleClick(cell, indexRow, indexColum)} />
                ))
            }
        </div>
    ))

    return (
        <>
            <div className="status">{status}</div>
            {rows}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([{
        moves: Array(9).fill(null),
        lastMove: { row: null, col: null },
    }]);

    const [currentMove, setCurrentMove] = useState(0);
    const [isAcending, setIsAcending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const sortMoves = () => {
        setIsAcending(!isAcending);
    }

    const moves = history.map((squares, move) => {
        let description;
        console.log(currentMove)
        if (move !== currentMove || currentMove == 0) {
            if (move > 0) {
                description = `Go to move #${move} (${squares.lastMove.row}, ${squares.lastMove.col})`;
            } else {
                description = 'Go to game start';
            }
        } else {
            description = `You are at move #${move} (${squares.lastMove.row}, ${squares.lastMove.col})`;
        }
        return (
            <li key={move}>
                {currentMove !== move || currentMove == 0 ? <button onClick={() => jumpTo(move)}>{description}</button> : <span>{description}</span>}
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} moves={moves} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <button onClick={sortMoves}>{isAcending ? "Descending" : "Ascending"}</button>
                <ol reversed={!isAcending}>{isAcending ? moves : moves.slice().reverse()}</ol>
            </div>
        </div>
    );
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
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { icon: squares[a], winningMove: lines[i] };
        }
    }
    return null;
}
