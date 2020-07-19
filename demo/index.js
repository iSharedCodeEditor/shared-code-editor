const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4200 });
var text = 'Hello world';

wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify({
        start:{row:0, col:0},
        end:{row:0, col:0},
        action:"insert",
        lines: [text]
    }));
    ws.on('message', function incoming(data) {
        console.log(data);
        dataObj = JSON.parse(data);
        if(dataObj.hasOwnProperty('getText')){
            text = dataObj['getText']
        } else {
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        }
    });
    setInterval( ()=>{
        ws.send(JSON.stringify({getText:""}))
    }, 1000)
});
