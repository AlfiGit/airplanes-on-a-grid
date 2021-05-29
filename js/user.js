import firebase from './fire.js';
import { status } from './utils.jsx'

let _user = {}

export let user = {
    get() { return _user },
    set(obj) { Object.assign(_user, obj) },
    reinit() { _init_user() }
}

function _init_user() {
    let id = _user.authId
    _user = {
        isPlaying: false,
        isPlayer1: null,
        gameId: null,
        temporaryGameId: null,
        dbGame: null,
        get dbKey() { return this.isPlayer1 ? 'player1Status' : 'player2Status' },
        db: firebase.database(),
        authId: id
    }
}
export function initUser() {
    _init_user()
    firebase.auth().signInAnonymously().then(credentials => {
        credentials.user.getIdToken().then(id => _user.authId = id)
    })
    // open dialog
	window.onbeforeunload = () => { abortGame(); }
    window.onunload = abortGame
    if(window.chrome && chrome.app.window) chrome.app.window.current().onClosed = abortGame 
}

function createGame(publicc) {
    return _user.db.ref('/Games').push({
        status: (publicc ? 'public' : 'private') + ' new',
        player1Status: status.PLACING,
        player2Status: status.NOT_ENTERED
    })
}

export function privateGame() {
    let db = _user.db
    let game = createGame(false, db)
    user.set({ isPlaying: true, isPlayer1: true, gameId: game.key, dbGame: game, initialPartnerStatus: -1 })
    // status -1 : UNINVITED
    setupChannels(game)
    return game
}

export async function joinPrivateGame(code) {
    let db = _user.db
    let game = db.ref("Games").child(code)
    let i = (await game.once('value')).val().player1Status
    user.set({ isPlaying: true, isPlayer1: false, gameId: code, dbGame: game, initialPartnerStatus: i })
    setupChannels(game)
    dbSet({ status: 'private active', player2Status: status.PLACING, player1Turn: true, question: null, answer: null })
    app.setState({ page: 'game' })
}

export async function publicGame() {
    let db = _user.db
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
        gameId = createGame(true, db).key
        isPlayer1 = true;
        partnerStatus = status.NOT_ENTERED
    }
    user.set({ isPlayer1, gameId, dbGame: gamesRef.child(gameId), initialPartnerStatus: partnerStatus })
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

// never use detachListeners after reinitializing the user object
export function detachListeners() {
    /** @type{firebase.database.Reference} */
    let game = _user.dbGame
    //game.child("player1Status")
    /** TO DO */
}

export async function abortGame() {
    let id = _user.gameId
    if(_user.isPlaying) {
        fetch(`https://airplanes-on-a-grid.firebaseio.com/Games/${id}.json?auth=${_user.authId}`, {
            method: 'DELETE',
            keepalive: true
        })
    }
    // detachListeners()
    user.reinit()
}