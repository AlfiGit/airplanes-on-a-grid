import firebase from './fire.js';

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
    let gameId, isPlayer1, partnerHasJoined;
    if(countNew != 0) { // there are new games waitng: join one as the 2nd player
        let random = Math.floor(Math.random() * countNew)
        let query = await gamesRef.orderByChild('id').startAt(random).endAt(random).once('value')
        let game = query.val()

        gameId = Object.keys(game)[0]
        game = game[gameId]

        isPlayer1 = false;
        partnerHasJoined = true;
        gamesRef.child(gameId).set({
            state: 'full',
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
            id: countNew
        }).key 
        countNewRef.set(countNew + 1)
        isPlayer1 = true;
        partnerHasJoined = false;
        //db.ref('Games/' + gameId + '/state').on('value', snap => onGameStateChanged(snap.val()))
    }
    Object.assign(app.user, {playing: true, gameId, isPlayer1, partnerHasJoined})
    setupChannels(gamesRef.child(gameId))
}

function setupChannels(game) {
    game.child('state').on('value', snap => onGameStateChanged(snap.val()))
    game.child('question').on('value', snap => onQuestion(snap.val))
}
function onGameStateChanged(state) {
    if(state == 'full' && app.user.isPlayer1) {
        //alert("Player2 Joined")
        app.gameComponent.setState({ player2Joined: true })
    } else if(state == 'aborted') {

    }
}
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