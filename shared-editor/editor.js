const sharedEditor = {
    debug: false,
    listenEditor: function (editor, endpoint) {

        const socket = new WebSocket(`ws://${endpoint}`);

        socket.addEventListener('message', function (msg) {
            const data = JSON.parse(msg.data);
            if (sharedEditor.debug) {
                console.log("data received: " + data);
            }
            sharedEditor.applyChange(data);
        });

        editor.session.on('change', function (delta) {
            if (editor.curOp && editor.curOp.command.name) {
                if (sharedEditor.debug) {
                    console.log("change by current user", delta);
                    console.log(delta.start, delta.end, delta.lines, delta.action);
                }
                socket.send(JSON.stringify(delta));
            } else {
                if (sharedEditor.debug) {
                    console.log("change by other user", delta);
                }
            }
        });
    },
    applyChange(data) {
        if (data.action === 'insert') {
            let dataStr = "";
            var i;
            for (i = 0; i < data.lines.length; i++) {
                dataStr += data.lines[i] + '\n';
            }
            dataStr = dataStr.substr(0, dataStr.length - 1);
            editor.session.insert(data.start, dataStr)
        } else if (data.action === 'remove') {
            editor.session.replace(new ace.Range(data.start.row, data.start.column, data.end.row, data.end.column), "");
        }
    }
};
