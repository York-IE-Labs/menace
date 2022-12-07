import Board from "./Board";
import History from "./History";
import { GameProvider } from "./GameContext";
import "./App.css";

function App() {
  return (
    <GameProvider>
      <div className="app-wrapper">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "100px",
            width: "100%",
          }}
        >
          <Board />
          <History />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
