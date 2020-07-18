const sharedEditor = {
    listenEditor: function (editor, endpoint) {

        const socket = new WebSocket(`ws://${endpoint}`);

        socket.addEventListener('message', function (msg) {
            console.log("data is ");
            console.log(msg);
            const data = JSON.parse(msg.data);
            console.log(data);
            if (data.action === 'insert') {
                if (data.start.row !== data.end.row) {
                    editor.session.insert(data.start, '\n')
                } else {
                    editor.session.insert(data.start, data.lines[0])
                }
            } else if (data.action === 'remove') {
                editor.session.replace(new ace.Range(data.start.row, data.start.column, data.end.row, data.end.column), "");
            }
        });

        editor.session.on('change', function (delta) {
            socket.send(JSON.stringify(delta));
            console.log(delta.start, delta.end, delta.lines, delta.action);
        });
    }
};
