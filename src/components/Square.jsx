import React from "react";
import "../index.css";

const Square = ({ value, onSquareClick, highlight }) => {
  const className = "square" + (highlight ? " highlight" : "");
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
};

export default Square;
