# Editor Utils

A small set of quality-of-life enhancements for the markdown editor. Copy lines, sort selections, and transform text cases.

## Features

- Copy lines up/down (multi-line aware, multi-cursor aware)
- Sort selected lines in ascending/descending order (multi-line aware, multi-cursor aware)
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

You can customize or add your own keybindings from Inkdrop's Preferences > Keybindings.

## Changelog

### 1.0.0

- Initial public release
- Line copy (up/down)
- Line sorting (ascending/descending)
- Text case transforms (upper/lower/title/camel/pascal/kebab/snake)
