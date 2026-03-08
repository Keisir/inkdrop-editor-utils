const { EditorSelection } = require('@codemirror/state');
const { EditorCommand } = require('./editorCommand');

class SortLineBaseAction extends EditorCommand {
    constructor(direction) {
        super(`sort-line-${direction}`);
        this.direction = direction;
    }

    run(editor) {
        const { state } = editor;
        const changes = state.selection.ranges.map(range => {
            const fromLine = state.doc.lineAt(range.from).number;
            const toLine = state.doc.lineAt(range.to).number;

            const lines = [];
            for (let i = fromLine; i <= toLine; i++) {
                lines.push(state.doc.line(i).text);
            }

            lines.sort((a, b) =>
                this.direction === 'ascending'
                    ? a.localeCompare(b)
                    : b.localeCompare(a),
            );

            const startPos = state.doc.line(fromLine).from;
            const endPos = state.doc.line(toLine).to;
            return { from: startPos, to: endPos, insert: lines.join('\n') };
        });

        if (!changes.length) return false;
        editor.dispatch({ changes });
        return true;
    }
}

class SortLineAscendingAction extends SortLineBaseAction {
    constructor() {
        super('ascending');
    }
}

class SortLineDescendingAction extends SortLineBaseAction {
    constructor() {
        super('descending');
    }
}

class TransformSelectionBaseAction extends EditorCommand {
    constructor(name, transformFn) {
        super(`transform-to-${name}`);
        this.transformFn = transformFn;
    }

    run(editor) {
        const { state } = editor;
        const changes = state.selection.ranges.map(range => {
            const from = range.from;
            const to = range.to;
            const selectedText = state.sliceDoc(from, to);
            return { from, to, insert: this.transformFn(selectedText) };
        });

        if (!changes.length) return false;
        editor.dispatch({ changes });
        return true;
    }
}

class TransformToUppercaseAction extends TransformSelectionBaseAction {
    constructor() {
        super('uppercase', text => text.toUpperCase());
    }
}

class TransformToLowercaseAction extends TransformSelectionBaseAction {
    constructor() {
        super('lowercase', text => text.toLowerCase());
    }
}

class TransformToTitleCaseAction extends TransformSelectionBaseAction {
    constructor() {
        super('title-case', text =>
            text.replace(
                /\w\S*/g,
                w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
            ),
        );
    }
}

class TransformToCamelCaseAction extends TransformSelectionBaseAction {
    constructor() {
        super('camel-case', text =>
            text
                .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
                .replace(/^(.)/, m => m.toLowerCase()),
        );
    }
}

class TransformToPascalCaseAction extends TransformSelectionBaseAction {
    constructor() {
        super('pascal-case', text =>
            text
                .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
                .replace(/^(.)/, m => m.toUpperCase()),
        );
    }
}

class TransformToKebabCaseAction extends TransformSelectionBaseAction {
    constructor() {
        super('kebab-case', text =>
            text
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .replace(/[_\s]+/g, '-')
                .toLowerCase(),
        );
    }
}

class TransformToSnakeCaseAction extends TransformSelectionBaseAction {
    constructor() {
        super('snake-case', text =>
            text
                .replace(/([a-z])([A-Z])/g, '$1_$2')
                .replace(/[-\s]+/g, '_')
                .toLowerCase(),
        );
    }
}

class CopyLineBaseAction extends EditorCommand {
    constructor(direction) {
        super(`copy-line-${direction}`);
        this.direction = direction;
    }

    run(editor) {
        const { state } = editor;
        const changes = state.selection.ranges
            .map(range => {
                const fromLine = state.doc.lineAt(range.from);
                const toLine = state.doc.lineAt(range.to);

                const dupFrom = fromLine.from;
                const dupTo = toLine.to;
                const text = state.doc.sliceString(dupFrom, dupTo);

                if (this.direction === 'down') {
                    return { from: dupFrom, insert: text + '\n' };
                } else if (this.direction === 'up') {
                    return { from: dupTo, insert: '\n' + text };
                } else {
                    return undefined;
                }
            })
            .filter(Boolean);
        if (!changes.length) return false;
        editor.dispatch({ changes });
        return true;
    }
}

class CopyLineUpAction extends CopyLineBaseAction {
    constructor() {
        super('up');
    }
}

class CopyLineDownAction extends CopyLineBaseAction {
    constructor() {
        super('down');
    }
}

class InsertNextMatchingCaretAction extends EditorCommand {
    constructor() {
        super('insert-next-matching-caret');
    }

    run(editor) {
        const { state } = editor;
        const primaryRange = state.selection.main;
        if (primaryRange.empty) return false;

        const searchText = state.sliceDoc(primaryRange.from, primaryRange.to);
        if (!searchText) return false;

        const docText = state.doc.toString();
        const searchLen = searchText.length;

        // Start searching after the furthest end of all current selections
        const maxTo = Math.max(...state.selection.ranges.map(r => r.to));

        const isAlreadySelected = idx =>
            state.selection.ranges.some(
                r => r.from === idx && r.to === idx + searchLen,
            );

        // Find next unselected occurrence from a given start position
        const findNextFrom = startPos => {
            let idx = startPos;
            while (idx <= docText.length - searchLen) {
                idx = docText.indexOf(searchText, idx);
                if (idx === -1) return -1;
                if (!isAlreadySelected(idx)) return idx;
                idx += searchLen;
            }
            return -1;
        };

        // Search forward, then wrap around to beginning if needed
        let nextIndex = findNextFrom(maxTo);
        if (nextIndex === -1) {
            nextIndex = findNextFrom(0);
        }
        if (nextIndex === -1) return false;

        const newRange = EditorSelection.range(
            nextIndex,
            nextIndex + searchLen,
        );
        const newSelection = EditorSelection.create(
            [...state.selection.ranges, newRange],
            state.selection.ranges.length, // make the newly added range the main one
        );

        editor.dispatch({ selection: newSelection });
        return true;
    }
}

module.exports = [
    new SortLineAscendingAction(),
    new SortLineDescendingAction(),
    new TransformToUppercaseAction(),
    new TransformToLowercaseAction(),
    new TransformToTitleCaseAction(),
    new TransformToCamelCaseAction(),
    new TransformToPascalCaseAction(),
    new TransformToKebabCaseAction(),
    new TransformToSnakeCaseAction(),
    new CopyLineUpAction(),
    new CopyLineDownAction(),
    new InsertNextMatchingCaretAction(),
];
