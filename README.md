# Editor Utils

A small set of quality-of-life enhancements for the markdown editor. Copy lines, sort selections, transform text cases, and add multi-cursors to matching selections.

## Features

- Copy lines up/down (multi-line aware, multi-cursor aware)
- Sort selected lines in ascending/descending order (multi-line aware, multi-cursor aware)
- Insert next matching caret, adds a multi-cursor at the next occurrence of the current selection
- Transform selection case (multi-cursor aware):
    - UPPERCASE / lowercase
    - Title Case
    - camelCase / PascalCase
    - kebab-case / snake_case

## Usage

Use the default keybindings or invoke commands using Telescope. All commands are prefixed with `Editor Utils:`

### Default keybindings

The plugin ships with these default bindings:

- <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>Up</kbd>: Copy line up (`editor-utils:copy-line-up`)
- <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>Down</kbd>: Copy line down (`editor-utils:copy-line-down`)
- <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>.</kbd>: Insert next matching caret (`editor-utils:insert-next-matching-caret`)

You can customize or add your own keybindings from Inkdrop's Preferences > Keybindings.

## Changelog

### 1.0.0

- Line copy (up/down)
- Line sorting (ascending/descending)
- Text case transformation (upper/lower/title/camel/pascal/kebab/snake)
- Insert next matching caret (`editor-utils:insert-next-matching-caret`), adds a multi-cursor at the next occurrence of the selected text, wrapping around the document; press repeatedly to select more occurrences
