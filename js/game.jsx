import React from 'react';
import '../public/css/game.css'
import './utils.jsx'

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
        this.state = { active: this.props.active, hover: null, contextTile: null, airplanes: [], outlineOn: null,
        selected: null }
        this.tilemap = Array(10).fill(0).map(row => Array(10).fill(0).map(col => React.createRef()))
        this.toolbar = React.createRef()
        this.akey = 0
    }
    tool(L) {
        let toolbar = this.toolbar.current
        toolbar.setState({ tool: L })
        this.setState({ selected: null, outlineOn: null })
        this.activeTool = L
    }
    hoverTile(hoverIn, position) {
        if(this.activeTool == 'A') {
            this.setState({ hover: (hoverIn ? 'target' : null), contextTile: position })
        }
        if(this.activeTool == 'X') {
            let tile = this.tilemap[position.row][position.col].current
            if(tile.has == 'H' || tile.has == 'B') {
                this.setState({ outlineOn: hoverIn ? {...tile.airplane, color: 'red'} : null })
            }
        }
        if(this.activeTool == 'R' && !this.state.selected) {
            let tile = this.tilemap[position.row][position.col].current
            if(tile.has == 'H' || tile.has == 'B') {
                this.setState({ outlineOn: hoverIn ? {...tile.airplane, color: 'blue'} : null })
            }
        }
        if(this.activeTool == 'M' && !this.state.selected) {
            let tile = this.tilemap[position.row][position.col].current
            if(tile.has == 'H' || tile.has == 'B') {
                this.setState({ outlineOn: hoverIn ? {...tile.airplane, color: 'gold'} : null })
            }
        }
    }
    clickTile(row, col) {
        if(this.activeTool == 'A') {
            let airplanes = this.state.airplanes
            if(airplanes.length < 3) {
                let a = {row, col, key: this.akey++}
                this.setState({ airplanes: airplanes.concat(a), hover: null, outlineOn: {...a, color: 'blue'} })
                this.registerAirplane(a)
                this.activeTool = 'R'; this.selected = a
                this.toolbar.current.setState({ tool: 'R' })
            }
        }
        if(this.activeTool == 'X') {
            let tile = this.tilemap[row][col].current
            let airplanes = this.state.airplanes.remove(tile.airplane)
            if(tile.has == 'H' || tile.has == 'B') {
                this.setState({ outlineOn: null, airplanes })
                this.registerAirplane(tile.airplane, true)
            }
        }
        if(this.activeTool == 'R' || this.activeTool == 'M') {
            let tile = this.tilemap[row][col].current
            this.setState({ selected: tile.airplane })
        }

    }
    registerAirplane(airplane, remove=false) {
        let shape = [[0,0], [0,1], [-1,1], [-2,1], [1,1], [2,1], [0,2], [0,3], [-1,3], [1,3]]
        shape.forEach(([dx, dy]) => {
            let tile = this.tilemap[airplane.row + dy][airplane.col + dx].current
            tile.has = !remove ? ((dx == 0 && dy == 0) ? 'H' : 'B') : 'A'
            tile.airplane = airplane
        })
    }
    render() {
        let array = []
        if(this.props.active) array = Array(10).fill(0)
        return <div className="game-panel-container">
            <div className="game-panel">
                <svg className="game-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    {/* tiles */}
                    {array.map((_, i) => <React.Fragment key={i}>
                    {array.map((_, j) => <Tile row={i} col={j} key={j} onhover={this.hoverTile.bind(this)} 
                    click={this.clickTile.bind(this)} ref={this.tilemap[i][j]} />)}
                    </React.Fragment>)}
                    {/* defs */}
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
                        <mask id="target-hole">
                            <rect x="0" y="0" width="100" height="100" fill="white"></rect>
                            <circle cx="50" cy="50" r="15" fill="silver" fill="black"></circle>
                        </mask>
                        <g id="target">
                            <use xlinkHref="#plus" stroke="red" mask="url(#target-hole)"></use>
                            <circle cx="50" cy="50" r="15" fill="transparent" strokeWidth="10" stroke="red"></circle>
                        </g>
                        <g id="no-target">
                            <use xlinkHref="#plus" stroke="#333" mask="url(#target-hole)"></use>
                            <circle cx="50" cy="50" r="15" fill="transparent" strokeWidth="10" stroke="#333"></circle>
                        </g>
                        <polygon id="airplane" points="5,0 0,10 -20,10 -20,20, 0,20 0,30 -10,30 -10,40 20,40 20,30 10,30 10,20 30,20 30,10 10,10 5,0"
                        style={{pointerEvents: 'none'}}></polygon>
                    </defs>
                    {/* airplanes */}
                    {this.state.airplanes.map(({row, col, key}) => <use xlinkHref="#airplane" key={key} x={col*10} y={row*10} 
                    fill="white" stroke="black" strokeWidth="0.5"></use>)}
                    {/* outline */}
                    {this.state.outlineOn ? (o=><use xlinkHref="#airplane" x={o.col*10} y={o.row*10} stroke={o.color} strokeWidth="0.5" 
                    fill="white"></use>)(this.state.outlineOn) : null}
                    {/* context tile: target etc. */}
                    {this.state.contextTile ?
                    <svg x={this.state.contextTile.col*10} y={this.state.contextTile.row*10} width="10" height="10" viewBox="0 0 100 100"
                    style={{pointerEvents: 'none'}}>
                        {this.state.hover == 'target' ? 
                        <use xlinkHref={`#${this.state.airplanes.length < 3 ? '' : 'no-'}target`}></use> : null}
                    </svg> : null}
                </svg>
                <GameTools ref={this.toolbar} tool={this.tool.bind(this)}></GameTools>
            </div>
        </div>
    }
}

class GameTools extends React.Component {
    constructor(props) {
        super(props)
        this.state = { tool: null }
    }
    render() {
        return <div className="game-tools">
            <div className={"g-tool A" + (this.state.tool == 'A' ? " active" : "")} onClick={e=>this.props.tool('A')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#add"></use></svg></div>
            <div className={"g-tool X" + (this.state.tool == 'X' ? " active" : "")} onClick={e=>this.props.tool('X')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#cross"></use></svg></div>
            <div className={"g-tool R" + (this.state.tool == 'R' ? " active" : "")} onClick={e=>this.props.tool('R')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#rotate"></use></svg></div>
            <div className={"g-tool M" + (this.state.tool == 'M' ? " active" : "")} onClick={e=>this.props.tool('M')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#move"></use></svg></div>
        </div>
    }
}

class Tile extends React.Component {
    constructor(props) {
        super(props) 
        this.state = { }
    }
    render() {
        let {row, col} = this.props
        let [x, y] = [col * 10, row * 10]
        return <React.Fragment>
            <rect x={x} y={y} width="10" height="10" stroke="black" strokeWidth="0.5" fill="transparent"
            onMouseOver={e=>this.props.onhover(true, {row, col})} onMouseOut={e=>this.props.onhover(false, {row, col})} 
            onClick={e=>this.props.click(row, col)}></rect>
        </React.Fragment>
    }
}