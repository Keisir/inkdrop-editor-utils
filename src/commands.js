const { moveLineUp, moveLineDown } = require('@codemirror/commands');
const { EditorCommand } = require('./editorCommand');

class MoveLinesBaseAction extends EditorCommand {
    constructor(direction) {
        super(`move-lines-${direction}`);
    }
}

class MoveLinesUpAction extends MoveLinesBaseAction {
    constructor() {
        super('up');
    }

    run(editor) {
        return moveLineUp(editor);
    }
}

class MoveLinesDownAction extends MoveLinesBaseAction {
    constructor() {
        super('down');
    }

    run(editor) {
        return moveLineDown(editor);
    }
}

class SortLinesBaseAction extends EditorCommand {
    constructor(direction) {
        super(`sort-lines-${direction}`);
        this.direction = direction;
    }

    run(editor) {
        const { state } = editor;
        const { selection } = state;

        if (selection.ranges.length === 0) return false;

        const transactions = [];
        for (const range of selection.ranges) {
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
            transactions.push({
                changes: {
                    from: startPos,
                    to: endPos,
                    insert: lines.join('\n'),
                },
            });
        }

        if (transactions.length > 0) {
            editor.dispatch(...transactions);
            return true;
        }

        return false;
    }
}

class SortLinesAscendingAction extends SortLinesBaseAction {
    constructor() {
        super('ascending');
    }
}

class SortLinesDescendingAction extends SortLinesBaseAction {
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
        const { selection } = state;
        if (selection.ranges.length === 0) return false;

        const changes = selection.ranges.map(range => {
            const from = range.from;
            const to = range.to;
            const selectedText = state.sliceDoc(from, to);
            return { from, to, insert: this.transformFn(selectedText) };
        });

        if (changes.length > 0) {
            editor.dispatch({ changes });
            return true;
        }
        return false;
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

module.exports = [
    new MoveLinesUpAction(),
    new MoveLinesDownAction(),
    new SortLinesAscendingAction(),
    new SortLinesDescendingAction(),
    new TransformToUppercaseAction(),
    new TransformToLowercaseAction(),
    new TransformToTitleCaseAction(),
    new TransformToCamelCaseAction(),
    new TransformToPascalCaseAction(),
    new TransformToKebabCaseAction(),
    new TransformToSnakeCaseAction(),
];
