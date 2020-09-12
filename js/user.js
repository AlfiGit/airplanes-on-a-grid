import firebase from './fire.js';
import { status } from './utils.jsx'

let _user = {}

export let user = {
    get() { return _user },
    set(obj) { Object.assign(_user, obj) }
}

export function initUser() {
    _user = {
        isPlaying: false,
        isPlayer1: null,
        gameId: null,
        dbGame: null,
        get dbKey() { return this.isPlayer1 ? 'player1Status' : 'player2Status' }
    }
    // open dialog
	window.onbeforeunload = e => {
        if(_user.isPlaying) return '';
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
    user.set({isPlaying: true, isPlayer1, gameId, dbGame: gamesRef.child(gameId), initialPartnerStatus: partnerStatus })
    setupChannels(gamesRef.child(gameId))
}

function setupChannels(game) {
    let n = _user.isPlayer1 ? 2 : 1
    game.child(`player${3-n}Status`).on('value', snap => _user.gameComponent?.onOwnStatusChanged(snap.val()))
    game.child(`player${n}Status`).on('value', snap => _user.gameComponent?.onPartnerStatusChanged(snap.val()))
    game.child('question').on('value', snap => _user.gameComponent?.onQuestion(snap.val()))
    game.child('answer').on('value', snap => _user.gameComponent?.onAnswer(snap.val()))
}

export function dbSet(changes, dbGame) {
    if(!dbGame) dbGame = _user.dbGame
    for(let prop of Object.keys(changes)) dbGame.child(prop).set(changes[prop]) 
}

export async function abortGame() {
    if(_user.isPlaying) {
        fetch(`https://airplanes-on-a-grid.firebaseio.com/Games/${_user.gameId}.json`, {
            method: 'DELETE',
            keepalive: true
        })
    }
}