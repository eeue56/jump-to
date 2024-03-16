# jump-to (WIP)
A Vimium inspired keyboard shortcut script for browsers. Highlights all clickable elements on a page, then provides shortcuts to click them so you never have to leave your keyboard again!

## Usage

### Chrome

- Download the repo
- Run `npm install && npm run build-package`
- Open the dist/ folder in the repo folder as an extension

You can then active the extension on your current tab with ctrl-b. Once enabled, to show the jump-to options, press "k". You can press Esc to return back to normal, type the first letter to narrow it down, or press backspace to go back to all available links.

## TODO

- Add new link jumps as the user scrolls down the page
- Add test suite
- Add the ability to ctrl-click as a shortcut
- Place labelled elements so they don't collide
- Distribute labels closer to the home keys vs random letters (maybe?)

## Current example

![Example of trigger](image.png)