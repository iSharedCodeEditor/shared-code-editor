const sharedEditor = {
    debug:false,
    onServerEvent(evt){},
    onUserEvent(evt){},
    dragAndDropEnabled: true,
    listenEditor: function (editor, endpoint) {

        if(sharedEditor.dragAndDropEnabled){
            editor.container.addEventListener('drop', (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                const files = evt.dataTransfer.files;
                if (files.length > 0) {
                    files[0].text().then(
                        text => {
                            var remove = {
                                start:{row:0, col:0},
                                end:{row:9999999, col:999999},
                                action:"remove",
                                lines: []
                            };
                            var insertFile = {
                                start:{row:0, col:0},
                                end:{row:9999999, col:999999},
                                action:"insert",
                                lines: [text]
                            };
                            socket.send(JSON.stringify(remove));
                            sharedEditor.applyChange(remove);
                            socket.send(JSON.stringify(insertFile));
                            sharedEditor.applyChange(insertFile);
                        }
                    );
                }
            });
            editor.container.addEventListener('dragover', (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
            });
            editor.container.addEventListener('dragleave', (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
            });
        }
        const socket = new WebSocket(`ws://${endpoint}`);

        socket.addEventListener('message', function (msg) {
            sharedEditor.onServerEvent("server");
            const data = JSON.parse(msg.data);
            if(sharedEditor.debug){
                console.log("data received: "+ data);
            }
            if(data.hasOwnProperty('getText')){
                socket.send(JSON.stringify({
                    getText:editor.getValue()
                }))
            } else {
                sharedEditor.applyChange(data);
            }
        });

        editor.session.on('change', function (delta) {
            if (editor.curOp && editor.curOp.command.name){
                if (sharedEditor.debug){
                    sharedEditor.onUserEvent("user event");
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
            let dataStr = "";
            var i;
            for (i = 0; i < data.lines.length; i++) {
                dataStr += data.lines[i] + '\n';
            }
            editor.session.insert(data.start, dataStr)
        } else if (data.action === 'remove') {
            editor.session.replace(new ace.Range(data.start.row, data.start.column, data.end.row, data.end.column), "");
        }
    }
};
