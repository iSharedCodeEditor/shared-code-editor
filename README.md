# Shared Code Editor
[![version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://semver.org)
### Embeding code editor
First you need to add ace cdn to html :
```html
<script src="shared-editor/lib/ace-min/ace.js" type="text/javascript" charset="utf-8"></script>
```
For more information you can refer to [ace git](https://github.com/ajaxorg/ace).
You can use ace from our library in shared-editor/lib/ace-min/ folder.
To use our library you need to download / clone this repository and add script in project.
```html
<script src="shared-editor/editor.js" type="text/javascript" charset="utf-8"></script>
```
and also initialize it with :
```javascript
var editor = ace.edit("editor");
sharedEditor.listenEditor(editor, "localhost:8080");
```

### Options
Possible options are **debug** , **onServerEvent** , **onUserEvent** :
```javascript
sharedEditor.debug = true;
sharedEditor.onServerEvent = (event)=>{//use event}
sharedEditor.onUserEvent = (event)=>{//use event}
```
| Option | Description |
| ------ | ------ |
| debug | Logs events in console|
| onServerEvent | Fires an event when received another user action from server |
| onUserEvent Drive | Fires an event when current user edits|

### Server Options 
Server can poll any editor for current snapshot by calling : 
```javascript
ws.send(JSON.stringify({getText:""}))
```
And editor returns response of the following type :
```javascript
socket.send(JSON.stringify({
    getText: "Hello World"
}))
```
### Demo
Also you can see our [demo](https://github.com/iSharedCodeEditor/shared-code-editor/tree/master/demo) server written on node.js

### Contribution
For contribution please visit  [contribution.md](https://github.com/iSharedCodeEditor/shared-code-editor/tree/master/demo)



