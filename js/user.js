import firebase from './fire.js';

export function initUser() {
    window.app.user = {
		isPlaying: false,
		partnerHasJoined: false,
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