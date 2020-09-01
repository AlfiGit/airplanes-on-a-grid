import React from 'react';
import Navbar from './navbar.jsx';
import AboutPage from './about.jsx';
import GamePage from './game.jsx'
import HowToPlayPage from './howtoplay.jsx'
import HoldOnPage from './holdon.jsx';
import {initUser} from './user.js';

export default class App extends React.Component {
    constructor() {
        super()
        this.state = { queries: {}, data: {} }

        const pathname = window.location.pathname
        let urlParams, lang
        if(!window.URLSearchParams) {
            alert("This browser does not offer well support for this website. We recommend using Chrome, Edge or Opera")
            // TO DO: Add alternative method of finding url params
        } else {
            urlParams = new URLSearchParams(window.location.search)
            lang = urlParams.get('lang') || 'en'
        }
        
        if(pathname == '/about' || pathname == '/') this.state.page = 'about'
        else if(pathname == '/game') {
            this.state.page = 'game'
            Object.assign(this.state.queries, { gameId: urlParams.get('gameId') })
        } else if(pathname == '/how-to-play') this.state.page = 'how-to-play'

        this.state.lang = lang
    }
    componentDidMount() {
        window.app = this
        initUser()
    }
    render() {
        let Page;
        if(this.state.page == 'about') Page = AboutPage
        else if(this.state.page == 'game') Page = GamePage
        else if(this.state.page == 'how-to-play') Page = HowToPlayPage
        else if(this.state.page == 'hold-on') Page = HoldOnPage
        return <React.Fragment>
            <Navbar lang={this.state.lang} />
            <Page {...this.state.data}/>
        </React.Fragment>
    }
}