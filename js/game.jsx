import React from 'react';
import '../public/css/game.css'

export default class GamePage extends React.Component {
    constructor(props) {
        super(props)
        app.gameComponent = this
        this.state = { player2Joined: !app.user.isPlayer1 }
    }
    render() {
        //alert('game page rerendered; player2Joined=' + this.state.player2Joined)
        return <React.Fragment>
            <div style={{width: "100%", height: "auto"}}>
                <GamePanel active={true} />
                <GamePanel active={this.state.player2Joined} />
            </div>
        </React.Fragment>
    }
}

class GamePanel extends React.Component {
    constructor(props) {
        super(props)
        //alert('Panel reconstructed')
        this.state = { active: this.props.active }
    }
    render() {
        //alert('game panel rerendered; active=' + this.state.active)
        let array = []
        if(this.props.active) array = Array(10).fill(0)
        return <div className="game-panel-container">
            <div className="game-panel">
                <svg className="game-svg" xmlns="http://www.w3.org/2000/svg">
                    {array.map((_, i) => <React.Fragment key={i}>
                    {array.map((_, j) => <Tile row={i} col={j} key={j} />)}
                    </React.Fragment>)}
                </svg>
                <div className="game-tools">
                    <div className="g-tool A">+</div>
                    <div className="g-tool X">⨯</div>
                    <div className="g-tool R">↻</div>
                    <div className="g-tool M">✥</div>
                </div>
            </div>
        </div>
    }
}

function Tile({row, col}) {
    let [x, y] = [row * 10 + '%', col * 10 + '%'] 
    return <rect x={x} y={y} width="10%" height="10%" stroke="black" strokeWidth="0.5%" fill="transparent"></rect>
}