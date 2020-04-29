const express = require("express")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 3000

const ejsview = (url, filename=url, params) => ['/'+url, (req, res) => {
	Object.keys(params).map(key => params[key] = req.query[params[key]])
	res.render(filename + '.ejs', params)
}]
var language = "en"

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs')
})
app.get('/notice', (req, res) => {
	res.render('notice.ejs', {language: req.query.lang})
})
//app.get(...ejsview('notice', {language: 'lang'}))

app.listen(PORT, err => {
	if(err) console.log(err)
	else console.log(`Server listening on port ${PORT}`)
})