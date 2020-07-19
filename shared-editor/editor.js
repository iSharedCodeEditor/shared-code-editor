const sharedEditor = {
    debug:false,
    userFingerPrint: new Date().getTime(),
    count:0,
    listenEditor: function (editor, endpoint) {

        eventManager.editor = editor;
        eventManager.startListeningQueue();
        const socket = new WebSocket(`ws://${endpoint}`);

        socket.addEventListener('message', function (msg) {
            const data = JSON.parse(msg.data);
            if(sharedEditor.debug){
                console.log("data received: "+ data);
            }
            if (data.userFingerPrint === sharedEditor.userFingerPrint){

            }
            eventManager.enqueueEvent(data);
        });

        editor.session.on('change', function (delta) {
            if (editor.curOp && editor.curOp.command.name){
                sharedEditor.count++;
                delta.userFingerprint = sharedEditor.userFingerPrint;
                delta.timestamp = new Date()
                delta.count = sharedEditor.count;
                console.log(sharedEditor.debug);
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
    }
};

const eventManager = {
    editor: undefined,
    newEventQueue: [], //queue for incoming events to add it in historyQueue
    historyQueue: [], //queue for storing history, for operational transformation.
    startListeningQueue(){
        setInterval(()=>{
            while(eventManager.newEventQueue.length > 0){
                var data = eventManager.newEventQueue.shift();
                if (data.timestamp > eventManager.historyQueue[eventManager.historyQueue.length-1]){
                    eventManager.applyChange(data);
                }
            }
        },10);
    },
    applyChange(data){
        if (data.action === 'insert') {
            if (data.start.row !== data.end.row) {
                editor.session.insert(data.start, '\n')
            } else {
                editor.session.insert(data.start, data.lines[0])
            }
        } else if (data.action === 'remove') {
            editor.session.replace(new ace.Range(data.start.row, data.start.column, data.end.row, data.end.column), "");
        }
    },
    enqueueEvent(data){
        eventManager.newEventQueue.push(data);
    }
};

transformator = {

};
