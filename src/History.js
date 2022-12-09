import React, { useMemo } from "react";
import { useGames } from "./GameContext";
import * as d3 from "d3";

/*
games: [
   {
      status: 'win'|'loss'|'draw',
      first_move: <board position>,
      first_move_color: 'string'
      value: int
   }
]
*/

const History = () => {
  const { games, clearGames } = useGames();
  const height = 1000;
  const width = 2000;
  const margin = { top: 10, bottom: 50, left: 75, right: 0 };
  const chartWidth = width - (margin.left + margin.right);
  const chartHeight = height - (margin.top + margin.bottom);
  const gamesCount = [
    ...Array(games.length > 10 ? games.length + 5 : 10).keys(),
  ];

  const scales = useMemo(() => {
    let [min, max] = d3.extent([-10, 10, ...games.map((d) => d.value)]);

    var yScale = d3.scaleLinear().domain([min, max]).range([chartHeight, 0]);

    var xScale = d3.scaleBand().domain(gamesCount).range([0, chartWidth]);

    const xGrid = gamesCount.map((t, i) =>
      gamesCount.length < 30 ||
      (i % 2 === 0 && gamesCount.length >= 30 && gamesCount.length < 100) ||
      (gamesCount.length >= 100 && i % 5 === 0) ? (
        <g key={`x-${t}`}>
          <text
            fill="rgba(0,0,0,.7)"
            fontSize="20px"
            textAnchor="middle"
            x={xScale(t)}
            y={yScale(-0.5)}
          >
            {t}
          </text>
        </g>
      ) : null
    );

    const yGrid = yScale.ticks().map((t, i) => (
      <g key={t}>
        <line
          stroke={t === 0 ? "rgba(0,0,0,.8)" : "rgba(0,0,0,.2)"}
          strokeDasharray={t === 0 ? null : "5,3"}
          x1={xScale(0) + margin.left / 2 - 10}
          y1={yScale(t)}
          x2={chartWidth}
          y2={yScale(t)}
        />

        {t === 0 && (
          <line
            stroke={"rgba(0,0,0,.8)"}
            x1={xScale(0) + margin.left / 2 - 10}
            y1={yScale(min)}
            x2={xScale(0) + margin.left / 2 - 10}
            y2={yScale(max)}
          />
        )}

        <text
          fill="rgba(0,0,0,.7)"
          textAnchor="middle"
          x={0}
          y={yScale(t) + 5}
          fontSize="20px"
        >
          {t}
        </text>
      </g>
    ));

    return { x: xScale, y: yScale, yGrid, xGrid };

    // eslint-disable-next-line
  }, [games]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="title">History</div>
        <button onClick={() => clearGames()}>Clear History</button>
      </div>
      <div>
        <svg className={`svg-content`} viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${margin.left / 2}, ${margin.top})`}>
            {scales.yGrid}
          </g>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {scales.xGrid}
          </g>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {games.map((g, i) => (
              <circle
                key={`game-${i}`}
                r={8}
                cx={scales.x(i)}
                cy={scales.y(g.value)}
                fill={g.first_move_color || "black"}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default History;
