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
    tool(L) {
        this.addToolOn = false
        this.crossToolOn = false
        this.rotateToolOn = false
        this.moveToolOn = false
        if(L == 'A') this.addToolOn = true
        if(L == 'X') this.crossToolOn = true
        if(L == 'R') this.rotateToolOn = true
        if(L == 'M') this.moveToolOn = true 
    }
    hoverTile(hoverIn) {
        // this is the Tile component
        this.setState({ addTarget: hoverIn })
    }
    render() {
        let array = []
        if(this.props.active) array = Array(10).fill(0)
        return <div className="game-panel-container">
            <div className="game-panel">
                <svg className="game-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    {array.map((_, i) => <React.Fragment key={i}>
                    {array.map((_, j) => <Tile row={i} col={j} key={j} onhover={this.hoverTile} />)}
                    </React.Fragment>)}
                    <defs>
                        <path id="plus" d="M20 50 H80 M50 20 V80 Z" strokeWidth="10%"></path>
                        <use id="add" xlinkHref="#plus" stroke="black"></use>
                        <use id="cross" xlinkHref="#add" transform="rotate(45 50 50)"></use>
                        <polygon id="arrowhead" points="-12,0 12,0 0,-16" fill="black"></polygon>
                        <g id="rotate">
                            <path d="M75 50 A25 25 0 1 1 50 25" strokeWidth="10%" stroke="black" fill="none"></path>
                            <use xlinkHref="#arrowhead" transform="translate(75 50)"></use>
                        </g>
                        <g id="move">
                            <use xlinkHref="#add" transform="matrix(0.83, 0, 0, 0.83, 8.5, 8.5)"></use>
                            <use xlinkHref="#arrowhead" transform="translate(50 25)"></use>
                            <use xlinkHref="#arrowhead" transform="translate(50 75) rotate(180)"></use>
                            <use xlinkHref="#arrowhead" transform="translate(25 50) rotate(-90)"></use>
                            <use xlinkHref="#arrowhead" transform="translate(75 50) rotate(90)"></use>
                        </g>
                        <g id="target">
                            <use xlinkHref="#plus" stroke="red"></use>
                            <circle cx="50" cy="50" r="15" fill="silver" strokeWidth="10%" stroke="red"></circle> 
                        </g>
                    </defs>
                </svg>
                <div className="game-tools">
                    <div className="g-tool A" onClick={e=>this.tool('A')}><svg viewBox="0 0 100 100"><use xlinkHref="#add"></use></svg></div>
                    <div className="g-tool X" onClick={e=>this.tool('X')}><svg viewBox="0 0 100 100"><use xlinkHref="#cross"></use></svg></div>
                    <div className="g-tool R" onClick={e=>this.tool('R')}><svg viewBox="0 0 100 100"><use xlinkHref="#rotate"></use></svg></div>
                    <div className="g-tool M" onClick={e=>this.tool('M')}><svg viewBox="0 0 100 100"><use xlinkHref="#move"></use></svg></div>
                </div>
            </div>
        </div>
    }
}

class Tile extends React.Component {
    constructor(props) {
        super(props) 
        this.state = { addTarget: false }
    }
    render() {
        let [x, y] = [this.props.col * 10, this.props.row * 10] 
        return <React.Fragment>
            <svg x={x} y={y} width="10" height="10" viewBox="0 0 100 100">
                {this.state.addTarget ? <use xlinkHref="#target"></use> : null}
            </svg>
            <rect x={x} y={y} width="10" height="10" stroke="black" strokeWidth="0.5%" fill="transparent" 
            onMouseOver={this.props.onhover.bind(this, true)} onMouseOut={this.props.onhover.bind(this, false)}></rect>
        </React.Fragment>
    }
}