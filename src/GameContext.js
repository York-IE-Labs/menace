import React, { useState } from "react";

const GameContext = React.createContext();

const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);

  const addGame = (game) => {
    let yValueArr = [...games, game];
    let wins = yValueArr.filter((f) => f.status === "win").length;
    let draws = yValueArr.filter((f) => f.status === "draw").length;
    let losses = yValueArr.filter((f) => f.status === "loss").length;
    let yValue = 3 * wins + draws - losses;
    console.log("new game", { ...game, value: yValue });
    setGames([...games, { ...game, value: yValue }]);
  };

  return (
    <GameContext.Provider
      value={{
        addGame,
        games,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

function useGames() {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGames must be used within a GameProvider");
  }
  return context;
}

export { GameProvider, useGames };
