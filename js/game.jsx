import React from 'react';
import '../public/css/game.css'
import { status } from './utils.jsx'
import GameDefs from './defs.jsx';

export default class GamePage extends React.Component {
    constructor(props) {
        super(props)
        app.gameComponent = this
        this.state = { ownStatus: status.PLACING, partnerStatus: app.user.partnerStatus }
    }
    startGame() {
        app.user.dbGame.set({ [app.user.isPlayer1 ? 'player1Status' : 'player2Status']: status.READY })
        this.setState({ ownStatus: status.READY })
    }
    render() {
        return <React.Fragment>
            <div style={{width: "100%", height: "auto"}}>
                <GamePanel player={1} playerStatus={this.state.ownStatus} onGameStart={e=>this.startGame()} />
                <GamePanel player={2} playerStatus={this.state.partnerStatus} />
            </div>
        </React.Fragment>
    }
}

class GamePanel extends React.Component {
    constructor(props) {
        super(props)
        let active = this.props.player == 1 || this.props.playerStatus > status.PLACING
        this.state = { active, hover: null, contextTile: null, airplanes: {}, outlineOn: null,
        selected: null, moving: null, gameStarted: false, hits: null }
        this.tilemap = Array(10).fill(0).map(row => Array(10).fill(0).map(col => React.createRef()))
        this.toolbar = React.createRef()
        this.key_root = 1
    }
    tool(L) {
        let toolbar = this.toolbar.current
        toolbar.setState({ tool: L })
        this.setState({ selected: null, outlineOn: null, moving: null, hover: null })
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
        if(this.activeTool == 'M' && !this.state.moving) {
            let tile = this.tilemap[position.row][position.col].current
            if(tile.has == 'H' || tile.has == 'B') {
                this.setState({ outlineOn: hoverIn ? {key: tile.akey, color: 'gold'} : null })
            }
        }
        if(this.activeTool == 'M' && this.state.moving) {
            this.setState({ hover: (hoverIn ? 'airplane' : null), contextTile: position })
        }
    }
    clickTile(row, col) {
        if(this.activeTool == 'A') {
            let nrAirplanes = Object.values(this.state.airplanes).length
            if(nrAirplanes < 3) {
                let key = this.key_root++
                let added = [0,90,-90,180].some(r => this.addAirplane({row, col, r}, key))
                if(added) {
                    this.activeTool = 'r'
                    this.setState({ hover: null, outlineOn: {key, color: 'blue'}, selected: key })
                    this.toolbar.current.setState({ tool: 'R' })
                }
            }
        }
        if(this.activeTool == 'X') {
            let tile = this.tilemap[row][col].current
            if(tile.has == 'H' || tile.has == 'B') this.removeAirplane(tile.akey)
        }
        if(this.activeTool == 'R' && !this.state.selected) {
            let tile = this.tilemap[row][col].current
            if(tile.has == 'H' || tile.has == 'B') this.setState({ selected: tile.akey })
        }
        if(this.activeTool == 'M') {
            let tile = this.tilemap[row][col].current
            if(!this.state.moving && (tile.has == 'H' || tile.has == 'B')) {
                let a = this.state.airplanes[tile.akey]
                let translate = [row - a.row, col - a.col]
                this.setState({ moving: {key: tile.akey, r: this.state.airplanes[tile.akey].r, translate }, 
                hover: 'airplane', contextTile: {row, col} })
                this.removeAirplane(tile.akey)
            } else if(this.state.moving) {
                let t = this.state.moving.translate
                let added = this.addAirplane({ row: row - t[0], col: col - t[1], r: this.state.moving.r }, this.state.moving.key)
                if(added) this.setState({ moving: null, hover: null, contextTile: null })
            }
        }
    }
    addAirplane(a, key) {
        let nrAirplanes = Object.values(this.state.airplanes).length
        if(!this.check(a)) return false
        let airplanes = {...this.state.airplanes}
        airplanes[key] = a
        this.setState({ airplanes }) 
        this.registerAirplane(a, key)
        this.toolbar.current.setState({ finished: (nrAirplanes == 2) })
        return true
    }
    removeAirplane(key) {
        let airplanes = {...this.state.airplanes}
        let deletedAirplane = airplanes[key]
        delete airplanes[key]
        this.setState({ outlineOn: null, airplanes })
        this.registerAirplane(deletedAirplane, key, false)
        this.toolbar.current.setState({ finished: false })
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
        if(this.activeTool == 'r') {
            this.toolbar.current.setState({ tool: 'A' })
            this.activeTool = 'A'
        }
        this.setState({ outlineOn: null, selected: null })
    }
    check(a, ignoreKey = 0) {
        let shape = [[0,0], [0,1], [-1,1], [-2,1], [1,1], [2,1], [0,2], [0,3], [-1,3], [1,3]]
        let cos = r => r == 0 ? 1 : r == 90 ? 0 : r == -90 ? 0 : r == 180 ? -1 : null
        let sin = r => r == 0 ? 0 : r == 90 ? 1 : r == -90 ? -1 : r == 180 ? 0 : null
        let rmatrix = (x, y, r) => [x * cos(r) - y * sin(r), y * cos(r) + x * sin(r)]
        return shape.every(([dx, dy]) => {
            [dx, dy] = rmatrix(dx, dy, a.r)
            if(0 <= a.row + dy && a.row + dy < 10 && 0 <= a.col + dx && a.col + dx < 10) {
                let tile = this.tilemap[a.row + dy][a.col + dx].current
                if((tile.has == 'H' || tile.has == 'B') && tile.akey != ignoreKey) return false
            } else return false
            return true
        })
    }
    checkRotation(key, angle) {
        return this.check({...this.state.airplanes[key], r: angle}, key)
    }
    startGame() {
        this.setState({ gameStarted: true })
        this.props.onGameStart()
    }
    render() {
        let array = []
        if(this.state.active) array = Array(10).fill(0)
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
                    {/* rotate gui */}
                    {this.state.selected ? (a => {
                        let arr = [-90, 0, 90, 180]
                        let reverse = [90, 180, -90, 0]
                        return <>
                          {arr.map((angle, i) => (canRotate => <use xlinkHref="#circle-btn" key={angle} 
                          onClick={canRotate ? e=>this.rotateAirplane(this.state.selected, reverse[i]) : null}
                          transform={`translate(${a.col * 10 + 5} ${a.row * 10 + 5}) rotate(${angle})`} 
                          className={a.r != reverse[i] && canRotate ? 'blue-btn' : 'grey-btn'}></use>)
                          (this.checkRotation(this.state.selected, reverse[i])))}
                          <g onClick={this.rotateOk.bind(this)}>
                            <circle cx={a.col * 10 + 5} cy={a.row * 10 + 5} r="3" className="green-btn" />
                            <path d="M-2 0 L0 2 L3 -4" stroke="white" fill="none" strokeWidth="0.5" 
                            transform={`translate(${a.col * 10 + 5} ${a.row * 10 + 5})`} style={{pointerEvents: 'none'}}/>
                          </g>
                        </>
                    })(this.state.airplanes[this.state.selected]) : null}
                    {/* context tile: target etc. */}
                    {this.state.contextTile ?
                        this.state.hover == 'target' ?
                            <svg x={this.state.contextTile.col*10} y={this.state.contextTile.row*10} width="10" height="10" 
                            viewBox="0 0 100 100" style={{pointerEvents: 'none'}}>
                                {(this.activeTool == 'A' && Object.values(this.state.airplanes).length < 3) ?
                                <use xlinkHref="#target"></use> : <use xlinkHref="#no-target"></use>}
                            </svg> : 
                        this.state.hover =='airplane' ? 
                            ((c,m) => (a => <use xlinkHref="#airplane" fill={this.check(a) ? '#fffa' : '#fbba'} stroke="#000a" 
                            strokeWidth="0.5" transform={`translate(${a.col*10+5} ${a.row*10+5}) rotate(${a.r})`}></use>)
                            ({row: c.row - m.translate[0], col: c.col - m.translate[1], r: m.r}))
                            (this.state.contextTile, this.state.moving) : null 
                    : null}
                </svg>
                {/* messages */}
                {this.props.player == 2 ?
                    <div className="game-messages">
                        {this.props.playerStatus == status.NOT_ENTERED ? <div className="message">
                            <span lang="en">Waiting for partner to join...</span>
                            <span lang="ro">Se asteapta alaturarea partenerului...</span>
                        </div> : null}
                        {this.props.playerStatus == status.PLACING ? <div className="message">
                            <span lang="en">Your game partner is placing the airplanes...</span>
                            <span lang="ro">Partenerul de joc isi asaza acum avioanele...</span>
                        </div> : null}
                    </div>
                : null}
                {(this.props.player == 1 && !this.state.gameStarted) ? 
                  <GameTools ref={this.toolbar} tool={this.tool.bind(this)} startGame={e=>this.startGame()} player={1}></GameTools>
                :(this.props.player == 2 && this.state.gameStarted)  ?
                  <GameTools ref={this.toolbar} tool={this.tool.bind(this)} player={2}></GameTools>
                : null}
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
            {this.props.player == 2 ??
            <div className={"g-tool H" + (this.state.tool == 'H' ? " active " : "")} onClick={e=>this.props.tool('H')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#hit"></use></svg></div>
            
            }
            <div className={"g-tool A" + (this.state.tool == 'A' ? " active" : "")} onClick={e=>this.props.tool('A')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#add"></use></svg></div>
            <div className={"g-tool X" + (this.state.tool == 'X' ? " active" : "")} onClick={e=>this.props.tool('X')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#cross"></use></svg></div>
            <div className={"g-tool R" + (this.state.tool == 'R' ? " active" : "")} onClick={e=>this.props.tool('R')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#rotate"></use></svg></div>
            <div className={"g-tool M" + (this.state.tool == 'M' ? " active" : "")} onClick={e=>this.props.tool('M')}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#move"></use></svg></div>
            <div className={"g-tool ok" + (this.state.finished ? " active " : "")} onClick={e=>this.props.startGame()}>
                <svg viewBox="0 0 100 100"><use xlinkHref="#play"></use></svg>
            </div>
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