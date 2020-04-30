const nameFor = { ro: "Română", en: "English" }

var displayed, langDrop, selected

window.addEventListener('load',function() {
  displayed = document.querySelector("#displayed-lang")
  langDrop = document.querySelector("#languages")
  selected = document.querySelector("button.selected-lang")

  displayed.addEventListener('click', e => dropdownLang())
  displayed.addEventListener('blur', langBlur)
  document.querySelectorAll("button.lang").forEach(btn => {
  	btn.addEventListener('click', function(e) {
  		langShort = this.getAttribute("data-lang")
  		changeLang(langShort, this)
  	})
  	btn.addEventListener('blur', langBlur)
  })
})

function changeLang(lang, btn) { 
	document.body.className = lang
	window.displayed.innerHTML = nameFor[lang]
	window.selected.classList.remove("selected-lang")
	btn.classList.add("selected-lang")
	window.selected = btn
	dropdownLang(false)
}

function dropdownLang(open) {
	open = open != undefined ? open : langDrop.hidden
	langDrop.hidden = !open
	if(open) selected.focus()
}

function langBlur(e) {
	if(e.relatedTarget?.classList.contains("lang") || e.relatedTarget == displayed) return;
	dropdownLang(false)
}

