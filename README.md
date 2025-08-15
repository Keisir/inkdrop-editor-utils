# Editor Utils

A small set of quality-of-life enhancements for the markdown editor. Move lines, sort selections, and transform text cases.

## Features

- Move lines up/down (multi-line aware, multi-cursor aware)
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

- <kbd>Alt</kbd>+<kbd>Up</kbd>: Move lines up (`editor-utils:move-lines-up`)
- <kbd>Alt</kbd>+<kbd>Down</kbd>: Move lines down (`editor-utils:move-lines-down`)

You can customize or add your own keybindings from Inkdrop's Preferences > Keybindings.

## Changelog

### 1.0.0

- Initial public release
- Line movement (up/down)
- Line sorting (ascending/descending)
- Text case transforms (upper/lower/title/camel/pascal/kebab/snake)
