const express = require('express')
const app = express()

const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const compiler = webpack(webpackConfig)
const webpackdev = require("webpack-dev-middleware")
const webpackhot = require("webpack-hot-middleware")

app.use(webpackdev(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath, hot: true
}))
app.use(webpackhot(compiler));

app.use(express.static('public'))
const serveIndex = (_req, res) => res.sendFile(__dirname + '/public/index.html')
app.get('/', serveIndex)
app.get('/about', serveIndex)
app.get('/game', serveIndex)
app.get('/how-to-play', serveIndex)

app.get('*', (_req, res) => {
    res.sendFile(__dirname + '/public/404.html')
})
app.listen(5000, err => {
    if(err) console.log(err)
    else console.log("Local Server listening on Port 5000")
})
