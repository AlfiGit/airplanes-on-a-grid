const express = require("express")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 3000

const ejsview = (url, filename=url) => ['/'+url, (req, res) => {
	res.render(filename + '.ejs')
}]

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs')
})
app.get(...ejsview('notice'))

app.listen(PORT, err => {
	if(err) console.log(err)
	else console.log(`Server listening on port ${PORT}`)
})