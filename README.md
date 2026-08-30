# J-CSS 🎨

**J-CSS** is a lightweight runtime alternative to the Tailwind CSS CDN.

No Node.js, bundler, CLI, or build step required.

- **16 KB gzip** — about **7.5× smaller** than the Tailwind CSS CDN runtime
- About **4.5× faster** in a synthetic benchmark with 7,000 class candidates
- About **3.2× smaller heap snapshot** in the same benchmark

## ⚡️ Quick Start

In many Tailwind-based interfaces, you can replace the Tailwind CDN script with J-CSS without visible changes:

```html
<!-- Replace the Tailwind CDN -->
<script src="https://cdn.jsdelivr.net/gh/Jipok/jcss@1/jcss.min.js"></script>

<!-- Start using Tailwind-like classes instantly -->
<div class="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl shadow-lg">
  Hello, World!
</div>
```

---

## 📦 The `<css>` Tag (Scoped Styles)

Tailwind keeps styles close to each element, but can make component markup
dense. Traditional CSS keeps markup clean, but often separates styles from
the component they belong to.

J-CSS keeps styles local at the component level: place one `<css>` tag in the
component root and style its descendants using utilities, selectors, or native
CSS

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Some description...</p>
  <button>Click Me</button>

  <css>
    &: bg-white p-6 rounded-xl shadow-md;
    h3: text-xl font-bold text-gray-900;
    p: mt-2 text-gray-600;
    button: mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg;

    /* Simple native CSS (scoped) */
    h3 {
      letter-spacing: -0.02em;
    }
  </css>
</div>
```

**How it works:** Under the hood, J-CSS generates a unique scope class (e.g., `.j-css-1`), adds it to the parent element, compiles the rules into valid CSS, injects them into `<head>`

<details>
<summary><b>📖 Advanced <code>&lt;css&gt;</code> Syntax Cheatsheet (Click to expand)</b></summary>

### Syntax

> **Important:** Utility rules use the form `selector:variants: utilities;`.
> A whitespace character must separate the final `:` from the utility list,
> and every utility rule must end with `;`.

### 1. Root Element Styling (`&`)
Use `&` to apply styles directly to the parent element containing the `<css>` tag (just like in Sass/SCSS):
```html
<div>
  <css>
    &: flex flex-col items-center p-4 bg-slate-100;
  </css>
</div>
```

### 2. Prefix Grouping
Instead of repeating `hover:` or `dark:` on every utility, group them at the selector level:
```html
<css>
  /* Syntax: selector:prefix1:prefix2: utility1 utility2; */
  button:hover: bg-blue-600 text-white shadow-lg;
  button:dark: bg-sky-500;
  button:dark:hover: bg-sky-400;

  /* Multiple selectors + responsive prefixes */
  h1, h2, h3: font-sans font-bold;
  &:lg: p-8;
</css>
```

### 3. Custom Scope ID
By default, scopes are generated automatically (`.j-css-1`, `.j-css-2`). You can provide a custom unique identifier:
```html
<div>
  <css id="product-card">
    /* Compiles to .j-css-product-card */
    &: p-4 bg-white;
  </css>
</div>
```

### 4. Attribute Variants (`data-*` and `aria-*`)

```html
<button data-state="open">
  Menu
  <css>
    &:data-[state=open]: bg-blue-500;
    &:aria-[expanded=true]: font-bold;
  </css>
</button>
```

### 5. `group-*` and `peer-*` Variants
```html
<div class="group">
  <button>Hover me</button>
  <span>Tooltip</span>

  <css>
    &: relative;
    span: absolute opacity-0 transition;
    span:group-hover: opacity-100;
  </css>
</div>
```

```html
<div>
  <input type="checkbox" class="peer">
  <span>Enabled</span>

  <css>
    span: text-gray-500;
    span:peer-checked: text-blue-500 font-bold;
  </css>
</div>
```

### 6. Native CSS Blocks

Simple native CSS rules can be mixed with utility rules. Their selectors
are scoped to the component automatically.

```html
<css>
  span {
    background-image: linear-gradient(to right, red, blue);
    background-clip: text;
    color: transparent;
  }
</css>
```

Complex nested at-rules are not currently supported inside `<css>`.
</details>

## Dynamic HTML

J-CSS observes DOM insertions and class changes, so it also works with
libraries such as [HTMX](https://htmx.org/) without a dedicated integration.

```html
<button
  hx-get="/items"
  hx-target="#items"
  hx-indicator="#spinner"
  class="px-4 py-2 rounded-lg bg-blue-500 text-white"
>
  Load items
</button>

<span
  id="spinner"
  class="opacity-0 transition-opacity [&.htmx-request]:opacity-100"
>
  Loading...
</span>

<div id="items"></div>
```

HTMX lifecycle classes can also be used as ordinary selectors inside `<css>`.

---

## ⚙️ Engine Options (`window.J`)

Configure J-CSS **before** loading the script:

```html
<script>
  window.J = {
    AutoDarkMode: true,   // Syncs the .dark class with the OS preference
    CSSClassMode: true,   // Generates CSS for utility classes found in the DOM
    CSSTagMode: true,     // Processes scoped <css> tags
    CSSWarnings: true,    // Warns in console about unrecognized utility classes
    CSSPerformance: true, // Logs class count and processing time
    CleanDOM: true,       // Removes <css> tags after processing
  };
</script>
```

## Tailwind Theme Compatibility

J-CSS supports selected options from `tailwind.config.theme.extend`:

- `colors`
- `fontFamily`
- `boxShadow`

The configuration must be declared **before** J-CSS is loaded:

```html
<script>
  // Before J-CSS is loaded!
  window.tailwind = {
    config: {
      theme: {
        extend: {
          colors: {
            brand: {
              100: '#e6f0ff',
              500: '#0066ff',
            }
          },
          fontFamily: {
            custom: ['"Comic Sans MS"', 'sans-serif']
          },
          boxShadow: {
            card: '0 8px 30px rgb(0 0 0 / 0.12)'
          }
        }
      }
    }
  }
</script>
```

## Extending Utilities

You can add custom utilities, colors, and prefixes(like specific media queries) through `J.cssExtensions`:

```html
<script>
  // Before J-CSS is loaded!
  window.J = window.J || {};
  window.J.cssExtensions = [{
    colors: {
        accent: {
        500: '#7c3aed',
        }
    },
    utilities: {
      // Adds class="layout-grid"
      'layout-grid': 'display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem;',
    },
    prefixes: {
      // Adds class="touch:hidden"
      'touch': { type: 'wrapper', handler: rule => `@media (hover: none) {${rule}}` }
    }
  }];
</script>
```

## Disclaimer

J-CSS is intended as a lightweight runtime engine for Tailwind-style interfaces, not a 1:1 replacement for the Tailwind CLI/compiler.

Not supported:
- The Tailwind plugin API
- Full Tailwind configuration compatibility
- Every Tailwind utility and variant
- Full support for complex arbitrary variants
- Container queries
- CSS-first Tailwind v4 configuration
