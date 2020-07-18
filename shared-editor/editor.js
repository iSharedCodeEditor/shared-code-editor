
exports.listenEditor = function(editor, endpoint){

    const socket = new WebSocket(`ws://${endpoint}`);

    socket.onopen(() => {
        socket.send('Hello!');
    });

    socket.onmessage(data => {
        if(data.action === 'insert'){
            if(data.start.row !== data.end.row){
                editor.insert(data.start, '\n')
            } else {
                editor.insert(data.start, data.lines[0])
            }
        } else if (data.action === 'remove'){
            editor.session.replace(new ace.Range(data.start.row, data.start.column, data.end.row, data.end.column), "");
        }
        console.log(data);
    });

    editor.session.on('change', function(delta) {
        socket.onopen(() => {
            socket.send(delta)
        });
        console.log(delta.start, delta.end, delta.lines, delta.action);
    });
};

(function() {
    window.require(["editor/listenSharedEditor"], function(a) {
        if (a) {
            a.config.init(true);
            a.define = window.define;
        }
        if (!window.sharedEditor)
            window.sharedEditor = a;
        for (var key in a) if (a.hasOwnProperty(key))
            window.sharedEditor[key] = a[key];
        window.sharedEditor["default"] = window.sharedEditor;
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = window.sharedEditor;
        }
    });
})();
