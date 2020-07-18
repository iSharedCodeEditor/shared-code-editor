exports.listenEditor = function(editor){
    editor.session.on('change', function(delta) {
        console.log( delta.start, delta.end, delta.lines, delta.action);
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
