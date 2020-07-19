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
            if(this.debug){
                console.log("data received: "+ data);
            }
            if (data.userFingerPrint === this.userFingerPrint){

            }
            eventManager.enqueueEvent(data);
        });

        editor.session.on('change', function (delta) {
            if (editor.curOp && editor.curOp.command.name){
                this.count++;
                delta.userFingerprint = this.userFingerPrint;
                delta.timestamp = new Date()
                delta.count = this.count;
                if (this.debug){
                    console.log("change by current user", delta);
                    console.log(delta.start, delta.end, delta.lines, delta.action);
                }
                socket.send(JSON.stringify(delta));
            } else {
                if (this.debug){
                    console.log("change by other user", delta);
                }
            }
        });
    }
};
