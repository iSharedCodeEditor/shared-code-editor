const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4200 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        console.log(data);
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                dataObj = JSON.parse(data);
                dataObj.timestamp = new Date().getTime();
                data = JSON.stringify(dataObj);
                client.send(data);
            }
        });
    });
});
