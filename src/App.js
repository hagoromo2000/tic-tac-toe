import { useState } from "react";
import Square from "./components/Square";

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      location: null,
    },
  ]);
  const currentHistory = history[history.length - 1];
  const currentSquares = currentHistory.squares;

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
        return { winner: currentSquares[a], line: lines[i] }; // 勝者と勝利ラインを返す
      }
    }
    return { winner: null, line: [] }; // 勝者がいない場合はnullと空の配列を返す
  }

  const handleClick = (i) => {
    if (currentSquares[i] || calculateWinner(currentSquares).winner) {
      return;
    }
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    setHistory(
      history.concat([
        {
          squares: nextSquares,
          location: i,
        },
      ])
    );
    setXIsNext(!xIsNext);
  };

  const winnerInfo = calculateWinner(currentSquares);
  let status;
  if (winnerInfo.winner) {
    status = "Winner: " + winnerInfo.winner; // 勝者がいる場合
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
    setHistory(history.slice(0, nextMove + 1));
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((step, move) => {
    const col = (step.location % 3) + 1;
    const row = Math.floor(step.location / 3) + 1;
    const description =
      move === history.length - 1 && move !== 0
        ? `You are at move #${move} (row: ${row}, col: ${col})`
        : move > 0
        ? `Go to move #${move} (row: ${row}, col: ${col})`
        : "Go to game start";

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
            highlight={winnerInfo.line.includes(squareIndex)} // 勝利ラインに該当するマス目の場合はハイライトする
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
