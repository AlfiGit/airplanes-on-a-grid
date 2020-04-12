const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000

express.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile('index.html')
})
app.listen(PORT, err => {
	if(err) console.log(err)
	else console.log(`Server listening on port ${PORT}`)
})