import React from 'react';
import '../public/css/game.css'

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
    let h = (0.4 * document.documentElement.clientWidth) / innerWidth * 100
    return <div className="game-panel">
        <svg className="game-svg" xmlns="http://www.w3.org/2000/svg" style={{height: `${h}vw`}}>
            {array.map((_, i) => <React.Fragment key={i}>
              {array.map((_, j) => <Tile row={i} col={j} key={j} />)}
            </React.Fragment>)}
        </svg>
        <div className="game-tools">
            <div className="g-tool-A">A</div>
            <div className="g-tool-X">X</div>
        </div>
    </div>
}

function Tile({row, col}) {
    let [x, y] = [row * 10 + '%', col * 10 + '%'] 
    return <rect x={x} y={y} width="10%" height="10%" stroke="black" strokeWidth="0.5%" fill="transparent"></rect>
}