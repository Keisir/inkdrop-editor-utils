const { CompositeDisposable } = require('event-kit');
const commands = require('./commands');

class EditorUtilsPlugin {
    constructor() {
        this.disposables = new CompositeDisposable();
    }

    activate() {
        commands.forEach(command => {
            this.disposables.add(command.register());
        });
    }

    deactivate() {
        this.disposables.dispose();
    }
}

module.exports = new EditorUtilsPlugin();
