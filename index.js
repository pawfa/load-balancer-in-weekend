const express = require('express')
const app = express()
const port = 3000
const https = require("node:https")
const http = require("node:http")

const serversPoolPorts = [4000,4001,4002]

function getRandomServerNo() {
    return Math.floor(Math.random() * 3);
}

app.get('/', (req, res) => {
    const randomServerPort = serversPoolPorts[getRandomServerNo()]
    const agent = req.protocol === 'http'? http : https
    console.log("Received request")
    agent.request({
        port: randomServerPort,
        hostname: 'localhost',
        path: "/",
        method: "GET",
        protocol: "http:"
    }, (targetRes)=> {
        console.log('response from target')
        res.send('Hello World!')
    }).on('error', (e) => {
        console.error(e);
    }).end();
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})