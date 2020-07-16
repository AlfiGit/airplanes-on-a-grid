import React from 'react';
import '../public/css/game.css'
import './utils.jsx'
import GameDefs from './defs.jsx';

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
        this.state = { active: this.props.active, hover: null, contextTile: null, airplanes: {}, outlineOn: null,
        selected: null }
        this.tilemap = Array(10).fill(0).map(row => Array(10).fill(0).map(col => React.createRef()))
        this.toolbar = React.createRef()
        this.key_root = 0
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
                this.setState({ outlineOn: hoverIn ? {key: tile.akey, color: 'red'} : null })
            }
        }
        if(this.activeTool == 'R' && !this.state.selected) {
            let tile = this.tilemap[position.row][position.col].current
            if(tile.has == 'H' || tile.has == 'B') {
                this.setState({ outlineOn: hoverIn ? {key: tile.akey, color: 'blue'} : null })
            }
        }
        if(this.activeTool == 'M' && !this.state.selected) {
            let tile = this.tilemap[position.row][position.col].current
            if(tile.has == 'H' || tile.has == 'B') {
                this.setState({ outlineOn: hoverIn ? {key: tile.akey, color: 'gold'} : null })
            }
        }
    }
    clickTile(row, col) {
        if(this.activeTool == 'A') {
            if(Object.values(this.state.airplanes).length < 3) {
                let airplanes = {...this.state.airplanes}, key = this.key_root++
                let a = {row, col, r: 0}
                airplanes[key] = a
                this.setState({ airplanes, hover: null, outlineOn: {key, color: 'blue'}, selected: key })
                this.registerAirplane(a, key)
                this.activeTool = 'R';
                this.toolbar.current.setState({ tool: 'R' })
            }
        }
        if(this.activeTool == 'X') {
            let tile = this.tilemap[row][col].current
            let airplanes = {...this.state.airplanes} 
            let deletedAirplane = airplanes[tile.akey]
            delete airplanes[tile.akey]
            if(tile.has == 'H' || tile.has == 'B') {
                this.setState({ outlineOn: null, airplanes })
                this.registerAirplane(deletedAirplane, tile.akey, false)
            }
        }
        if(this.activeTool == 'R' || this.activeTool == 'M') {
            let tile = this.tilemap[row][col].current
            this.setState({ selected: tile.akey })
        }

    }
    registerAirplane(adesc, akey, add=true) {
        let shape = [[0,0], [0,1], [-1,1], [-2,1], [1,1], [2,1], [0,2], [0,3], [-1,3], [1,3]]
        let cos = r => r == 0 ? 1 : r == 90 ? 0 : r == -90 ? 0 : r == 180 ? -1 : null
        let sin = r => r == 0 ? 0 : r == 90 ? 1 : r == -90 ? -1 : r == 180 ? 0 : null
        let rmatrix = (x, y, r) => [x * cos(r) - y * sin(r), y * cos(r) + x * sin(r)]
        shape.forEach(([dx, dy]) => {
            [dx, dy] = rmatrix(dx, dy, adesc.r)
            if(0 <= adesc.row + dy && adesc.row + dy < 10 && 0 <= adesc.col + dx && adesc.col + dx < 10) {
                let tile = this.tilemap[adesc.row + dy][adesc.col + dx].current
                tile.has = add ? ((dx == 0 && dy == 0) ? 'H' : 'B') : 'A'
                tile.akey = add ? akey : null
            }
        })
    }
    rotateAirplane(key, r) {
        let airplanes = {...this.state.airplanes}
        this.registerAirplane(airplanes[key], key, false)
        airplanes[key].r = r
        this.setState({ airplanes })
        this.registerAirplane(airplanes[key], key, true)
    }
    rotateOk() {
        this.toolbar.current.setState({ tool: 'A' })
        this.activeTool = 'A'
        this.setState({ outlineOn: null, selected: null })
    }
    moveAirplane(key, r) {
        let m = r == 0 ? [0, -1] : r == 90 ? [1, 0] : r == -90 ? [-1, 0] : [0, 1]
        let airplane = {...this.state.airplanes[key]}
        this.registerAirplane(airplane, key, false)
        airplane.row += m[1]; airplane.col += m[0];
        let airplanes = {...this.state.airplanes}
        airplanes[key] = airplane
        this.setState({ airplanes })
        this.registerAirplane(airplane, key, true)
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
                    <GameDefs />
                    {/* airplanes */}
                    {Object.entries(this.state.airplanes).map(([key, {row, col, r}]) => <use xlinkHref="#airplane" key={key}
                    fill="white" stroke="black" strokeWidth="0.5" transform={`translate(${col*10 + 5} ${row*10 + 5}) rotate(${r})`}></use>)}
                    {/* outline */}
                    {this.state.outlineOn ? ((a,c)=><use xlinkHref="#airplane" stroke={c} strokeWidth="0.5" fill="white" 
                    transform={`translate(${a.col*10 + 5} ${a.row*10 + 5}) rotate(${a.r})`}></use>)
                    (this.state.airplanes[this.state.outlineOn.key], this.state.outlineOn.color) : null}
                    {/* rotate & move gui */}
                    {this.state.selected ? ((a,c) => {
                        let arr = [-90, 90, 0, 180]
                        return <>
                          {arr.map(angle => <use xlinkHref="#circle-btn" key={angle} 
                          onClick={e=>(c == 'R' ? this.rotateAirplane : this.moveAirplane).call(this, this.state.selected, angle)}
                          transform={`translate(${a.col * 10 + 5} ${a.row * 10 + 5}) rotate(${angle})`} 
                          className={c == 'R' ? a.r != angle ? 'blue-btn' : 'grey-btn' : 'gold-btn'}></use>)}
                          <g onClick={this.rotateOk.bind(this)}>
                            <circle cx={a.col * 10 + 5} cy={a.row * 10 + 5} r="3" class="green-btn" />
                            <path d="M-2 0 L0 2 L3 -4" stroke="white" fill="none" strokeWidth="0.5" 
                            transform={`translate(${a.col * 10 + 5} ${a.row * 10 + 5})`} style={{pointerEvents: 'none'}}/>
                          </g>
                        </>
                    })(this.state.airplanes[this.state.selected], this.activeTool) : null}
                    {/* context tile: target etc. */}
                    {this.state.contextTile ?
                    <svg x={this.state.contextTile.col*10} y={this.state.contextTile.row*10} width="10" height="10" viewBox="0 0 100 100"
                    style={{pointerEvents: 'none'}}>
                        {this.state.hover == 'target' ? 
                        <use xlinkHref={`#${Object.values(this.state.airplanes).length < 3 ? '' : 'no-'}target`}></use> : null}
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
        this.has = 'A'
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