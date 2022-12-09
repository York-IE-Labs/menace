import React, { useState } from "react";

const GameContext = React.createContext();
const STORAGE_KEY = "menace_games";

const GameProvider = ({ children }) => {
  const [games, setGames] = useState(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );

  const clearGames = () => {
    localStorage.setItem(STORAGE_KEY, "[]");
    setGames([]);
  };

  const addGame = (game) => {
    let yValueArr = [...games, game];
    let wins = yValueArr.filter((f) => f.status === "win").length;
    let draws = yValueArr.filter((f) => f.status === "draw").length;
    let losses = yValueArr.filter((f) => f.status === "loss").length;
    let yValue = 3 * wins + draws - losses;
    console.log("new game", { ...game, value: yValue });

    let updateGames = [...games, { ...game, value: yValue }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updateGames));
    setGames(updateGames);
  };

  return (
    <GameContext.Provider
      value={{
        addGame,
        games,
        clearGames,
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
