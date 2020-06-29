import React from 'react'
import firebase from './fire.js'

const nameFor = {en: "English", ro: "Română"}

export default class Navbar extends React.Component {
	constructor() {
		super()
		this.state = { lang: {} }
	}
	componentDidMount() {
		this.state.lang.displayed = document.querySelector("#displayed-lang")
		this.state.lang.langDrop = document.querySelector("#languages")
		this.state.lang.selected = document.querySelector(`button.lang[data-lang="${this.props.lang}"]`)
		this.state.lang.displayed.addEventListener('blur', e => this.langBlur(e))
		this.state.lang.short = this.props.lang
		document.body.className = this.props.lang
	}
	render() {
		return (
		<nav>
			<div id="changeLangBtn" className="nav-container">
				<button id="displayed-lang" className="nav-btn" onClick={()=>this.dropdownLang()}>{nameFor[this.props.lang]}</button>
				<div id="languages" hidden={true}>
					<button data-lang="en" className="lang"
					onClick={e=>this.langClick(e)} onBlur={e=>this.langBlur(e)}>English</button>
					<button data-lang="ro" className="lang"
					onClick={e=>this.langClick(e)} onBlur={e=>this.langBlur(e)}>Română</button>
				</div>
			</div> 
			<div id="private-game" className="nav-container">
				<button className="nav-btn" onClick={() => this.navigate('private-join')}>
					<span lang="en">Private Game</span>
					<span lang="ro">Joc Privat</span>
				</button>
			</div>
			<div id="public-game" className="nav-container">
				<button className="nav-btn" onClick={() => this.publicGame()}>
					<span lang="en">Public Game</span>
					<span lang="ro">Joc Public</span>
				</button>
			</div>
			<div id="rules" className="nav-container">
				<button className="nav-btn" onClick={() => this.navigate('how-to-play')}>
					<span lang="en">How to play</span>
					<span lang="ro">Cum se joaca</span>
				</button>
			</div>
			<div id="about" className="nav-container">
				<button className="nav-btn" onClick={() => this.navigate('about')}>
					<span lang="en">About</span>
					<span lang="ro">Despre</span>
				</button>
			</div>
		</nav>)
	}
	langClick(e) {
		let langShort = e.target.getAttribute("data-lang")
		this.changeLang(langShort, e.target)
	}
	changeLang(lang, btn) { 
		document.body.className = lang
		this.state.lang.short = lang
		this.state.lang.displayed.innerHTML = nameFor[lang]
		this.state.lang.selected.classList.remove("selected-lang")
		btn.classList.add("selected-lang")
		this.state.lang.selected = btn
		this.dropdownLang(false)
	}
	dropdownLang(open) {
		open = open != undefined ? open : this.state.lang.langDrop.hidden
		this.state.lang.langDrop.hidden = !open
		if(open) this.state.lang.selected.focus()
	}
	langBlur(e) {
		if(e.relatedTarget?.classList.contains("lang") || e.relatedTarget == this.state.lang.displayed) return;
		this.dropdownLang(false)
	}

	async publicGame() {
		this.navigate('hold-on')
		let db = firebase.database()
		let newGamesRef = db.ref('/New Games')
		let activeGamesRef = db.ref('/Active Games')
		let countRef = newGamesRef.child('count')
		let count = (await countRef.once('value')).val()
		let gameId, isPlayer1;
		if(count != 0) {
			let random = Math.floor(Math.random() * count)
			let query = await db.ref('/New Games').orderByChild('id').startAt(random).endAt(random).once('value')
			let game = query.val()
			gameId = Object.keys(game)[0]
			game = game[gameId]
			console.log(game)

			game.state = 'full'
			newGamesRef.child(gameId).remove()
			isPlayer1 = false;
			activeGamesRef.child(gameId).set({
				player1Turn: true,
				question: null,
				answer: null
			})
			let activeCountRef = activeGamesRef.child('count')
			let activeCount = (await activeCountRef.once('value')).val()
			activeCountRef.set(activeCount + 1)
			count = (await countRef.once('value')).val()
			countRef.set(count - 1)
		} else {
			gameId = db.ref('/New Games').push({
				public: true,
				state: 'waiting',
				id: count
			}).key 
			countRef.set(count + 1)
			isPlayer1 = true;
		}
		this.navigate('game', {gameId, isPlayer1})
	}

	navigate(page, queries) {
		app.setState({ page, queries })
	}
}