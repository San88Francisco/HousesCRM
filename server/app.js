const express = require('express')
const bodyParser = require('body-parser')


const allApartments = require('./routes/all-apartments')

const app = express()

app.use(allApartments)

app.listen(5000)