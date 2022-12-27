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
            display: "grid",
            gridTemplateColumns: "minmax(0, 500px) minmax(0, 2fr)",
            gap: "40px",
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
