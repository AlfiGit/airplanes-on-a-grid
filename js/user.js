import firebase from './fire.js';
import { status } from './utils.jsx'

export function initUser() {
    window.app.user = {
        isPlaying: false,
        isPlayer1: null,
        gameId: null,
        dbGame: null
    }
    // open dialog
	window.onbeforeunload = e => {
        if(app.user.isPlaying) return '';
        return;
    }
    window.onunload = abortGame
}

export async function publicGame() {
    let db = firebase.database()
    let gamesRef = db.ref('/Games')
    let gameId, isPlayer1, partnerStatus;
    let newGames = (await gamesRef.orderByChild("status").equalTo("public new").once('value')).val() || {}
    let countNew = Object.keys(newGames).length
    if(countNew != 0) { // there are new games waitng: join one as the 2nd player
        let random = Math.floor(Math.random() * countNew), game
        gameId = Object.keys(newGames)[random]
        game = gamesRef.child(gameId)

        isPlayer1 = false;
        partnerStatus = game.player1Status
        dbSet({
            status: 'public active',
            player2Status: status.PLACING,
            player1Turn: true,
            question: null,
            answer: null
        }, gamesRef.child(gameId))
    } else { // create a new game as the 1st player
        gameId = db.ref('/Games').push({
            status: 'public new',
            player1Status: status.PLACING,
            player2Status: status.NOT_ENTERED
        }).key 
        isPlayer1 = true;
        partnerStatus = status.NOT_ENTERED
    }
    Object.assign(app.user, {isPlaying: true, isPlayer1, gameId, dbGame: gamesRef.child(gameId) })
    setupChannels(gamesRef.child(gameId))
    return {gameId, isPlayer1, partnerStatus}
}

function setupChannels(game) {
    //game.child('state').on('value', snap => onGameStateChanged(snap.val()))
    let n = app.user.isPlayer1 ? 2 : 1
    game.child(`player${n}Status`).on('value', snap => app.gameComponent?.setState({ partnerStatus: snap.val() }))
    //game.child('question').on('value', snap => onQuestion(snap.val))
}
function onGameStateChanged(state) {
    alert("Game state changed")
    if(state == 'full' && app.user.isPlayer1) {
        alert("Player2 Joined")
        app.gameComponent.setState({ partnerStatus: status.PLACING })
    } else if(state == 'aborted') {

    }
}
export function dbSet(changes, dbGame) {
    if(!dbGame) dbGame = app.user.dbGame
    for(let prop of Object.keys(changes)) dbGame.child(prop).set(changes[prop]) 
}
function onQuestion(q) {}
function onAnswer(a) {}

export async function abortGame() {
    if(app.user.isPlaying) {
        fetch(`https://airplanes-on-a-grid.firebaseio.com/Games/${app.user.gameId}.json`, {
            method: 'DELETE',
            keepalive: true
        })
    }
}