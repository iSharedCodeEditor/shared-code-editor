const sharedEditor = {
    debug:false,
    listenEditor: function (editor, endpoint) {

        const socket = new WebSocket(`ws://${endpoint}`);

        socket.addEventListener('message', function (msg) {
            const data = JSON.parse(msg.data);
            if(sharedEditor.debug){
                console.log("data received: "+ data);
            }
            editor.applyChange(data);
        });

        editor.session.on('change', function (delta) {
            if (editor.curOp && editor.curOp.command.name){
                if (sharedEditor.debug){
                    console.log("change by current user", delta);
                    console.log(delta.start, delta.end, delta.lines, delta.action);
                }
                socket.send(JSON.stringify(delta));
            } else {
                if (sharedEditor.debug){
                    console.log("change by other user", delta);
                }
            }
        });
    },
    applyChange(data){
        if (data.action === 'insert') {
            let dataStr = ""
            for (let i in 0..data.lines.size) {
                dataStr += data.lines[0]
                dataStr += '\n'
            }
            editor.session.insert(data.start, dataStr)
        } else if (data.action === 'remove') {
            editor.session.replace(new ace.Range(data.start.row, data.start.column, data.end.row, data.end.column), "");
        }
    }
};
