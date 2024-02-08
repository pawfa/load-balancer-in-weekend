const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const app2 = express()
const port2 = 4001
app2.get('/', (req, res) => {
    res.send('Hello World2!')
})

app2.listen(port2, () => {
    console.log(`Example app listening on port ${port2}`)
})

const app3 = express()
const port3 = 4002
app3.get('/', (req, res) => {
    res.send('Hello World3!')
})

app2.listen(port3, () => {
    console.log(`Example app listening on port ${port3}`)
})