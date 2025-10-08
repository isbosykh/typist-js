[![npm version](https://img.shields.io/npm/v/@isbosykh/typist-js?style=flat-square&logo=npm)](https://www.npmjs.com/package/@isbosykh/typist-js)
[![npm downloads](https://img.shields.io/npm/dm/@isbosykh/typist-js?style=flat-square)](https://www.npmjs.com/package/@isbosykh/typist-js)

# TypistJS

A modern, framework-agnostic typing animation library with customizable speed curves and advanced features.

## Features

- 🚀 **Framework Agnostic** - Works with any framework or vanilla JavaScript
- 📈 **Speed Curves** - Linear, Bezier, Exponential, and Sine speed curves
- ⚡ **TypeScript Support** - Full TypeScript definitions included
- 🎯 **Lightweight** - Small bundle size with zero dependencies
- 🔧 **Highly Configurable** - Extensive customization options
- 🎨 **CSS Friendly** - Easy to style and customize appearance

## Installation

```bash
npm install @isbosykh/typist-js
```

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { TypedText } from '@isbosykh/typist-js';

const typed = new TypedText('#my-element', {
  strings: ['Hello World!', 'Welcome to TypistJS!', 'Enjoy typing animations!'],
  typeSpeed: 100,
  loop: true,
  typeSpeedCurvature: 'sine'
});
```

### HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/typist-js/dist/index.umd.js"></script>
</head>
<body>
  <div id="typed-text"></div>
  
  <script>
    const typed = new TypistJS.TypedText('#typed-text', {
      strings: ['Hello World!', 'This is TypistJS!'],
      typeSpeed: 50,
      loop: true
    });
  </script>
</body>
</html>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `strings` | `string[]` | `[]` | Array of strings to type |
| `typeSpeed` | `number` | `50` | Typing speed in milliseconds |
| `backSpeed` | `number` | `25` | Backspacing speed in milliseconds |
| `startDelay` | `number` | `0` | Delay before typing starts |
| `backDelay` | `number` | `1000` | Delay before backspacing |
| `loop` | `boolean` | `false` | Loop through strings infinitely |
| `showCursor` | `boolean` | `true` | Show blinking cursor |
| `cursorChar` | `string` | `'|'` | Character to use for cursor |
| `typeSpeedCurvature` | `'linear' \| 'bezier' \| 'exponential' \| 'sine'` | `'sine'` | Speed curve type |

## Speed Curves

TypistJS supports different speed curves to make your typing animations more natural and engaging:

### Sine (Default)
Smooth wave-like speed variation for organic, natural feel.

### Linear
Constant typing speed throughout the animation.

### Bezier
Smooth acceleration and deceleration, similar to CSS ease-in-out.

### Exponential  
Starts slow and accelerates dramatically for powerful effect.

## Event Callbacks

```typescript
const typed = new TypedText('#element', {
  strings: ['First string', 'Second string'],
  onStringStart: (index) => {
    console.log(`Started typing string ${index}`);
  },
  onStringComplete: (index) => {
    console.log(`Completed string ${index}`);
  },
  onComplete: () => {
    console.log('All strings completed!');
  }
});
```

## API Methods

### `start()`
Start or restart the typing animation.

### `stop()`
Stop the current animation.

### `reset()`
Reset to the beginning without starting.

### `destroy()`
Clean up and remove all event listeners.

### `updateOptions(options)`
Update configuration options dynamically.

```typescript
typed.updateOptions({
  typeSpeed: 200,
  typeSpeedCurvature: 'exponential'
});
```

### `getCurrentString()`
Get the currently active string.

### `getCurrentStringIndex()`
Get the index of the currently active string.

### `isRunning()`
Check if the animation is currently running.

## Framework Integration Examples

### React

```tsx
import React, { useEffect, useRef } from 'react';
import { TypedText } from '@isbosykh/typist-js';

const TypedComponent: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<TypedText | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      typedRef.current = new TypedText(elementRef.current, {
        strings: ['Hello React!', 'TypistJS works great!'],
        typeSpeed: 100,
        loop: true,
        typeSpeedCurvature: 'bezier'
      });
    }

    return () => {
      typedRef.current?.destroy();
    };
  }, []);

  return <div ref={elementRef} className="typed-text" />;
};
```

### Vue 3

```vue
<template>
  <div ref="typedElement" class="typed-text"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { TypedText } from '@isbosykh/typist-js';

const typedElement = ref<HTMLElement>();
let typed: TypedText | null = null;

onMounted(() => {
  if (typedElement.value) {
    typed = new TypedText(typedElement.value, {
      strings: ['Hello Vue!', 'TypistJS is awesome!'],
      typeSpeed: 100,
      loop: true,
      typeSpeedCurvature: 'sine'
    });
  }
});

onUnmounted(() => {
  typed?.destroy();
});
</script>
```

### Svelte

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { TypedText } from '@isbosykh/typist-js';

  let element: HTMLElement;
  let typed: TypedText | null = null;

  onMount(() => {
    typed = new TypedText(element, {
      strings: ['Hello Svelte!', 'TypistJS rocks!'],
      typeSpeed: 100,
      loop: true,
      typeSpeedCurvature: 'exponential'
    });
  });

  onDestroy(() => {
    typed?.destroy();
  });
</script>

<div bind:this={element} class="typed-text"></div>
```

## Styling

TypistJS automatically adds CSS classes that you can style:

```css
.typed-text-content {
  /* Style the text content */
  font-family: 'Courier New', monospace;
  color: #333;
}

.typed-text-cursor {
  /* Style the cursor */
  color: #007acc;
  font-weight: bold;
}

.typed-text-cursor.hidden {
  /* Cursor hidden state - automatically managed */
  opacity: 0;
}
```

## Browser Support

TypistJS works in all modern browsers that support:
- ES2018 features
- DOM manipulation
- setTimeout/setInterval

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
