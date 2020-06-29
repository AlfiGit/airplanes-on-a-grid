import React from 'react';

export default function GamePage({lang='en', gameId, isPlayer1}) {
    app.user.isPlaying = true
    app.user.gameId = gameId
    if(!isPlayer1) app.user.partnerHasJoined = true

    return <React.Fragment>
        <div style={{width: "100%", height: "auto"}}>
            <GamePanel />
            <GamePanel />
        </div>
    </React.Fragment>
}

function GamePanel() {
    let array = Array(10).fill(0)
    return <svg className="game-panel" xmlns="http://www.w3.org/2000/svg" 
    style={{height: `${(0.4 * document.documentElement.clientWidth) / innerWidth * 100}vw`}}>
      {array.map((_, i) => {
          return <React.Fragment key={i}>
              {array.map((_, j) => <Tile row={i} col={j} key={j} />)}
          </React.Fragment>
      })}
    </svg>
}

function Tile({row, col}) {
    let [x, y] = [row * 10 + '%', col * 10 + '%'] 
    return <rect x={x} y={y} width="10%" height="10%" stroke="black" strokeWidth="0.5%" fill="transparent"></rect>
}