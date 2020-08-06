import firebase from './fire.js';
import { status } from './utils.jsx'

export function initUser() {
    window.app.user = {
        isPlaying: false,
        isPlayer1: null,
		partnerHasJoined: null,
		gameId: null
	}
	window.onbeforeunload = e => {
		if(app.user.isPlaying) {
            abortGame()
            let message = "You are about to leave this page"
            e = e || window.event
            if(e) e.returnValue = message
            return message
        }
	}
}

export async function publicGame() {
    let db = firebase.database()
    let gamesRef = db.ref('/Games')
    let countNewRef = gamesRef.child('countNew')
    let countActiveRef = gamesRef.child('countActive')
    let countNew = (await countNewRef.once('value')).val()
    let gameId, isPlayer1, partnerStatus;
    if(countNew != 0) { // there are new games waitng: join one as the 2nd player
        let random = Math.floor(Math.random() * countNew)
        let query = await gamesRef.orderByChild('id').startAt(random).endAt(random).once('value')
        let game = query.val()

        gameId = Object.keys(game)[0]
        game = game[gameId]

        isPlayer1 = false;
        partnerStatus = game.player1Status
        gamesRef.child(gameId).set({
            state: 'full',
            player2Status: status.PLACING,
            player1Turn: true,
            question: null,
            answer: null
        })
        // increment active count
        let countActive = (await countActiveRef.once('value')).val()
        countActiveRef.set(countActive + 1)
        // decrement new count
        countNew = (await countNewRef.once('value')).val()
        countNewRef.set(countNew - 1)
    } else { // create a new game as the 1st player
        gameId = db.ref('/Games').push({
            public: true,
            state: 'waiting',
            id: countNew,
            player1Status: status.PLACING,
            player2Status: status.NOT_ENTERED
        }).key 
        countNewRef.set(countNew + 1)
        isPlayer1 = true;
        partnerStatus = status.NOT_ENTERED
    }
    Object.assign(app.user, {playing: true, gameId, isPlayer1, partnerStatus, dbGame: gamesRef.child(gameId) })
    setupChannels(gamesRef.child(gameId))
}

function setupChannels(game) {
    game.child('state').on('value', snap => onGameStateChanged(snap.val()))
    game.child('question').on('value', snap => onQuestion(snap.val))
}
function onGameStateChanged(state) {
    if(state == 'full' && app.user.isPlayer1) {
        //alert("Player2 Joined")
        app.gameComponent.setState({ partnerStatus: status.PLACING })
    } else if(state == 'aborted') {

    }
}
function sendToDatabase(changes) { app.user.dbGame.set(changes) }
function onQuestion(q) {}
function onAnswer(a) {}

export function abortGame() {
    let db = firebase.database()
    if(window.user.partnerHasJoined); // abort active game
    else {
        console.log(app.user.gameId)
        let ngref = db.ref('New Games')
        ngref.child(app.user.gameId).remove()
        let countref = ngref.child('count')
        countref.once('value', snap => {
            countref.set(snap.val() - 1)
        })
    }
}