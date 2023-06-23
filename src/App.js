import { useState } from "react";
import Square from "./components/Square";

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  const handleClick = (i) => {
    // 勝敗が決まっている場合、またはクリックされたマス目が埋まっている場合は何もしない
    if (currentSquares[i] || calculateWinner(currentSquares)) {
      return;
    }
    setHistory(history.concat([currentSquares]));
    const nextSquares = currentSquares.slice(); // squaresのコピーを作成
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setHistory(history.concat([nextSquares]));
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = "Winner: " + winner; // 勝者がいる場合
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O"); // 勝者がいない場合
  }

  // 手番を戻す
  const back = () => {
    if (history.length === 1) {
      return;
    }
    setHistory(history.slice(0, history.length - 1));
    setXIsNext(!xIsNext);
  };

  function jumpTo(nextMove) {
    setHistory(history.slice(0, nextMove + 1)); // nextMoveの手番まで戻す
    setXIsNext(nextMove % 2 === 0); // 手番を設定
    console.log(history);
  }

  // 過去の盤面
  const moves = history.map((squares, move) => {
    let description;
    if (move === history.length - 1) {
      description = "You are at move #" + move;
    } else if (move > 0) {
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

  // 盤面をループで表示する
  const renderBoardRow = (row) => {
    return (
      <div key={row} className="board-row">
        {row.map((squareIndex) => (
          <Square
            key={squareIndex}
            value={currentSquares[squareIndex]}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    );
  };

  const boardRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  return (
    <>
      <div className="status">{status}</div>
      <div>{boardRows.map((row) => renderBoardRow(row))}</div>
      <button onClick={back}>Back</button>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </>
  );
}

// 勝敗判定
function calculateWinner(currentSquares) {
  const lines = [
    [0, 1, 2], // 横のライン
    [3, 4, 5], // 横のライン
    [6, 7, 8], // 横のライン
    [0, 3, 6], // 縦のライン
    [1, 4, 7], // 縦のライン
    [2, 5, 8], // 縦のライン
    [0, 4, 8], // 斜めのライン
    [2, 4, 6], // 斜めのライン
  ];
  for (let i = 0; i < lines.length; i++) {
    // linesの要素数分ループ
    const [a, b, c] = lines[i]; // linesの要素をa, b, cに代入
    if (
      currentSquares[a] && // aがnullでない
      currentSquares[a] === currentSquares[b] && // aとbが同じ
      currentSquares[a] === currentSquares[c] // aとcが同じ
    ) {
      return currentSquares[a]; // 勝者を返す
    }
  }
  return null; // 勝者がいない場合はnullを返す
}
