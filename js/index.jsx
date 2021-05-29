//import 'react-hot-loader/patch'
import React from 'react'
import {render} from 'react-dom'
//import {AppContainer} from 'react-hot-loader';
import App from './app.jsx';

/*/*window.addEventListener('load', e => {
	const root = document.querySelector('#root')
	const pathname = window.location.pathname
	let urlParams, props, Page, lang
    if(!window.URLSearchParams) {
        alert("This browser does not offer well support for this website. We recommend using Chrome or Edge")
        // TO DO: Add alternative method of finding url params
    } else {
		urlParams = new URLSearchParams(window.location.search)
		lang = urlParams.get('lang') || 'en'
		props = { lang }
	}
	
	if(pathname == '/about' || pathname == '/') {
	 	Page = AboutPage
	} else if(pathname == '/game') {
	  	Page = GamePage
	  	Object.assign(props, { gameId: urlParams.get('gameId') })
	} else if(pathname == '/how-to-play') {
		Page = HowToPlayPage
	}

	render(<Page {...props}/>, root)
	initUser()
}) *-/*/
const hotRender = Component => render(
	//<AppContainer>
		<Component />,
	//</AppContainer>,
	document.querySelector('#root')
)
hotRender(App)

/*if(module.hot) {
	module.hot.accept('./app.jsx', () => {
		let NewApp = require('./app.jsx').default
		hotRender(NewApp)
	})
}*/