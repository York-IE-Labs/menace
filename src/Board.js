import React, { useState, useEffect } from "react";
import POSITIONS from "./positions.json";
import { useGames } from "./GameContext";
import "./Board.css";

// All rotation operations for any board state
// I.e. any board state has 8 total representations after rotations and mirrors
const ROTS = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [0, 3, 6, 1, 4, 7, 2, 5, 8],
  [6, 3, 0, 7, 4, 1, 8, 5, 2],
  [6, 7, 8, 3, 4, 5, 0, 1, 2],
  [8, 7, 6, 5, 4, 3, 2, 1, 0],
  [8, 5, 2, 7, 4, 1, 6, 3, 0],
  [2, 5, 8, 1, 4, 7, 0, 3, 6],
  [2, 1, 0, 5, 4, 3, 8, 7, 6],
];

// Create array of numbers to represent board map
// x == 2
// o == 1
// empty == 0
const translateBoardNumbers = (board) => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
    !!board[i] ? (board[i] === "x" ? "2" : "1") : "0"
  );
};

// Apply a provided rotation to a board state
function applyRotationStr(position, rotation) {
  var new_pos = "";
  for (var j = 0; j < 9; j++) {
    new_pos += position[rotation[j]];
  }
  return new_pos;
}

// A miniature render of a tic-tac-toe board
const Rotation = ({ boardString, setRotation }) => {
  const board = boardString.split(""); // split board string into array

  return (
    <div className={`mini-board`} onClick={() => setRotation(board)}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={`position-${boardString}-${i}`} className="pos">
          <div>{board[i] === "2" ? "x" : board[i] === "1" ? "o" : ""}</div>
        </div>
      ))}
    </div>
  );
};

// Renders all possible rotations of a given board state
const AllRotations = ({ board, setRotation }) => {
  const [rots, setRots] = useState([]);
  const [max, setMax] = useState(null);

  useEffect(() => {
    // get all rotations of a provided board state
    // translate board map into number for map retrieval
    let current = translateBoardNumbers(board);
    let rs = [];
    let m = null;

    // apply each rotation to the given board state
    for (const r of ROTS) {
      let nextr = applyRotationStr(current, r);
      // only add unique rotations
      if (!rs.includes(nextr)) {
        rs.push(nextr);

        if (!!POSITIONS[nextr]) m = POSITIONS[nextr];
      }
    }
    setRots(rs);
    setMax(m);
  }, [board]);

  // render each mini board to see all rotations of the given state
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="rotation-wrap">
        <div className="title">ROTATIONS</div>
        <div className="all-rotations">
          {rots.map((r, i) => (
            <Rotation
              key={`rotation-${i}`}
              boardString={r}
              setRotation={setRotation}
            />
          ))}
        </div>
      </div>
      {max && (
        <div className="rotation-wrap">
          <div className="title">BOX</div>
          <div>
            <span className="max-value">{max}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Board = () => {
  const [boardState, setBoardState] = useState({}); // current board state
  const [move, setMove] = useState(0); // move index
  const [first, setFirst] = useState("green");
  const { addGame } = useGames();
  const blues = [0, 2, 6, 8];
  const reds = [1, 3, 5, 7];

  // reset board
  const onReset = () => {
    setBoardState({});
    setMove(0);
  };

  // click position on board to set next value
  const onClick = (position) => {
    // automatically keep track of turn
    let turn = move % 2 === 0 ? "o" : "x";
    if (!!!boardState[position]) {
      if (move === 0) {
        let firstColor = "green";
        if (blues.includes(position)) {
          firstColor = "blue";
        } else if (reds.includes(position)) {
          firstColor = "red";
        }
        setFirst(firstColor);
      }
      setBoardState({ ...boardState, [position]: turn });
      setMove(move + 1);
    }
  };

  // user can click one of the possible rotations of the current board to set it to that rotation
  // could be useful for keeping track along with physical boxes
  const setRotation = (rotation) => {
    let newBoard = {};
    for (let index = 0; index < rotation.length; index++) {
      const element = rotation[index];
      if (!!element)
        newBoard[index] = element === "2" ? "x" : element === "1" ? "o" : null;
    }
    setBoardState(newBoard);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "100px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "40px",
          boxShadow: "1px 1px 5px rgba(0,0,0,.2)",
          borderRadius: "4px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="title">Current Game</div>
          <button onClick={onReset}>Reset</button>
        </div>
        <div className="board-wrapper">
          <div className="menace-board">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={`position-${i}`}
                className="pos"
                onClick={() => onClick(i)}
              >
                <div className={!!boardState[i] ? "done" : "movable"}>
                  {!!boardState[i] ? boardState[i] : ""}
                </div>
              </div>
            ))}
          </div>
          <div className="board-rotations">
            <AllRotations board={boardState} setRotation={setRotation} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => addGame({ status: "win", first_move_color: first })}
          >
            MENACE Wins
          </button>
          <button
            onClick={() => addGame({ status: "draw", first_move_color: first })}
          >
            Draw
          </button>
          <button
            onClick={() => addGame({ status: "loss", first_move_color: first })}
          >
            Human Wins
          </button>
        </div>
      </div>
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="title">History</div>
        </div>
      </div> */}
    </div>
  );
};

export default Board;
