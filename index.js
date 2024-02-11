const express = require('express')
const app = express()
const port = 3000
const https = require("node:https")
const http = require("node:http")

const serversPoolPorts = [4000,4001,4002]

function getRandomServerNo() {
    return Math.floor(Math.random() * 3);
}

function getServerNum() {
    return roundRobinAlgorithm()
}

let i = 0;
function roundRobinAlgorithm() {
    const serversCount = serversPoolPorts.length;
    const currentServerNo = i % serversCount;
    i++
    return currentServerNo

}

app.get('*', (req, res) => {
    console.log("Load balancer received request: ",req.method, req.url )

    const agent = req.protocol === 'http'? http : https
    agent.request({
        port: serversPoolPorts[getServerNum()],
        hostname: 'localhost',
        path: req.path,
        method: req.method,
        protocol: req.protocol+":"
    }, (targetRes)=> {
        console.log('Passing response to a client.')
        res.writeHead(targetRes.statusCode, targetRes.headers)
        targetRes.pipe(res)
    }).end();
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})