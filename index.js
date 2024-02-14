const express = require('express')
const app = express()
const port = 3000
const https = require("node:https")
const http = require("node:http")

let serversPoolPorts = []
let initialPorts = [4000,4001,4002]

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

checkAvailableServers(initialPorts)

function checkAvailableServers(serverPorts) {
    for (const serverPort of serverPorts) {
        healthCheck(serverPort,(status)=> {
            if (status.ok && !serversPoolPorts.find((port)=> port === serverPort)) {
                console.log(`Server under port: ${serverPort} is ready -  Adding to pool of available servers.`)
                serversPoolPorts.push(serverPort)
            }else if (!status.ok && serversPoolPorts.find((port)=> port === serverPort)) {
                console.log(`Server under port: ${serverPort} is not responding - Removing from pool of available servers.`)
                serversPoolPorts = serversPoolPorts.filter((port)=> port !== serverPort)
            }
        })
    }
}

function healthCheck(serverPort, callback) {
    http.get(`http://localhost:${serverPort}/health`, (res)=> {
        const { statusCode } = res;
        if (statusCode !== 200) {
            callback({ok: true})
            console.log(`Health check failed for server under port ${serverPort} - Removing from pool of available servers.`)
            serversPoolPorts = serversPoolPorts.filter((port)=> port === serverPort)
        }
        callback({ok: true})
    })
}

setInterval(()=> {
    checkAvailableServers(serversPoolPorts)
}, 5000)

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