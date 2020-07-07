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
                    <defs>
                        <path id="plus" d="M20 50 H80 M50 20 V80 Z" strokeWidth="10%" stroke="black"></path>
                        <use id="cross" xlinkHref="#plus" transform="rotate(45 50 50)"></use>
                        <polygon id="arrowhead" points="-12,0 12,0 0,-16" fill="black"></polygon>
                        <g id="rotate">
                            <path d="M75 50 A25 25 0 1 1 50 25" strokeWidth="10%" stroke="black" fill="none"></path>
                            {/*<polygon points="63,50 87,50 75,34" fill="black"></polygon>*/}
                            <use xlinkHref="#arrowhead" transform="translate(75 50)"></use>
                        </g>
                        <g id="move">
                            <use xlinkHref="#plus" transform="matrix(0.83, 0, 0, 0.83, 8.5, 8.5)"></use>
                            <use xlinkHref="#arrowhead" transform="translate(50 25)"></use>
                            <use xlinkHref="#arrowhead" transform="translate(50 75) rotate(180)"></use>
                            <use xlinkHref="#arrowhead" transform="translate(25 50) rotate(-90)"></use>
                            <use xlinkHref="#arrowhead" transform="translate(75 50) rotate(90)"></use>
                        </g>
                    </defs>
                </svg>
                <div className="game-tools">
                    <div className="g-tool A"><svg viewBox="0 0 100 100"><use xlinkHref="#plus"></use></svg></div>
                    <div className="g-tool X"><svg viewBox="0 0 100 100"><use xlinkHref="#cross"></use></svg></div>
                    <div className="g-tool R"><svg viewBox="0 0 100 100"><use xlinkHref="#rotate"></use></svg></div>
                    <div className="g-tool M"><svg viewBox="0 0 100 100"><use xlinkHref="#move"></use></svg></div>
                </div>
            </div>
        </div>
    }
}

function Tile({row, col}) {
    let [x, y] = [row * 10 + '%', col * 10 + '%'] 
    return <rect x={x} y={y} width="10%" height="10%" stroke="black" strokeWidth="0.5%" fill="transparent"></rect>
}