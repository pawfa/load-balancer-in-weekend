const express = require('express')
const app = express()
const port = 4000

app.get('*', (req, res) => {
    console.log(`Sending response from Server 1`)
    res.setHeader('X-Response-From', '1')
    res.send('Hello World1!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const app2 = express()
const port2 = 4001
app2.get('*', (req, res) => {
    console.log(`Sending response from Server 2`)
    res.setHeader('X-Response-From', '2')
    res.send('Hello World2!')
})

app2.listen(port2, () => {
    console.log(`Example app listening on port ${port2}`)
})

const app3 = express()
const port3 = 4002
app3.get('*', (req, res) => {
    console.log(`Sending response from Server 3`)
    res.setHeader('X-Response-From', '3')
    res.send('Hello World3!')
})

app3.listen(port3, () => {
    console.log(`Example app listening on port ${port3}`)
})