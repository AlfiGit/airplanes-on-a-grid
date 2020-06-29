import React from 'react'

export function Note({bg, border, children}) {
	return <div class="expandable-note" style={{
		backgroundColor: bg,
		borderColor: border
	}}>{children}</div>
}

export function Font({size, family="Arial", fstyle="normal", children, style, ...props}) {
	return <div style={{
		fontSize: size,
		fontStyle: fstyle,
		fontFamily: family,
		...style
	}} {...props}>{children}</div>
}

export function randomId() {
	let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
	let uniqid = randLetter + Date.now()
	for(let i = 0; i < 7; ++i) {
		let index = Math.floor(Math.random() * 12)
		uniqid.replaceAt(index, String.fromCharCode(65 + Math.random(Math.random() * 26)))
	}
	return uniqid
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}