const eventManager = {
    editor: undefined,
    newEventQueue: [], //queue for incoming events to add it in historyQueue
    historyQueue: [], //queue for storing history, for operational transformation.
    startListeningQueue(){
        setInterval(()=>{
            while(this.newEventQueue.length > 0){
                var data = this.newEventQueue.shift();
                if (data.timestamp > this.historyQueue[this.historyQueue.length-1]){
                    this.applyChange(data);
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
        this.newEventQueue.push(data);
    }
};
