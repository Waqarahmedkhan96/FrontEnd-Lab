# Nokia-Style Snake

A browser-based Snake game inspired by the classic Nokia phone experience.

## Overview

This project recreates the feel of the old Nokia Snake game using a green LCD-style screen, retro sound effects, and simple keyboard controls. The game is built in a single HTML file using HTML, CSS, and JavaScript only.

## Features

- Classic Snake gameplay
- Nokia-inspired green LCD visual style
- Wrap-around walls, similar to old Nokia Snake
- Multiple speed levels
- Pause and resume with the Space key
- Restart game with button or keyboard shortcut
- Simple retro sound effects using Web Audio API
- High score saved with localStorage
- Keyboard controls with both Arrow keys and WASD
- Single-file implementation with no external libraries

## Controls

- **Arrow Keys / W A S D** → move the snake
- **Space** → pause or resume
- **R** → restart the game

## Technical style

This game is implemented in a functional-programming-inspired way.

The game logic mainly uses:
- plain state objects
- helper functions
- immutable-style state updates

Examples include functions such as:
- `makeState(...)`
- `update(...)`
- `advanceSnake(...)`
- `spawnFood(...)`

Although the project uses browser side effects such as canvas drawing, keyboard events, sound, and localStorage, the main game logic follows a functional style rather than an object-oriented class-based structure.

## File

- `snake.html` → complete game in one HTML file with embedded CSS and JavaScript