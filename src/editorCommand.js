class EditorCommand {
    constructor(name) {
        this.name = name;
    }

    run(_editor) {
        throw new Error('Not implemented');
    }

    register() {
        return inkdrop.commands.add(
            document.body,
            'editor-utils:' + this.name,
            () => {
                const editor = inkdrop.getActiveEditor();
                if (!editor) {
                    console.error('No active editor found. Please focus on an editor window and try again.');
                    return;
                }
                this.run(editor);
            },
        );
    }
}

module.exports = { EditorCommand };
