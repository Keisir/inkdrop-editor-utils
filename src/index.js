const { CompositeDisposable } = require('event-kit');
const commands = require('./commands');
const { MultiCursorPasteHandler } = require('./multiCursorPaste');

class EditorUtilsPlugin {
    constructor() {
        this.disposables = new CompositeDisposable();
        this.multiCursorPasteHandler = new MultiCursorPasteHandler();
    }

    activate() {
        commands.forEach(command => {
            this.disposables.add(command.register());
        });
        this.multiCursorPasteHandler.activate();
    }

    deactivate() {
        this.disposables.dispose();
        this.multiCursorPasteHandler.deactivate();
    }
}

module.exports = new EditorUtilsPlugin();
