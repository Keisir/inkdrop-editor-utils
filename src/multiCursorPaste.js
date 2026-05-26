const { EditorSelection } = require('@codemirror/state');

class MultiCursorPasteHandler {
    constructor() {
        this._handlePaste = this._handlePaste.bind(this);
    }

    activate() {
        document.addEventListener('paste', this._handlePaste, true);
    }

    deactivate() {
        document.removeEventListener('paste', this._handlePaste, true);
    }

    _handlePaste(event) {
        const editor = inkdrop.getActiveEditor();
        if (!editor || !editor.hasFocus) return;

        const { state } = editor;
        const { ranges } = state.selection;

        // Skip non-multi-cursor pastes
        if (ranges.length <= 1) return;

        const clipboardText = event.clipboardData?.getData('text/plain');
        if (!clipboardText) return;

        let lines = clipboardText.split(/\r?\n|\r/);

        // Strip trailing newline
        if (lines.length > 0 && lines[lines.length - 1] === '') {
            lines = lines.slice(0, -1);
        }

        if (lines.length !== ranges.length) return;

        event.preventDefault();
        event.stopPropagation();

        // Use changeByRange so CodeMirror handles position mapping for both
        // empty cursors (insertion) and non-empty ranges (selection replacement).
        let i = 0;
        editor.dispatch(
            state.changeByRange(range => {
                const line = lines[i++];
                return {
                    changes: { from: range.from, to: range.to, insert: line },
                    range: EditorSelection.cursor(range.from + line.length),
                };
            }),
        );
    }
}

module.exports = { MultiCursorPasteHandler };
