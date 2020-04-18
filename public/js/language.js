const nameFor = { ro: "Română", en: "English" }
var langDrop, selected
window.onload = function() {
	langDrop = document.querySelector("#languages")
  selected = document.querySelector("#selected-lang")
}

function changeLang(lang) { 
	document.body.className = lang
	window.selected.innerHTML = nameFor[lang]
	langDrop.hidden = true
}

function dropdownLang(open) {
	open = open != undefined ? open : langDrop.hidden
	langDrop.hidden = !open
}