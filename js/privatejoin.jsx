import React from 'react';
import '../public/css/private.css'
import { user, privateGame, joinPrivateGame } from './user';

export default class PrivateJoinPage extends React.Component {
    constructor() {
        super()
        this.state = { join: false, code: '' }
    }
    componentDidMount() { user.reinit() }
    newGame() {
        let dbGame = privateGame()
        app.setState({ page: 'game' })
    }
    async joinGame() {
        joinPrivateGame(this.state.code)
    }
    setCode(e) {
        this.setState({ code: e.target.value })
    }
    render() {
        return <div className="private-container">
            <div className="start-new-container">
                <button className="start-new-btn" onClick={this.newGame.bind(this)}>New Private Game</button>
            </div>
            <div className="code-container">
                <div className="input-container">
                    <input className="code" value={this.state.code} onChange={this.setCode.bind(this)} />
                </div>
                <button className="go" onClick={this.joinGame.bind(this)}>Start Game</button>
            </div>
        </div>
    }
}