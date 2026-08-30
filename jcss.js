(function () {
    'use strict';

// =========================================================================
// INITIALIZATION & CONFIG
// =========================================================================

const J = window.J = window.J || {};
J.CleanDOM ??= true;
J.CSSClassMode ??= true;
J.CSSTagMode ??= true;
J.CSSWarnings ??= true;
J.CSSPerformance ??= true;

J.CSSNonce ??= document.currentScript?.nonce || null;

// =========================================================================
// COLOR PALETTE
// =========================================================================

const colorMap = new Map([
    // Special keywords that need to be recognized but are handled differently
    ['transparent', 'transparent'],
    ['current', 'currentColor'],
    ['inherit', 'inherit'],
    // Pre-defined simple colors with their RGB values
    ['white', [255, 255, 255]],
    ['black', [0, 0, 0]],
]);

const colors = {
	amber  : ['fffbeb', 'fef3c6', 'fee685', 'ffd230', 'fcba00', 'f69d00', 'd87700', 'b55100', '973c00', '7b3306', '461901'],
	blue   : ['eff6ff', 'dbeafe', 'bedbff', '8ec5ff', '51a2ff', '2b7fff', '155dfc', '1447e6', '193cb8', '1c398e', '162456'],
	cyan   : ['ecfeff', 'cefafe', 'a2f4fd', '53eafd', '00d3f2', '00b8db', '0092b8', '007595', '005f78', '104e64', '053345'],
	emerald: ['ecfdf5', 'd0fae5', 'a4f4cf', '5ee9b5', '00d492', '00bc7d', '009966', '007a55', '006045', '004f3b', '002c22'],
	fuchsia: ['fdf4ff', 'fae8ff', 'f6cfff', 'f4a8ff', 'ed6aff', 'e12afb', 'c800de', 'a800b7', '8a0194', '721378', '4b004f'],
	gray   : ['f9fafb', 'f3f4f6', 'e5e7eb', 'd1d5dc', '99a1af', '6a7282', '4a5565', '364153', '1e2939', '101828', '030712'],
	green  : ['f0fdf4', 'dcfce7', 'b9f8cf', '7bf1a8', '05df72', '00c950', '00a63e', '008236', '016630', '0d542b', '032e15'],
	indigo : ['eef2ff', 'e0e7ff', 'c6d2ff', 'a3b3ff', '7c86ff', '615fff', '4f39f6', '432dd7', '372aac', '312c85', '1e1a4d'],
	lime   : ['f7fee7', 'ecfcca', 'd8f999', 'bbf451', '9ae600', '83cd00', '64a400', '497d00', '3c6300', '35530e', '192e03'],
	neutral: ['fafafa', 'f5f5f5', 'e5e5e5', 'd4d4d4', 'a1a1a1', '737373', '525252', '404040', '262626', '171717', '0a0a0a'],
	orange : ['fff7ed', 'ffedd4', 'ffd6a7', 'ffb86a', 'ff8904', 'f97200', 'e55b00', 'c23f00', '9f2d00', '7e2a0c', '441306'],
	pink   : ['fdf2f8', 'fce7f3', 'fccee8', 'fda5d5', 'fb64b6', 'f6339a', 'e60076', 'c6005c', 'a3004c', '861043', '510424'],
	purple : ['faf5ff', 'f3e8ff', 'e9d4ff', 'dab2ff', 'c27aff', 'ad46ff', '9810fa', '8200db', '6e11b0', '59168b', '3c0366'],
	red    : ['fef2f2', 'ffe2e2', 'ffc9c9', 'ffa2a2', 'ff6467', 'fb2c36', 'e7000b', 'c10007', '9f0712', '82181a', '460809'],
	rose   : ['fff1f2', 'ffe4e6', 'ffccd3', 'ffa1ad', 'ff637e', 'ff2056', 'eb0040', 'c60036', 'a50036', '8b0836', '4d0218'],
	sky    : ['f0f9ff', 'dff2fe', 'b8e6fe', '74d4ff', '00bcff', '00a6f4', '0084d1', '0069a8', '00598a', '024a70', '052f4a'],
	slate  : ['f8fafc', 'f1f5f9', 'e2e8f0', 'cad5e2', '90a1b9', '62748e', '45556c', '314158', '1d293d', '0f172b', '020618'],
	stone  : ['fafaf9', 'f5f5f4', 'e7e5e4', 'd6d3d1', 'a6a09b', '79716b', '57534d', '44403b', '292524', '1c1917', '0c0a09'],
	teal   : ['f0fdfa', 'cbfbf1', '96f7e4', '46ecd5', '00d5be', '00bba7', '009689', '00786f', '005f5a', '0b4f4a', '022f2e'],
	violet : ['f5f3ff', 'ede9fe', 'ddd6ff', 'c4b4ff', 'a684ff', '8e51ff', '7f22fe', '7008e7', '5d0ec0', '4d179a', '2f0d68'],
	yellow : ['fefce8', 'fef9c2', 'fff085', 'ffdf20', 'fbc800', 'edb200', 'cc8900', 'a36100', '894b00', '733e0a', '432004'],
	zinc   : ['fafafa', 'f4f4f5', 'e4e4e7', 'd4d4d8', '9f9fa9', '71717b', '52525c', '3f3f46', '27272a', '18181b', '09090b']
};
// Map array indices to their corresponding shade names
const shadeKeys = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

function hexToRgb(hex) {
    const n = parseInt(hex.replace(/^#/, ''), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
}

// Populate the colorMap with all shades from the colors object.
// The value will be an array of [R, G, B] numbers for easy use later.
for (const colorName in colors) {
    colors[colorName].forEach((hex, i) => {
        colorMap.set(
            `${colorName}-${shadeKeys[i]}`,
            hexToRgb(hex)
        );
    });
}

// =========================================================================
// DESIGN TOKENS
// =========================================================================

const SHADOW_MAP = {
    'sm': '0 1px 2px 0 var(--j-shadow-color, rgb(0 0 0 / 0.05))',
    '': '0 1px 3px 0 var(--j-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--j-shadow-color, rgb(0 0 0 / 0.1))',
    'md': '0 4px 6px -1px var(--j-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--j-shadow-color, rgb(0 0 0 / 0.1))',
    'lg': '0 10px 15px -3px var(--j-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--j-shadow-color, rgb(0 0 0 / 0.1))',
    'xl': '0 20px 25px -5px var(--j-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--j-shadow-color, rgb(0 0 0 / 0.1))',
    '2xl': '0 25px 50px -12px var(--j-shadow-color, rgb(0 0 0 / 0.25))',
    'none': '0 0 #0000',
    // v3
    'inner': 'inset 0 2px 4px 0 var(--j-shadow-color, rgb(0 0 0 / 0.05))',
};

const INSET_SHADOW_MAP = {
    '2xs': 'inset 0 1px 0 var(--j-shadow-color, rgb(0 0 0 / 0.05))',
    'xs': 'inset 0 1px 1px 0 var(--j-shadow-color, rgb(0 0 0 / 0.05))',
    'sm': 'inset 0 2px 4px 0 var(--j-shadow-color, rgb(0 0 0 / 0.05))',
    'none': 'inset 0 0 #0000',
};

const DROP_SHADOW_MAP = {
    'sm': 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
    '': 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))',
    'md': 'drop-shadow(0 2px 2px rgb(0 0 0 / 0.1))',
    'lg': 'drop-shadow(0 4px 4px rgb(0 0 0 / 0.15))',
    'xl': 'drop-shadow(0 8px 8px rgb(0 0 0 / 0.15))',
    '2xl': 'drop-shadow(0 12px 24px rgb(0 0 0 / 0.15))',
    'none': 'drop-shadow(0 0 #0000)',
};

const BLUR_MAP = {
    'sm': 'blur(4px)',
    '': 'blur(8px)',
    'md': 'blur(12px)',
    'lg': 'blur(16px)',
    'xl': 'blur(24px)',
    '2xl': 'blur(40px)',
    '3xl': 'blur(64px)',
};

const BORDER_RADIUS_SCALE = {
    'none': '0',
    'sm': '0.125rem',
    '': '0.25rem',
    'md': '0.375rem',
    'lg': '0.5rem',
    'xl': '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    'full': '9999px',
};

const BREAKPOINT_WIDTHS = {
    'px': '1px',
    '3xs': '16rem',  // 256px
    '2xs': '18rem',  // 288px
    'xs': '20rem',   // 320px
    'sm': '24rem',   // 384px
    'md': '28rem',   // 448px
    'lg': '32rem',   // 512px
    'xl': '36rem',   // 576px
    '2xl': '42rem',  // 672px
    '3xl': '48rem',  // 768px
    '4xl': '56rem',  // 896px
    '5xl': '64rem',  // 1024px
    '6xl': '72rem',  // 1152px
    '7xl': '80rem',  // 1280px
};

const VIEWPORT_W = { 'screen': '100vw', 'svw': '100svw', 'lvw': '100lvw', 'dvw': '100dvw' };
const VIEWPORT_H = { 'screen': '100vh', 'svh': '100svh', 'lvh': '100lvh', 'dvh': '100dvh' };

const SIZING_KEYWORDS = {
    'full': '100%',
    'min': 'min-content',
    'max': 'max-content',
    'fit': 'fit-content',
}

// =========================================================================
// TAILWIND COMPATIBILITY
// =========================================================================

const TW_EXTEND = window.tailwind?.config?.theme?.extend ?? {};
const cssList = value =>
    Array.isArray(value) ? value.join(', ') : String(value);

// Support tailwind.config.theme.extend.colors
function addColors(colors, prefix = '') {
    for (const [key, value] of Object.entries(colors ?? {})) {
        const name = key === 'DEFAULT'
            ? prefix
            : [prefix, key].filter(Boolean).join('-');

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            addColors(value, name);
        } else if (name && /^#[\da-f]{6}$/i.test(value)) {
            colorMap.set(name, hexToRgb(value))
        }
    }
}
addColors(TW_EXTEND.colors);

// Support tailwind.config.theme.extend.boxShadow
Object.assign(
    SHADOW_MAP,
    Object.fromEntries(
        Object.entries(TW_EXTEND.boxShadow ?? {}).map(([name, value]) => [
            name === 'DEFAULT' ? '' : name,
            cssList(value),
        ])
    )
);

// Support tailwind.config.theme.extend.fontFamily
const FONT_FAMILY_UTILITIES = Object.fromEntries(
    Object.entries(TW_EXTEND.fontFamily ?? {}).map(([name, value]) => [
        name,
        `font-family: ${cssList(value)}`,
    ])
);

// =========================================================================
// TRANSFORMERS & DATA HELPERS
// =========================================================================

const TRANSFORMERS = {
    px: (v) => `${v}px`,
    rem: (v) => `${v * 0.25}rem`,
    opacity: (v) => String(Number(v) / 100),
    deg: (v) => `${v}deg`,
    ms: (v) => `${v}ms`,
};

const SPACING_PADDING_CONFIG = {
    $num: TRANSFORMERS.rem,
    $arbitrary: true,
    'px': '1px',
};

const SPACING_MARGIN_CONFIG = {
    $num: TRANSFORMERS.rem,
    $arbitrary: true,
    $negative: true,
    'auto': 'auto',
    'px': '1px',
};

const $frac = (v) => {
    const [num, den] = String(v).split('/').map(Number);
    return (den !== 0 && !isNaN(num) && !isNaN(den)) ? `${(num / den) * 100}%` : undefined;
}

const compact = value => value.replace(/\s+/g, ' ').trim();

// Generates the final CSS value for a color, handling transparency and variables
function generateColorCss(name, opacity, opacityVariable) {
    const color = colorMap.get(name);

    // Special keywords
    if (typeof color === 'string') return color;

    // Array [R, G, B]
    const rgb = color.join(' ');

    // Provided CSS variable for opacity (e.g., --j-border-opacity)
    if (opacityVariable) {
        return `rgb(${rgb} / var(${opacityVariable}, 1))`;
    }

    // Direct opacity modifier (e.g., /50)
    if (opacity != null) {
        return `rgb(${rgb} / ${+opacity.toFixed(3)})`;
    }

    // Fallback: Just the plain color in rgb format, for utilities that don't support opacity
    return `rgb(${rgb})`;
}

// Checks if an arbitrary string looks like a standard CSS color format
function looksLikeColor(value) {
    return /^#[\da-f]{3,8}$/i.test(value) ||
           /^rgba?\(/.test(value) ||
           /^hsla?\(/.test(value)
}

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

// =========================================================================
// BASE CSS TEMPLATES
// =========================================================================

const BASE_CSS = {

transform: compact(`
    --j-translate-x: 0;
    --j-translate-y: 0;
    --j-rotate: 0;
    --j-skew-x: 0;
    --j-skew-y: 0;
    --j-scale-x: 1;
    --j-scale-y: 1;
    transform: translate(var(--j-translate-x), var(--j-translate-y))
            rotate(var(--j-rotate))
            skewX(var(--j-skew-x))
            skewY(var(--j-skew-y))
            scale(var(--j-scale-x), var(--j-scale-y))
    `),
transition: 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms',
filter: compact(`
    --j-blur: ;
    --j-brightness: ;
    --j-contrast: ;
    --j-grayscale: ;
    --j-hue-rotate: ;
    --j-invert: ;
    --j-saturate: ;
    --j-sepia: ;
    --j-drop-shadow: ;
    filter: var(--j-blur) var(--j-brightness) var(--j-contrast) var(--j-grayscale) var(--j-hue-rotate) var(--j-invert) var(--j-saturate) var(--j-sepia) var(--j-drop-shadow)
    `),
backdrop: compact(`
    --j-backdrop-blur: ;
    --j-backdrop-brightness: ;
    --j-backdrop-contrast: ;
    --j-backdrop-grayscale: ;
    --j-backdrop-hue-rotate: ;
    --j-backdrop-invert: ;
    --j-backdrop-saturate: ;
    --j-backdrop-sepia: ;
    backdrop-filter: var(--j-backdrop-blur) var(--j-backdrop-brightness) var(--j-backdrop-contrast) var(--j-backdrop-grayscale) var(--j-backdrop-hue-rotate) var(--j-backdrop-invert) var(--j-backdrop-saturate) var(--j-backdrop-sepia)
    `),
shadow: compact(`
    --j-shadow: 0 0 #0000;
    --j-ring-inset: ;
    --j-ring-offset-width: 0px;
    --j-ring-offset-color: #fff;
    --j-ring-color: rgb(59 130 246 / 0.5);
    --j-ring-width: 0px;
    --j-ring-offset-shadow: var(--j-ring-inset) 0 0 0 var(--j-ring-offset-width) var(--j-ring-offset-color);
    --j-ring-shadow: var(--j-ring-inset) 0 0 0 calc(var(--j-ring-width) + var(--j-ring-offset-width)) var(--j-ring-color);
    box-shadow: var(--j-ring-offset-shadow), var(--j-ring-shadow), var(--j-shadow, 0 0 #0000)
    `),
borderSpacing: compact(`
    --j-border-spacing-x: 0;
    --j-border-spacing-y: 0;
    border-spacing: var(--j-border-spacing-x) var(--j-border-spacing-y);
`)

};

// =========================================================================
// 7. PREFIX HANDLERS (Variants, Breakpoints, Pseudo-classes)
// =========================================================================

const media = query => ({
    type: 'wrapper', // Wraps the entire CSS rule in an at-rule (e.g., a @media query)
    handler: rule => `@media ${query} {${rule}}`,
});

const pseudo = suffix => ({
    type: 'pseudo', // Modifies the selector string (e.g., adds a pseudo-class like :hover)
    handler: selector => `${selector}${suffix}`,
});

// This object maps utility prefixes to their corresponding CSS handler
const PREFIX_HANDLERS = {
    // --- MEDIA QUERIES (type: wrapper) ---
    // Standard breakpoints
    'sm':  media('(min-width: 40rem)'), // 640px
    'md':  media('(min-width: 48rem)'), // 768px
    'lg':  media('(min-width: 64rem)'), // 1024px
    'xl':  media('(min-width: 80rem)'), // 1280px
    '2xl': media('(min-width: 96rem)'), // 1536px
    // Max-width breakpoints
    'max-2xl': media('(max-width: 95.999rem)'),
    'max-xl':  media('(max-width: 79.999rem)'),
    'max-lg':  media('(max-width: 63.999rem)'),
    'max-md':  media('(max-width: 47.999rem)'),
    'max-sm':  media('(max-width: 39.999rem)'),
    // Feature queries
    'motion-safe': media('(prefers-reduced-motion: no-preference)'),
    'motion-reduce': media('(prefers-reduced-motion: reduce)'),
    'contrast-more': media('(prefers-contrast: more)'),
    'contrast-less': media('(prefers-contrast: less)'),
    'landscape': media('(orientation: landscape)'),
    'portrait': media('(orientation: portrait)'),
    'print': media('print'),

    // --- PSEUDO-CLASS SELECTORS (type: pseudo) ---
    // Interaction states
    'hover': pseudo(':hover'),
    'placeholder-shown': pseudo(':placeholder-shown'), // Must be before 'focus'
    'focus': pseudo(':focus'),
    'focus-within': pseudo(':focus-within'),
    'focus-visible': pseudo(':focus-visible'),
    'active': pseudo(':active'),
    'visited': pseudo(':visited'),
    'target': pseudo(':target'),
    // Structural position
    'first': pseudo(':first-child'),
    'last': pseudo(':last-child'),
    'only': pseudo(':only-child'),
    'odd': pseudo(':nth-child(odd)'),
    'even': pseudo(':nth-child(even)'),
    'first-of-type': pseudo(':first-of-type'),
    'last-of-type': pseudo(':last-of-type'),
    'only-of-type': pseudo(':only-of-type'),
    'empty': pseudo(':empty'),
    // Form states
    'disabled': pseudo(':disabled'),
    'enabled': pseudo(':enabled'),
    'checked': pseudo(':checked'),
    'indeterminate': pseudo(':indeterminate'),
    'read-only': pseudo(':read-only'),
    'required': pseudo(':required'),
    'optional': pseudo(':optional'),
    'valid': pseudo(':valid'),
    'invalid': pseudo(':invalid'),
    'open': pseudo('[open]'),

    // --- PSEUDO-ELEMENT SELECTORS (type: pseudo) ---
    'before': pseudo('::before'),
    'after': pseudo('::after'),
    'placeholder': pseudo('::placeholder'),
    'file': pseudo('::file-selector-button'),
    'marker': { type: 'pseudo', handler: (s) => `${s}::marker, ${s} *::marker` },
    'selection': { type: 'pseudo', handler: (s) => `${s}::selection, ${s} *::selection` },
    'first-letter': pseudo('::first-letter'),
    'first-line': pseudo('::first-line'),

    // --- ATTRIBUTE & CONTEXTUAL SELECTORS (type: pseudo) ---
    'rtl': { type: 'pseudo', handler: (s) => `[dir="rtl"] ${s}` },
    'ltr': { type: 'pseudo', handler: (s) => `[dir="ltr"] ${s}` },
    // Aria attributes (only for "true" values, as this is most common)
    'aria-checked':  { type: 'pseudo', handler: (s) => `${s}[aria-checked="true"]`},
    'aria-disabled': { type: 'pseudo', handler: (s) => `${s}[aria-disabled="true"]`},
    'aria-expanded': { type: 'pseudo', handler: (s) => `${s}[aria-expanded="true"]`},
    'aria-hidden':   { type: 'pseudo', handler: (s) => `${s}[aria-hidden="true"]`},
    'aria-pressed':  { type: 'pseudo', handler: (s) => `${s}[aria-pressed="true"]`},
    'aria-readonly': { type: 'pseudo', handler: (s) => `${s}[aria-readonly="true"]`},
    'aria-required': { type: 'pseudo', handler: (s) => `${s}[aria-required="true"]`},
    'aria-selected': { type: 'pseudo', handler: (s) => `${s}[aria-selected="true"]`},

    // --- CUSTOM ---
    'dark':  { type: 'pseudo', handler: (selector) => `html.dark ${selector}` },
    'child': { type: 'pseudo', handler: (selector) => `${selector} > :not([hidden]) ~ :not([hidden])` },
};

// =========================================================================
// 8. CORE UTILITY CONFIGURATION
// =========================================================================

// Meta-keys inherited by nested utility nodes using {$inherit}
const $inherit = ['$prop', '$default', '$values', '$arbitrary', '$base', '$selector', '$negative', '$num', '$color', '$frac'];

// UTILITY_CONFIG maps utility class names to CSS rules.
// When generateCss() runs:
// 1. Splits the class into parts (e.g. "border-t-4").
// 2. Walks through UTILITY_CONFIG to find the matching rule.
// 3. The leftover part becomes the value (e.g. "4").
// 4. Depending on meta-keys:
//    - $prop:      The CSS property to apply (string or array of strings).
//    - $values:    Lookup table (object or array) for predefined values.
//    - $num:       Function to transform numeric values (e.g., to rem, px).
//    - $frac:      Function to transform fractions (e.g., 1/2 -> 50%).
//    - $color:     Function to resolve colors and opacities.
//    - $arbitrary: Boolean or function handling bracket values like `-[10px]`.
//    - $inherit:   Array of meta-keys to inherit from the parent node.
//    - $selector:  Dynamic selector transformer (e.g., child-combinator).
//    - $base:      Base CSS variables required for this rule to function.
//    - $negative:  Boolean allowing negative values (e.g., -mt-4).
//    - $default:   Fallback function if no other condition matches.
// 5. Finally combines $prop + value into a CSS declaration, adding $base if defined.
const UTILITY_CONFIG = {
    // --- Display & Visibility ---
    'block': 'display: block',
    'isolate': 'isolation: isolate',
    'isolation-auto': 'isolation: auto',
    'inline': {
        '': 'display: inline',
        'block': 'display: inline-block',
        'flex': 'display: inline-flex',
        'grid': 'display: inline-grid',
    },
    'flow-root': 'display: flow-root',
    'contents': 'display: contents',
    'box-border': 'box-sizing: border-box',
    'box-content': 'box-sizing: content-box',
    'visible': 'visibility: visible',
    'invisible': 'visibility: hidden',
    'collapse': 'visibility: collapse',

    'columns': {
        // e.g., columns-3, columns-sm, columns-[20rem]
        $prop: 'columns',
        'auto': 'auto', // Keyword for columns: auto
        $num: v => String(v), // Handles numeric values like columns-2, columns-3
        ...BREAKPOINT_WIDTHS, // Spreads breakpoint sizes like sm: '24rem', md: '28rem' etc.
        $arbitrary: true, // Handles arbitrary values like columns-[15em]
    },

    // --- Flexbox & Grid ---
    'justify': {
        $prop: 'justify-content',
        'normal': 'normal',
        'start': 'flex-start',
        'end': { $inherit, '': 'flex-end', 'safe': 'safe flex-end' },
        'center': { $inherit, '': 'center', 'safe': 'safe center' },
        'between': 'space-between',
        'around': 'space-around',
        'evenly': 'space-evenly',
        'stretch': 'stretch',
        'baseline': 'baseline',
    },
    'justify-items': {
        $prop: 'justify-items',
        'normal': 'normal',
        'start': 'start',
        'end': { $inherit, '': 'end', 'safe': 'safe end' },
        'center': { $inherit, '': 'center', 'safe': 'safe center' },
        'stretch': 'stretch',
    },
    'justify-self': {
        $prop: 'justify-self',
        'auto': 'auto',
        'start': 'start',
        'end': { $inherit, '': 'end', 'safe': 'safe end' },
        'center': { $inherit, '': 'center', 'safe': 'safe center' },
        'stretch': 'stretch',
    },
    'content': {
        $prop: 'align-content',
        'normal': 'normal',
        'center': 'center',
        'start': 'flex-start',
        'end': 'flex-end',
        'between': 'space-between',
        'around': 'space-around',
        'evenly': 'space-evenly',
        'baseline': 'baseline',
        'stretch': 'stretch',
        // Content
        'none': { '': 'content: none' },
        $arbitrary: (value, context) => {
            context.$prop = 'content';
            return value;
        }
    },
    'items': {
        $prop: 'align-items',
        'start': 'flex-start',
        'end': { $inherit, '': 'flex-end', 'safe': 'safe flex-end' },
        'center': { $inherit, '': 'center', 'safe': 'safe center' },
        'baseline': { $inherit, '': 'baseline', 'last': 'last baseline' },
        'stretch': 'stretch',
    },
    'self': {
        $prop: 'align-self',
        'auto': 'auto',
        'start': 'flex-start',
        'end': { $inherit, '': 'end', 'safe': 'safe end' },
        'center': { $inherit, '': 'center', 'safe': 'safe center' },
        'stretch': 'stretch',
        'baseline': { $inherit, '': 'baseline', 'last': 'last baseline' },
    },
    'place-content': { // TODO precedence
        $prop: 'place-content',
        'center': { $inherit, '': 'center', 'safe': 'safe center' },
        'start': 'start',
        'end': { $inherit, '': 'end', 'safe': 'safe end' },
        'between': 'space-between',
        'around': 'space-around',
        'evenly': 'space-evenly',
        'baseline': 'baseline',
        'stretch': 'stretch',
    },
    'place-items': {
        $prop: 'place-items',
        'start': 'start',
        'end': { $inherit, '': 'end', 'safe': 'safe end' },
        'center': { $inherit, '': 'center', 'safe': 'safe center' },
        'baseline': 'baseline',
        'stretch': 'stretch',
    },
    'place-self': {
        $prop: 'place-self',
        'auto': 'auto',
        'start': 'start',
        'end': { $inherit, '': 'end', 'safe': 'safe end' },
        'center': { $inherit, '': 'center', 'safe': 'safe center' },
        'stretch': 'stretch',
    },

    'flex': {
        '': 'display: flex',
        'row': 'flex-direction: row',
        'row-reverse': 'flex-direction: row-reverse',
        'col': 'flex-direction: column',
        'col-reverse': 'flex-direction: column-reverse',
        'wrap': 'flex-wrap: wrap',
        'wrap-reverse': 'flex-wrap: wrap-reverse',
        'nowrap': 'flex-wrap: nowrap',
        '1': 'flex: 1 1 0%',
        'auto': 'flex: 1 1 auto',
        'initial': 'flex: 0 1 auto',
        'none': 'flex: none',
        // Legacy
        'grow': 'flex-grow: 1',
        'shrink-0': 'flex-shrink: 0',
    },

    'grow': { $prop: 'flex-grow', '': '1', '0': '0', $num: v => String(v), $arbitrary: true },
    'shrink': { $prop: 'flex-shrink', '': '1', '0': '0', $num: v => String(v), $arbitrary: true },
    'basis': {
        $prop: 'flex-basis',
        ...BREAKPOINT_WIDTHS,
        ...SIZING_KEYWORDS,
        'auto': 'auto',
        $frac,
        $num: TRANSFORMERS.rem,
        $arbitrary: true
    },
    'order': {
        $prop: 'order',
        'first': '-9999',
        'last': '9999',
        'none': '0',
        $num: v => String(v),
        $arbitrary: true,
        $negative: true
    },

    'grid': {
        '': 'display: grid',
        'cols': {
            $prop: 'grid-template-columns',
            'none': 'none',
            'subgrid': 'subgrid',
            $num: v => `repeat(${v}, minmax(0, 1fr))`,
            $arbitrary: true
        },
        'rows': {
            $prop: 'grid-template-rows',
            'none': 'none',
            'subgrid': 'subgrid',
            $num: v => `repeat(${v}, minmax(0, 1fr))`,
            $arbitrary: true
        },
        'flow': {
            $prop: 'grid-auto-flow',
            'row': 'row',
            'col': 'column',
            'dense': 'dense',
            'row-dense': 'row dense',
            'col-dense': 'column dense',
        },
    },
    'auto-cols': {
        $prop: 'grid-auto-columns',
        'auto': 'auto',
        'min': 'min-content',
        'max': 'max-content',
        'fr': 'minmax(0, 1fr)',
        $arbitrary: true,
    },
    'auto-rows': {
        $prop: 'grid-auto-rows',
        'auto': 'auto',
        'min': 'min-content',
        'max': 'max-content',
        'fr': 'minmax(0, 1fr)',
        $arbitrary: true,
    },
    'col': {
        $prop: 'grid-column',
        'auto': 'auto',
        $num: v => String(v), // For col-1, col-2, etc.
        'span': {
            $prop: 'grid-column',
            'full': '1 / -1',
            $num: v => `span ${v} / span ${v}`,
            $arbitrary: true
        },
        'start': {
            $prop: 'grid-column-start',
            'auto': 'auto',
            $num: v => String(v),
            $arbitrary: true
        },
        'end': {
            $prop: 'grid-column-end',
            'auto': 'auto',
            $num: v => String(v),
            $arbitrary: true
        },
    },
    'row': {
        $prop: 'grid-row',
            'auto': 'auto',
        $num: v => String(v), // For row-1, row-2, etc.
        'span': {
            $prop: 'grid-row',
            'full': '1 / -1',
            $num: v => `span ${v} / span ${v}`,
            $arbitrary: true
        },
        'start': {
            $prop: 'grid-row-start',
            'auto': 'auto',
            $num: v => String(v),
            $arbitrary: true
        },
        'end': {
            $prop: 'grid-row-end',
            'auto': 'auto',
            $num: v => String(v),
            $arbitrary: true
        },
    },
    'gap': {
        $prop: 'gap',
        ...SPACING_PADDING_CONFIG,
        'x': {
            $inherit: ['$num', '$arbitrary', '$values', '$prop'],
            $prop: 'column-gap',
        },
        'y': {
            $inherit: ['$num', '$arbitrary', '$values', '$prop'],
            $prop: 'row-gap',
        },
    },

    'hidden': 'display: none',

    // --- Floats & Clear ---
    'float': {
        $prop: 'float',
        $values: ['right', 'left', 'none'],
        'start': 'inline-start',
        'end': 'inline-end',
    },
    'clear': {
        $prop: 'clear',
        $values: ['left', 'right', 'both', 'none'],
        'start': 'inline-start',
        'end': 'inline-end',
    },

    // --- Position ---
    'static': 'position: static',
    'absolute': 'position: absolute',
    'relative': 'position: relative',
    'sticky': 'position: sticky',
    'fixed': 'position: fixed',

    // --- Inset, Top, Right, Bottom, Left ---
    'inset': {
        $prop: 'inset',
        $values: {
            'auto': 'auto',
            'full': '100%',
            'px': '1px',
        },
        $num: TRANSFORMERS.rem,
        $frac,
        $arbitrary: true,
        $negative: true,

        'x': { $inherit, $prop: ['left', 'right'] },
        'y': { $inherit, $prop: ['top', 'bottom'] },
    },
    'top': { $prop: 'top',       'auto': 'auto', 'full': '100%', 'px': '1px', $num: TRANSFORMERS.rem, $frac, $arbitrary: true, $negative: true },
    'right': { $prop: 'right',   'auto': 'auto', 'full': '100%', 'px': '1px', $num: TRANSFORMERS.rem, $frac, $arbitrary: true, $negative: true },
    'bottom': { $prop: 'bottom', 'auto': 'auto', 'full': '100%', 'px': '1px', $num: TRANSFORMERS.rem, $frac, $arbitrary: true, $negative: true },
    'left': { $prop: 'left',     'auto': 'auto', 'full': '100%', 'px': '1px', $num: TRANSFORMERS.rem, $frac, $arbitrary: true, $negative: true },
    'z': { $prop: 'z-index', 'auto': 'auto',$num: (v) => `${v}`, $arbitrary: true, $negative: true },

    // --- Sizing ---
    'size': {
        $prop: ['width', 'height'],
        $frac,
        $num: TRANSFORMERS.rem,
        $arbitrary: true,
        'px': '1px',
        ...SIZING_KEYWORDS,
    },
    'w': {
        $prop: 'width',
        $frac, $num: TRANSFORMERS.rem,
        $arbitrary: true,
        'auto': 'auto',
        'px': '1px',
        ...VIEWPORT_W,
        ...SIZING_KEYWORDS,
    },
    'h': {
        $prop: 'height',
        $frac, $num: TRANSFORMERS.rem,
        $arbitrary: true,
        'auto': 'auto',
        'px': '1px',
        ...VIEWPORT_H,
        ...SIZING_KEYWORDS,
    },
    'min-w': {
        $prop: 'min-width',
        $frac, $num: TRANSFORMERS.rem,
        $arbitrary: true,
        'auto': 'auto',
        ...VIEWPORT_W,
        ...BREAKPOINT_WIDTHS,
        ...SIZING_KEYWORDS,
    },
    'max-w': {
        $prop: 'max-width',
        $frac, $num: TRANSFORMERS.rem,
        $arbitrary: true,
        'none': 'none',
        ...VIEWPORT_W,
        ...BREAKPOINT_WIDTHS,
        ...SIZING_KEYWORDS,
    },
    'min-h': {
        $prop: 'min-height',
        $frac, $num: TRANSFORMERS.rem,
        $arbitrary: true,
        'auto': 'auto',
        'px': '1px',
        'lh': '1lh',
        ...VIEWPORT_H,
        ...SIZING_KEYWORDS,
    },
    'max-h': {
        $prop: 'max-height',
        $frac, $num: TRANSFORMERS.rem,
        $arbitrary: true,
        'none': 'none',
        'px': '1px',
        ...VIEWPORT_H,
        ...SIZING_KEYWORDS,
    },

    'aspect': { $prop: 'aspect-ratio', 'auto': 'auto', 'square': '1 / 1', 'video': '16 / 9', $frac: (v) => v, $arbitrary: true },

    // --- Spacing ---
    'p':  { $prop: 'padding', ...SPACING_PADDING_CONFIG },
    'px': { $prop: ['padding-left', 'padding-right'], ...SPACING_PADDING_CONFIG },
    'py': { $prop: ['padding-top', 'padding-bottom'], ...SPACING_PADDING_CONFIG },
    'pt': { $prop: 'padding-top', ...SPACING_PADDING_CONFIG },
    'pr': { $prop: 'padding-right', ...SPACING_PADDING_CONFIG },
    'pb': { $prop: 'padding-bottom', ...SPACING_PADDING_CONFIG },
    'pl': { $prop: 'padding-left', ...SPACING_PADDING_CONFIG },

    'm':  { $prop: 'margin', ...SPACING_MARGIN_CONFIG },
    'mx': { $prop: ['margin-left', 'margin-right'], ...SPACING_MARGIN_CONFIG },
    'my': { $prop: ['margin-top', 'margin-bottom'], ...SPACING_MARGIN_CONFIG },
    'mt': { $prop: 'margin-top', ...SPACING_MARGIN_CONFIG },
    'mr': { $prop: 'margin-right', ...SPACING_MARGIN_CONFIG },
    'mb': { $prop: 'margin-bottom', ...SPACING_MARGIN_CONFIG },
    'ml': { $prop: 'margin-left', ...SPACING_MARGIN_CONFIG },

    'space': {
        'x': {
            $selector: PREFIX_HANDLERS.child,
            $negative: true,
            'reverse': '--j-space-x-reverse: 1',
            $num: (val) => {
                const rem = TRANSFORMERS.rem(val);
                return `margin-right: calc(${rem} * var(--j-space-x-reverse, 0)); margin-left: calc(${rem} * calc(1 - var(--j-space-x-reverse, 0)));`;
            },
            // Handle arbitrary values like `space-x-[10px]`
            $arbitrary: (val) => {
                return `margin-right: calc(${val} * var(--j-space-x-reverse, 0)); margin-left: calc(${val} * calc(1 - var(--j-space-x-reverse, 0)));`;
            },
        },
        'y': {
            $selector: PREFIX_HANDLERS.child,
            $negative: true,
            'reverse': '--j-space-y-reverse: 1',
            $num: (val) => {
                const rem = TRANSFORMERS.rem(val);
                return `margin-bottom: calc(${rem} * var(--j-space-y-reverse, 0)); margin-top: calc(${rem} * calc(1 - var(--j-space-y-reverse, 0)));`;
            },
            $arbitrary: (val) => {
                return `margin-bottom: calc(${val} * var(--j-space-y-reverse, 0)); margin-top: calc(${val} * calc(1 - var(--j-space-y-reverse, 0)));`;
            },
        }
    },

    // --- Typography ---
    'truncate': 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap',

    'text': {
        // Font Size & Line Height
        'xs': 'font-size: 0.75rem; line-height: 1.3333333',
        'sm': 'font-size: 0.875rem; line-height: 1.4285714',
        'base': 'font-size: 1rem; line-height: 1.5',
        'lg': 'font-size: 1.125rem; line-height: 1.5555555',
        'xl': 'font-size: 1.25rem; line-height: 1.4',
        '2xl': 'font-size: 1.5rem; line-height: 1.3333333',
        '3xl': 'font-size: 1.875rem; line-height: 1.2',
        '4xl': 'font-size: 2.25rem; line-height: 1.1111111',
        '5xl': 'font-size: 3rem; line-height: 1',
        '6xl': 'font-size: 3.75rem; line-height: 1',
        '7xl': 'font-size: 4.5rem; line-height: 1',
        '8xl': 'font-size: 6rem; line-height: 1',
        '9xl': 'font-size: 8rem; line-height: 1',

        // Text Alignment
        'left': 'text-align: left',
        'center': 'text-align: center',
        'right': 'text-align: right',
        'justify': 'text-align: justify',

        // Text Wrapping & Overflow
        'wrap': 'text-wrap: wrap',
        'nowrap': 'text-wrap: nowrap',
        'balance': 'text-wrap: balance',
        'pretty': 'text-wrap: pretty',
        'ellipsis': 'text-overflow: ellipsis',
        'clip': 'text-overflow: clip',

        // Text Color
        $color: (colorName, opacity, context) => {
            context.$prop = 'color'
            if (opacity != null) {
                context.$base = `--j-text-opacity: ${opacity.toFixed(3)}`;
            }
            return generateColorCss(colorName, opacity, '--j-text-opacity');
        },
        'opacity': {
            $prop: '--j-text-opacity',
            $num: TRANSFORMERS.opacity,
            $arbitrary: true,
        },
        $arbitrary: (value, context) => {
            if (looksLikeColor(value)) {
                context.$prop = 'color';
                return value;
            }
            context.$prop = 'font-size';
            return value;
        },
    },

    'align': {
        $prop: 'vertical-align',
        'baseline': 'baseline',
        'top': 'top',
        'middle': 'middle',
        'bottom': 'bottom',
        'text-top': 'text-top',
        'text-bottom': 'text-bottom',
    },

    'font': {
        // Font Family
        'sans': "font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        'serif': "font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
        'mono': "font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        ...FONT_FAMILY_UTILITIES,
        // Font Weight
        'thin': 'font-weight: 100',
        'extralight': 'font-weight: 200',
        'light': 'font-weight: 300',
        'normal': 'font-weight: 400',
        'medium': 'font-weight: 500',
        'semibold': 'font-weight: 600',
        'bold': 'font-weight: 700',
        'extrabold': 'font-weight: 800',
        'black': 'font-weight: 900',

        'stretch': {
            $prop: 'font-stretch',
            $values: [
                'ultra-condensed', // 50%
                'extra-condensed', // 62.5%
                'condensed',       // 75%
                'semi-condensed',  // 87.5%
                'normal',          // 100%
                'semi-expanded',   // 112.5%
                'expanded',        // 125%
                'extra-expanded',  // 150%
                'ultra-expanded',  // 200%
            ],
            $num: v => `${v}%`,
            $arbitrary: true
        },
    },

    // Font Variant Numeric utilities
    'normal-nums': 'font-variant-numeric: normal',
    'ordinal': 'font-variant-numeric: ordinal',
    'slashed-zero': 'font-variant-numeric: slashed-zero',
    'lining-nums': 'font-variant-numeric: lining-nums',
    'oldstyle-nums': 'font-variant-numeric: oldstyle-nums',
    'proportional-nums': 'font-variant-numeric: proportional-nums',
    'tabular-nums': 'font-variant-numeric: tabular-nums',
    'diagonal-fractions': 'font-variant-numeric: diagonal-fractions',
    'stacked-fractions': 'font-variant-numeric: stacked-fractions',

    'leading': {
        $prop: 'line-height',
        'none': '1', 'tight': '1.25', 'snug': '1.375',
        'normal': '1.5', 'relaxed': '1.625', 'loose': '2',
        '': '1.5',
        $num: TRANSFORMERS.rem
    },
    'tracking': {
        $prop: 'letter-spacing',
        'tighter': '-0.05em', 'tight': '-0.025em', 'normal': '0em', 'wide': '0.025em', 'wider': '0.05em', 'widest': '0.1em',
        $arbitrary: true
    },

    'indent': {
        $prop: 'text-indent',
        $num: TRANSFORMERS.rem,
        $negative: true,
        $arbitrary: true,
    },
    'tab': {
        $prop: 'tab-size',
        $num: value => String(value),
        $arbitrary: true,
    },

    'italic': 'font-style: italic',
    'not-italic': 'font-style: normal',

    'uppercase': 'text-transform: uppercase',
    'lowercase': 'text-transform: lowercase',
    'capitalize': 'text-transform: capitalize',

    'underline': 'text-decoration: underline',
    'no-underline': 'text-decoration: none',
    'overline': 'text-decoration: overline',
    'line-through': 'text-decoration: line-through',

    'underline-offset': {
        $prop: 'text-underline-offset',
        $num: TRANSFORMERS.px,
        $arbitrary: true,
        'auto': 'auto',
    },

    'decoration': {
        $prop: 'text-decoration-thickness',

        // Style
        'solid': { '': 'text-decoration-style: solid' },
        'double': { '': 'text-decoration-style: double' },
        'dotted': { '': 'text-decoration-style: dotted' },
        'dashed': { '': 'text-decoration-style: dashed' },
        'wavy': { '': 'text-decoration-style: wavy' },

        // Thickness
        'auto': 'auto',
        'from-font': 'from-font',
        $num: TRANSFORMERS.px,
        $arbitrary: (value, context) => {
            if (looksLikeColor(value)) context.$prop = 'text-decoration-color';
            return value;
        },

        // Color
        $color: (colorName, opacity, context) => {
            context.$prop = 'text-decoration-color';
            return generateColorCss(colorName, opacity);
        },
    },

    'whitespace': {
        $prop: 'white-space',
        $values: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces']
    },

    'break': {
        'normal': 'overflow-wrap: normal; word-break: normal',
        'words': 'overflow-wrap: break-word',
        'all': 'word-break: break-all',
    },

    'line-clamp': {
        'none': compact(`
            overflow: visible;
            display: block;
            -webkit-box-orient: horizontal;
            -webkit-line-clamp: none;
        `),
        $num: (v) => compact(`
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: ${v};
        `),
    },

    'hyphens': { $prop: 'hyphens', $values: ['none', 'manual', 'auto'] },

    'antialiased': '-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale',

    'text-shadow': {
        $prop: 'text-shadow',
        'none': 'none',
        '2xs': '0 1px 0 var(--j-text-shadow-color, rgb(0 0 0 / 0.15))',
        'xs': '0 1px 1px var(--j-text-shadow-color, rgb(0 0 0 / 0.20))',
        'sm': '0 1px 2px var(--j-text-shadow-color, rgb(0 0 0 / 0.15))',
        'md': '0 4px 8px var(--j-text-shadow-color, rgb(0 0 0 / 0.25))',
        'lg': '0 8px 16px var(--j-text-shadow-color, rgb(0 0 0 / 0.30))',
        '': '0 2px 4px var(--j-text-shadow-color, rgb(0 0 0 / 0.25))',
        $color: (colorName, opacity, context) => {
            context.$prop = '--j-text-shadow-color';
            return generateColorCss(colorName, opacity);
        },
        $arbitrary: (value, context) => {
            if (CSS.supports('color', value)) context.$prop = '--j-text-shadow-color';
            return value;
        },
    },

    // --- Lists ---
    'list': {
        'none': 'list-style-type: none',
        'disc': 'list-style-type: disc',
        'decimal': 'list-style-type: decimal',
        'inside': 'list-style-position: inside',
        'outside': 'list-style-position: outside',
    },

    'bg': {
        // --- Color & Opacity (existing logic) ---
        $color: (colorName, opacity, context) => {
            let prop = 'background-color: '
            if (opacity != null) {
                prop = `--j-bg-opacity: ${opacity.toFixed(3)}; ` + prop
            } else {
                context.$base = '--j-bg-opacity: 1'
            }
            return prop + generateColorCss(colorName, opacity, '--j-bg-opacity');
        },
        'opacity': {
            $prop: '--j-bg-opacity',
            $num: TRANSFORMERS.opacity,
        },
        $arbitrary: (value, context) => {
            if (looksLikeColor(value)) {
                context.$prop = 'background-color'
                return value;
            }
            context.$prop = 'background-image';
            return value;
        },

        // --- Background Properties ---
        'none': 'background-image: none',

        'fixed': 'background-attachment: fixed',
        'local': 'background-attachment: local',
        'scroll': 'background-attachment: scroll',

        'blend': {
            $prop: 'background-blend-mode',
            $values: [
                'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
                'color-dodge', 'color-burn', 'hard-light', 'soft-light',
                'difference', 'exclusion', 'hue', 'saturation', 'color',
                'luminosity'
            ],
        },

        'clip': {
            $prop: 'background-clip',
            'border': 'border-box',
            'padding': 'padding-box',
            'content': 'content-box',
            'text': 'text',
        },

        'origin': {
            $prop: 'background-origin',
            'border': 'border-box',
            'padding': 'padding-box',
            'content': 'content-box',
        },

        'center': 'background-position: center',
        'top': { $prop: 'background-position', '': 'top', 'left': 'top left', 'right': 'top right' },
        'bottom': { $prop: 'background-position', '': 'bottom', 'left': 'bottom left', 'right': 'bottom right' },
        'left': 'background-position: left',
        'right': 'background-position: right',

        'repeat': {
            $prop: 'background-repeat',
            '': 'repeat',
            'x': 'repeat-x',
            'y': 'repeat-y',
            'round': 'round',
            'space': 'space',
        },
        'no-repeat': 'background-repeat: no-repeat',

        'auto': 'background-size: auto',
        'cover': 'background-size: cover',
        'contain': 'background-size: contain',


        // --- Gradient Definitions ---

        'gradient-to': {
            $prop: 'background-image',
            't': 'linear-gradient(to top, var(--j-gradient-stops))',
            'b': 'linear-gradient(to bottom, var(--j-gradient-stops))',
            'l': 'linear-gradient(to left, var(--j-gradient-stops))',
            'r': 'linear-gradient(to right, var(--j-gradient-stops))',
            'tl': 'linear-gradient(to top left, var(--j-gradient-stops))',
            'tr': 'linear-gradient(to top right, var(--j-gradient-stops))',
            'bl': 'linear-gradient(to bottom left, var(--j-gradient-stops))',
            'br': 'linear-gradient(to bottom right, var(--j-gradient-stops))',
            $arbitrary: (value) => `linear-gradient(${value}, var(--j-gradient-stops))`
        },
        'radial': {
            $prop: 'background-image',
            '': 'radial-gradient(ellipse, var(--j-gradient-stops))',
        },
        'conic': {
            $prop: 'background-image',
            '': 'conic-gradient(var(--j-gradient-stops))',
        },
    },


    'from': {
        // Sets the starting color AND a default ending color that is a transparent version OF THE STARTING COLOR.
        // It uses modern CSS `rgb(from ...)` syntax to achieve this.
        // It also defines the initial `stops` variable for a two-color gradient.
        $color: (color, opacity) => {
            const fromColor = generateColorCss(color, opacity);
            // This creates a transparent version of the exact 'from' color, preserving the hue.
            const toColor = `rgb(from ${fromColor} r g b / 0)`;
            return compact(`
                --j-gradient-from: ${fromColor};
                --j-gradient-to: ${toColor};
                --j-gradient-stops: var(--j-gradient-from), var(--j-gradient-to);
            `);
        },
        $arbitrary: (value, context) => { // Handle from-[color]
            context.$prop = '--j-gradient-from';
            return value;
        }
    },
    'via': {
        // Inserts a middle color stop and redefines the `stops` variable for a three-color gradient.
        // It also smartly updates the default `to` color to fade from the `via` color.
        $color: (color, opacity) => {
            const viaColor = generateColorCss(color, opacity);
            const toColor = `rgb(from ${viaColor} r g b / 0)`;
            return compact(`
                --j-gradient-via: ${viaColor};
                --j-gradient-to: ${toColor};
                --j-gradient-stops: var(--j-gradient-from), var(--j-gradient-via), var(--j-gradient-to);
            `);
        },
        $arbitrary: (value, context) => { // Handle via-[color]
            context.$prop = '--j-gradient-via';
            return value;
        }
    },
    'to': {
        // TODO: Percentage values do not yield the same result as Tailwind (e.g., bg-gradient-to-r from-indigo-500 to-50)
        // Only sets the final color, overriding any defaults set by `from` or `via`.
        $prop: '--j-gradient-to',
        $color: (color, opacity) => generateColorCss(color, opacity),
        $arbitrary: (value) => value, // Handle to-[color]
    },

    // --- Transforms ---
    'transform': {
        '': BASE_CSS.transform,
        'flat': 'transform-style: flat',
        '3d': 'transform-style: preserve-3d',
    },
    'translate': {
        $base: BASE_CSS.transform,
        $num: TRANSFORMERS.rem,
        $frac,
        $negative: true,
        $arbitrary: true,
        $values: {'full': '100%' },
        'x': { $inherit, $prop: '--j-translate-x' },
        'y': { $inherit, $prop: '--j-translate-y' },
    },

    'scale': {
        $base: BASE_CSS.transform,
        $num: TRANSFORMERS.opacity, // Re-using opacity transformer (v/100) which works perfectly for scale
        $arbitrary: true,
        // The base 'scale' class applies to both X and Y axes
        $prop: ['--j-scale-x', '--j-scale-y'],
        // Axis-specific overrides that inherit the base settings
        'x': { $inherit, $prop: '--j-scale-x' },
        'y': { $inherit, $prop: '--j-scale-y' },
    },

    'rotate': {
        $prop: '--j-rotate',
        $base: BASE_CSS.transform,
        $num: TRANSFORMERS.deg,
        $negative: true,
        $arbitrary: true,
    },

    'skew': {
        $base: BASE_CSS.transform,
        $num: TRANSFORMERS.deg,
        $negative: true,
        $arbitrary: true,
        'x': { $inherit, $prop: '--j-skew-x' },
        'y': { $inherit, $prop: '--j-skew-y' },
    },

    'backface': {
        $prop: 'backface-visibility',
        'visible': 'visible',
        'hidden': 'hidden',
    },
    'perspective': {
        $prop: 'perspective',
        'none': 'none',
        $num: TRANSFORMERS.px,
        $arbitrary: true,
    },

    'transform-style': {
        $prop: 'transform-style',
        'flat': 'flat',
        '3d': 'preserve-3d',
    },

    // --- Transitions & Animation ---
    'transition': {
        $prop: 'transition-property',
        $base: BASE_CSS.transition,
        $arbitrary: true,
        '': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
        'all': 'all',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'opacity': 'opacity',
        'shadow': 'box-shadow',
        'transform': 'transform',
        'none': 'none',
    },

    'duration': {
        $prop: 'transition-duration',
        $num: TRANSFORMERS.ms,
        $arbitrary: true,
    },

    'delay': {
        $prop: 'transition-delay',
        $num: TRANSFORMERS.ms,
        $arbitrary: true,
    },

    'ease': {
        $prop: 'transition-timing-function',
        $values: {
            'linear': 'linear',
            'in': 'cubic-bezier(0.4, 0, 1, 1)',
            'out': 'cubic-bezier(0, 0, 0.2, 1)',
            'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        $arbitrary: true,
    },

    'origin': {
        $prop: 'transform-origin',
        $arbitrary: true,
        'center': 'center',
        'top': 'top',
        'top-right': 'top right',
        'right': 'right',
        'bottom-right': 'bottom right',
        'bottom': 'bottom',
        'bottom-left': 'bottom left',
        'left': 'left',
        'top-left': 'top left',
    },

    // Misc
    'opacity': {
        $prop: 'opacity',
        $num: TRANSFORMERS.opacity,
        $arbitrary: true
    },

    'mix-blend': {
        $prop: 'mix-blend-mode',
        $values: [
            'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
            'color-dodge', 'color-burn', 'hard-light', 'soft-light',
            'difference', 'exclusion', 'hue', 'saturation', 'color',
            'luminosity', 'plus-darker', 'plus-lighter'
        ],
    },

    // --- Shadows ---
    'shadow': {
        $prop: '--j-shadow',
        $base: BASE_CSS.shadow,
        ...SHADOW_MAP,
        // Handle color classes like 'shadow-red-500'
        $color: (colorName, opacity, context) => {
            context.$prop = '--j-shadow-color';
            // The actual shadow map values use this CSS variable
            return generateColorCss(colorName, opacity);
        },
        // Handle arbitrary values like 'shadow-[2px_2px_10px_black]'
        $arbitrary: true,
    },

    'inset-shadow': {
        $prop: '--j-shadow',
        $base: BASE_CSS.shadow,
        ...INSET_SHADOW_MAP,
        // Inset shadows can also have their color changed
        $color: (colorName, opacity, context) => {
            context.$prop = '--j-shadow-color';
            return generateColorCss(colorName, opacity);
        },
        // Prefix arbitrary values with 'inset'
        $arbitrary: (value) => `inset ${value}`,
    },

    'ring': {
        $base: BASE_CSS.shadow,
        // The 'ring' utility can set either width or color depending on the value.
        // Handlers below dynamically set the correct CSS property.

        // Handle 'ring' or 'ring-2' for width
        $num: (value, context) => {
            context.$prop = '--j-ring-width';
            return `${value}px`;
        },
        // Handle bare 'ring' class: defaults to 1px
        $default: (v, ctx) => {
            if (v === '') {
                ctx.$prop = '--j-ring-width';
                return '1px';
            }
        },
        $color: (colorName, opacity, context) => {
            context.$prop = '--j-ring-color';
            if (opacity != null) {
                context.$base += `; --j-ring-opacity: ${opacity.toFixed(3)}`;
            }
            return generateColorCss(colorName, opacity, '--j-ring-opacity');
        },
        'inset': {
            $prop: '--j-ring-inset',
            '': 'inset',
        },
        'opacity': {
            $prop: '--j-ring-opacity',
            $num: TRANSFORMERS.opacity,
            $arbitrary: true,
        },
        'offset': {
            $base: BASE_CSS.shadow,
            // Handles 'ring-offset-2' for width
            $num: (value, context) => {
                context.$prop = '--j-ring-offset-width';
                return `${value}px`;
            },
            // Handles 'ring-offset-red-500' for color
            $color: (color, opacity, context) => {
                context.$prop = '--j-ring-offset-color';
                return generateColorCss(color, opacity);
            },
            // Handle arbitrary width like ring-offset-[10px]
            $arbitrary: (value, context) => {
                context.$prop = '--j-ring-offset-width';
                return value;
            }
        }
    },

    // --- Filters ---
    'filter-none': 'filter: none',

    // A group for all standard filter functions
    'blur': {
        $prop: '--j-blur',
        $base: BASE_CSS.filter,
        ...BLUR_MAP,
        'none': 'blur(0)',
        $arbitrary: (value) => `blur(${value})`,
    },
    'brightness': {
        $prop: '--j-brightness',
        $base: BASE_CSS.filter,
        $num: (v) => `brightness(${TRANSFORMERS.opacity(v)})`,
        $arbitrary: (value) => `brightness(${value})`,
    },
    'contrast': {
        $prop: '--j-contrast',
        $base: BASE_CSS.filter,
        $num: (v) => `contrast(${TRANSFORMERS.opacity(v)})`,
        $arbitrary: (value) => `contrast(${value})`,
    },
    'drop-shadow': {
        $prop: '--j-drop-shadow',
        $base: BASE_CSS.filter,
        ...DROP_SHADOW_MAP,
        $arbitrary: (value) => `drop-shadow(${value})`,
    },
    'grayscale': {
        $prop: '--j-grayscale',
        $base: BASE_CSS.filter,
        '': 'grayscale(100%)', // Default for 'grayscale' class
        $num: (v) => `grayscale(${v}%)`,
        $arbitrary: (value) => `grayscale(${value})`,
    },
    'hue-rotate': {
        $prop: '--j-hue-rotate',
        $base: BASE_CSS.filter,
        $num: (v) => `hue-rotate(${v}deg)`,
        $negative: true,
        $arbitrary: (value) => `hue-rotate(${value})`,
    },
    'invert': {
        $prop: '--j-invert',
        $base: BASE_CSS.filter,
        '': 'invert(100%)', // Default for 'invert' class
        $num: (v) => `invert(${v}%)`,
        $arbitrary: (value) => `invert(${value})`,
    },
    'saturate': {
        $prop: '--j-saturate',
        $base: BASE_CSS.filter,
        $num: (v) => `saturate(${TRANSFORMERS.opacity(v)})`,
        $arbitrary: (value) => `saturate(${value})`,
    },
    'sepia': {
        $prop: '--j-sepia',
        $base: BASE_CSS.filter,
        '': 'sepia(100%)', // Default for 'sepia' class
        $num: (v) => `sepia(${v}%)`,
        $arbitrary: (value) => `sepia(${value})`,
    },

    // --- Backdrop Filters ---
    // A group for all backdrop filter functions, mirrors the standard filters
    'backdrop': {
        'filter': {
            'none': 'backdrop-filter: none',
        },
        'blur': {
            $prop: '--j-backdrop-blur',
            $base: BASE_CSS.backdrop,
            ...BLUR_MAP,
            'none': 'blur(0)',
            $arbitrary: (value) => `blur(${value})`,
        },
        'brightness': {
            $prop: '--j-backdrop-brightness',
            $base: BASE_CSS.backdrop,
            $num: (v) => `brightness(${TRANSFORMERS.opacity(v)})`,
            $arbitrary: (value) => `brightness(${value})`,
        },
        'contrast': {
            $prop: '--j-backdrop-contrast',
            $base: BASE_CSS.backdrop,
            $num: (v) => `contrast(${TRANSFORMERS.opacity(v)})`,
            $arbitrary: (value) => `contrast(${value})`,
        },
        'grayscale': {
            $prop: '--j-backdrop-grayscale',
            $base: BASE_CSS.backdrop,
            '': 'grayscale(100%)',
            $num: (v) => `grayscale(${v}%)`,
            $arbitrary: (value) => `grayscale(${value})`,
        },
        'hue-rotate': {
            $prop: '--j-backdrop-hue-rotate',
            $base: BASE_CSS.backdrop,
            $num: (v) => `hue-rotate(${v}deg)`,
            $negative: true,
            $arbitrary: (value) => `hue-rotate(${value})`,
        },
        'invert': {
            $prop: '--j-backdrop-invert',
            $base: BASE_CSS.backdrop,
            '': 'invert(100%)',
            $num: (v) => `invert(${v}%)`,
            $arbitrary: (value) => `invert(${value})`,
        },
        'saturate': {
            $prop: '--j-backdrop-saturate',
            $base: BASE_CSS.backdrop,
            $num: (v) => `saturate(${TRANSFORMERS.opacity(v)})`,
            $arbitrary: (value) => `saturate(${value})`,
        },
        'sepia': {
            $prop: '--j-backdrop-sepia',
            $base: BASE_CSS.backdrop,
            '': 'sepia(100%)',
            $num: (v) => `sepia(${v}%)`,
            $arbitrary: (value) => `sepia(${value})`,
        },
    },

    'border': {
        $prop: 'border-width',
        $values: {'': '1px'}, // For inherit
        $num: TRANSFORMERS.px,
        //
        // Nested properties now only override what's necessary.
        // They inherit $values, $default, and $arbitrary from 'border'.
        'x': { $inherit, $prop: ['border-left-width', 'border-right-width']},
        'y': { $inherit, $prop: ['border-top-width', 'border-bottom-width']},
        't': { $inherit, $prop: 'border-top-width'},
        'r': { $inherit, $prop: 'border-right-width'},
        'b': { $inherit, $prop: 'border-bottom-width'},
        'l': { $inherit, $prop: 'border-left-width'},

        'solid': { '': 'border-style: solid' },
        'dashed': { '': 'border-style: dashed' },
        'dotted': { '': 'border-style: dotted' },
        'double': { '': 'border-style: double' },
        'none': { '': 'border-style: none' },

        // Handler for color values (e.g., 'border-red-500').
        // This function receives the generated CSS color value and modifies the context.
        $color: (colorName, opacity, context) => {
            context.$base = undefined
            if (Array.isArray(context.$prop)) {
                // e.g., ['border-left-width', 'border-right-width'] -> ['border-left-color', 'border-right-color']
                context.$prop = context.$prop.map(p => p.replace('width', 'color'));
            } else {
                context.$prop = context.$prop.replace('width', 'color');
            }
            if (opacity != null) {
                context.$base = `--j-border-opacity: ${opacity.toFixed(3)}`
            }
            return generateColorCss(colorName, opacity, '--j-border-opacity');
        },
        'opacity': {
            $prop: '--j-border-opacity',
            $num: TRANSFORMERS.opacity,
        },

        // Let's define how to handle arbitrary values like 'border-[2px]' or 'border-[#ccc]'
        $arbitrary: (value, context) => {
            if (looksLikeColor(value)) {
                context.$base = undefined
                if (Array.isArray(context.$prop)) {
                    context.$prop = context.$prop.map(p => p.replace('width', 'color'));
                } else {
                    context.$prop = context.$prop.replace('width', 'color');
                }
            }
            return value;
        },
    },

    'outline': {
        $prop: 'outline-width',
        '': '1px',
        $num:  TRANSFORMERS.px,

        'none':   { '': 'outline-style: none'},
        'solid':  { '': 'outline-style: solid'},
        'dashed': { '': 'outline-style: dashed'},
        'dotted': { '': 'outline-style: dotted'},
        'double': { '': 'outline-style: double'},
        'hidden': { '': 'outline: 2px solid transparent; outline-offset: 2px'},

        'offset': {
            $prop: 'outline-offset',
            $num: TRANSFORMERS.px,
            $negative: true,
            $arbitrary: true,
        },

        $color: (color, opacity, context) => {
            context.$prop = 'outline-color';
            return generateColorCss(color, opacity);
        },

        $arbitrary: (value, context) => {
            if (looksLikeColor(value)) {
                context.$prop = 'outline-color';
            }
            return value;
        },
    },

    'divide': {
        $selector: PREFIX_HANDLERS.child,
        $prop: 'border-style',
        $values: ['solid', 'dashed', 'dotted', 'double', 'none'],

        $color: (colorName, opacity, context) => {
            context.$prop = 'border-color'
            if (opacity != null) {
                context.$base = `--j-divide-opacity: ${opacity.toFixed(3)}`;
            }
            return generateColorCss(colorName, opacity, '--j-divide-opacity');
        },
        'opacity': {
            $selector: PREFIX_HANDLERS.child,
            $prop: '--j-divide-opacity',
            $num: TRANSFORMERS.opacity,
        },

        $arbitrary: (value, context) => {
            if (!looksLikeColor(value)) return null;
            context.$prop = 'border-color';
            return value;
        },

        // Nested utilities for direction and width
        'x': {
            $selector: PREFIX_HANDLERS.child,
            'reverse': '--j-divide-x-reverse: 1',
            // Inherits $selector from parent 'divide'.
            // This handler is specific to width values for 'divide-x-2' etc.
            // Apply border using CSS variables for the reverse logic.
            $num: (width) => `border-left-width: calc(${width}px * calc(1 - var(--j-divide-x-reverse, 0))); border-right-width: calc(${width}px * var(--j-divide-x-reverse, 0))`,
            $default: (v, ctx) => {
                // For `divide-x`
                if (v == '') return ctx.$num(1)
            },
        },
        'y': {
            $selector: PREFIX_HANDLERS.child,
            'reverse': '--j-divide-y-reverse: 1',
            // Inherits $selector from parent 'divide'.
            $num: (width) => `border-top-width: calc(${width}px * calc(1 - var(--j-divide-y-reverse, 0))); border-bottom-width: calc(${width}px * var(--j-divide-y-reverse, 0))`,
            $default: (v, ctx) => {
                // For `divide-y`
                if (v == '') return ctx.$num(1)
            },
        },
    },

    'rounded': {
        $prop: 'border-radius',
        $values: BORDER_RADIUS_SCALE,
        $num: TRANSFORMERS.rem,
        // Allows arbitrary values like rounded-[11px]. Parser just uses the raw value.
        $arbitrary: true,

        // Nested utilities inherit $values, $num and $arbitrary:true. Much cleaner!
        't': { $inherit, $prop: ['border-top-left-radius', 'border-top-right-radius'] },
        'r': { $inherit, $prop: ['border-top-right-radius', 'border-bottom-right-radius'] },
        'b': { $inherit, $prop: ['border-bottom-left-radius', 'border-bottom-right-radius'] },
        'l': { $inherit, $prop: ['border-top-left-radius', 'border-bottom-left-radius'] },
        'tl': { $inherit, $prop: 'border-top-left-radius' },
        'tr': { $inherit, $prop: 'border-top-right-radius' },
        'bl': { $inherit, $prop: 'border-bottom-left-radius' },
        'br': { $inherit, $prop: 'border-bottom-right-radius' },
    },

    'overflow': {
        $prop: 'overflow',
        $values: ['auto', 'hidden', 'clip', 'visible', 'scroll'],
        'x': { $inherit, $prop: 'overflow-x' },
        'y': { $inherit, $prop: 'overflow-y' }
    },

    // --- Animations ---
    'animate': {
        $prop: 'animation',
        'none': 'none',
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'fade': 'fade 1s ease-in-out infinite', // non-tailwind
        $arbitrary: true
    },

    // --- Interactivity ---
    'accent': {
        $prop: 'accent-color',
        $color: (colorName, opacity) => generateColorCss(colorName, opacity),
        $arbitrary: true,
    },
    'caret': {
        $prop: 'caret-color',
        $color: (colorName, opacity) => generateColorCss(colorName, opacity),
        $arbitrary: true,
    },
    'placeholder': {
        $prop: 'color',
        $selector: PREFIX_HANDLERS.placeholder,
        $color: (colorName, opacity) => generateColorCss(colorName, opacity),
        $arbitrary: true,
    },
    'cursor': {
        $prop: 'cursor',
        $values: [
            'auto', 'default', 'pointer', 'wait', 'text', 'move', 'help', 'not-allowed', 'none',
            'context-menu', 'progress', 'cell', 'crosshair', 'vertical-text', 'alias', 'copy',
            'no-drop', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize',
            'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize',
            'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out'
        ],
    },
    'select': {
        $prop: 'user-select',
        $values: ['none', 'text', 'auto', 'all'],
    },
    'appearance-none': 'appearance: none',
    'resize': {
        $prop: 'resize',
        '': 'both',
        'x': 'horizontal',
        'y': 'vertical',
        'none': 'none',
    },
    'pointer-events': {
        $prop: 'pointer-events',
        $values: ['none', 'auto'],
    },
    'touch' : {
        $prop: 'touch-action',
        $values: ["auto", "none", "pan-x", "pan-left", "pan-right", "pan-y", "pan-up", "pan-down", "pinch-zoom", "manipulation"]
    },

    // --- Scroll ---
    'scroll-smooth': 'scroll-behavior: smooth',
    'scroll-auto': 'scroll-behavior: auto',
    'snap': {
        // scroll-snap-type
        'none': 'scroll-snap-type: none',
        'x': 'scroll-snap-type: x var(--j-scroll-snap-strictness, proximity)',
        'y': 'scroll-snap-type: y var(--j-scroll-snap-strictness, proximity)',
        'both': 'scroll-snap-type: both var(--j-scroll-snap-strictness, proximity)',
        // Strictness
        'mandatory': '--j-scroll-snap-strictness: mandatory',
        'proximity': '--j-scroll-snap-strictness: proximity',
        // scroll-snap-align
        'start': 'scroll-snap-align: start',
        'end': 'scroll-snap-align: end',
        'center': 'scroll-snap-align: center',
        'align-none': 'scroll-snap-align: none',
        // scroll-snap-stop
        'normal': 'scroll-snap-stop: normal',
        'always': 'scroll-snap-stop: always',
    },
    'overscroll': {
        $prop: 'overscroll-behavior',
        $values: ['auto', 'contain', 'none'],
        'x': { $inherit, $prop: 'overscroll-behavior-x' },
        'y': { $inherit, $prop: 'overscroll-behavior-y' },
    },

    // Scroll Margin
    'scroll-m':  { $prop: 'scroll-margin', ...SPACING_MARGIN_CONFIG },
    'scroll-mx': { $prop: ['scroll-margin-left', 'scroll-margin-right'], ...SPACING_MARGIN_CONFIG },
    'scroll-my': { $prop: ['scroll-margin-top', 'scroll-margin-bottom'], ...SPACING_MARGIN_CONFIG },
    'scroll-mt': { $prop: 'scroll-margin-top', ...SPACING_MARGIN_CONFIG },
    'scroll-mr': { $prop: 'scroll-margin-right', ...SPACING_MARGIN_CONFIG },
    'scroll-mb': { $prop: 'scroll-margin-bottom', ...SPACING_MARGIN_CONFIG },
    'scroll-ml': { $prop: 'scroll-margin-left', ...SPACING_MARGIN_CONFIG },
    // Scroll Padding
    'scroll-p':  { $prop: 'scroll-padding', ...SPACING_PADDING_CONFIG },
    'scroll-px': { $prop: ['scroll-padding-left', 'scroll-padding-right'], ...SPACING_PADDING_CONFIG },
    'scroll-py': { $prop: ['scroll-padding-top', 'scroll-padding-bottom'], ...SPACING_PADDING_CONFIG },
    'scroll-pt': { $prop: 'scroll-padding-top', ...SPACING_PADDING_CONFIG },
    'scroll-pr': { $prop: 'scroll-padding-right', ...SPACING_PADDING_CONFIG },
    'scroll-pb': { $prop: 'scroll-padding-bottom', ...SPACING_PADDING_CONFIG },
    'scroll-pl': { $prop: 'scroll-padding-left', ...SPACING_PADDING_CONFIG },

    // --- SVG ---
    'fill': {
        $prop: 'fill',
        'none': 'none',
        $color: (colorName, opacity) => generateColorCss(colorName, opacity),
        $arbitrary: true,
    },
    'stroke': {
        'none': 'stroke: none',
        $num: (value, context) => {
            context.$prop = 'stroke-width';
            return `${value}px`;
        },
        $color: (colorName, opacity, context) => {
            context.$prop = 'stroke';
            return generateColorCss(colorName, opacity);
        },
        $arbitrary: (value, context) => {
            if (looksLikeColor(value)) {
                context.$prop = 'stroke';
            } else {
                context.$prop = 'stroke-width';
            }
            return value;
        },
    },

    // --- Content & Objects ---
    'object': {
        'contain': 'object-fit: contain',
        'cover': 'object-fit: cover',
        'fill': 'object-fit: fill',
        'none': 'object-fit: none',
        'scale-down': 'object-fit: scale-down',

        'bottom': 'object-position: bottom',
        'center': 'object-position: center',
        'left': 'object-position: left',
        'right': 'object-position: right',
        'top': 'object-position: top',
        'left-top': 'object-position: left top',
        'right-top': 'object-position: right top',
        'left-bottom': 'object-position: left bottom',
        'right-bottom': 'object-position: right bottom',
    },

    // --- Accessibility ---
    'sr-only': compact(`
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    `),
    'not-sr-only': compact(`
        position: static;
        width: auto;
        height: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        clip: auto;
        white-space: normal;
    `),

    // --- Tables ---
    'table': {
        'auto': 'table-layout: auto',
        'fixed': 'table-layout: fixed',
    },
    'caption': {
        $prop: 'caption-side',
        $values: ['top', 'bottom'],
    },
    'border-collapse': 'border-collapse: collapse',
    'border-separate': 'border-collapse: separate',
    'border-spacing': {
        $prop: ['--j-border-spacing-x', '--j-border-spacing-y'],
        $base: BASE_CSS.borderSpacing,
        $values: {
            'px': '1px',
        },
        $num: TRANSFORMERS.rem,
        $arbitrary: true,

        'x': {
            $inherit,
            $prop: '--j-border-spacing-x',
        },

        'y': {
            $inherit,
            $prop: '--j-border-spacing-y',
        },
    },
};

// =========================================================================
// J-CSS EXTENSIONS
// =========================================================================

// Recursively merge plain object branches; replace all other values
const merge = (a, b) => Object.entries(b ?? {}).reduce((a, [k, v]) => (
    a[k] = v?.constructor === Object && a[k]?.constructor === Object
        ? merge(a[k], v)
        : v,
    a
), a);

// Apply startup extensions before utility resolution and caching begin
for (const ext of J.cssExtensions ?? []) {
    addColors(ext.colors);
    merge(UTILITY_CONFIG, ext.utilities);
    Object.assign(PREFIX_HANDLERS, ext.prefixes);
}

const cssWarn = (token, message) => {
    if (
        J.CSSWarnings !== false &&
        (typeof J.CSSWarnings !== 'function' || J.CSSWarnings(token, message))
    ) console.warn(message);
};

// =========================================================================
// =========================================================================

function _resolveUtility(className) {
    // Stage 0: Handle prefixes like `!` (important) and `-` (negative).
    const isImportant = className.startsWith('!');
    const classNameWithoutImportant = isImportant ? className.substring(1) : className;

    const isNegative = classNameWithoutImportant.startsWith('-');
    const baseClassName = isNegative ? classNameWithoutImportant.substring(1) : classNameWithoutImportant;

    // Stage 1: Parse for arbitrary values, e.g., 'p-[3px]'.
    const arbitraryStart = baseClassName.indexOf('-[');
    const isArbitrary =
        arbitraryStart > 0 &&
        baseClassName.endsWith(']') &&
        arbitraryStart + 2 < baseClassName.length - 1;

    // For 'p-[3px]', utilityPath is 'p', valuePart is '3px'
    const utilityPath = isArbitrary
        ? baseClassName.slice(0, arbitraryStart)
        : baseClassName;

    // Stage 2: Traverse the config tree to find the correct configuration
    const utilityPathParts = utilityPath.split('-');
    let remainingPath = '';
    let prevConfig = {};
    let config = UTILITY_CONFIG;
    let consumedParts = 0;

    // The path records the declaration order of every matched config key.
    // It is later used to produce a deterministic CSS cascade order.
    const utilityOrder = [];

    for (let i = 0; i < utilityPathParts.length; i++) {
        const part = utilityPathParts[i];
        const nextPart = utilityPathParts[i + 1];

        let matchedKey = part;
        // Try to match a two-part key first (e.g., 'gradient-to')
        if (nextPart && hasOwn(config, `${part}-${nextPart}`)) {
            matchedKey = `${part}-${nextPart}`;
            i++;
        }

        const hasMatch = hasOwn(config, matchedKey);
        const nextNode = hasMatch && config[matchedKey]

        if (hasMatch) {
            // Meta keys may create gaps in the indices, but do not affect ordering
            utilityOrder.push(Object.keys(config).indexOf(matchedKey));
        }

        // If a valid config object was found, descend
        if (
            nextNode !== null &&
            typeof nextNode === 'object' &&
            !Array.isArray(nextNode)
        ) {
            prevConfig = config;
            config = nextNode;
            consumedParts = i + 1;
        } else {
            // No deeper path found, the rest of the class name is the value
            remainingPath = utilityPathParts.slice(consumedParts).join('-')
            break
        }
    }

    // Arbitrary value must immediately follow a fully resolved utility path. Reject text-xl-[1]
    if (isArbitrary && remainingPath !== '') {
        return null;
    }

    // Stage 2.5: Merge final config node's properties.
    const context = { $prop: '' }; // Default state.

    // Explicitly inherit meta-properties from the current level if '$inherit' is defined.
    // A config level must specify which of its meta-keys should be passed down to its children.
    if (config.$inherit) {
        for (const key of config.$inherit) {
            if (hasOwn(prevConfig, key)) {
                context[key] = prevConfig[key];
            }
        }
    }

    // After traversal, `config` holds the deepest matched config node (e.g., the `p` object for `p-4`).
    // Its own meta-properties (`$prop`, `$default`, etc.) are the most specific and must be applied.
    if (typeof config === 'object' && config !== null) {
        for (const key in config) {
            if (key.startsWith('$')) {
                // Overwrite any inherited values with the more specific ones from this node.
                // For example, for `border-t`, this will set `$prop` to `border-top-width`,
                // overwriting the inherited `border-width`.
                context[key] = config[key];
            }
        }
    }

    // The value part is whatever is left in 'remainingPath' after traversing the config tree.
    // For 'rounded', remainingPath becomes ''.
    // For 'rounded-md', remainingPath becomes 'md'.
    // For 'bg-red-500', remainingPath becomes 'red-500'.
    let valuePart = isArbitrary
        ? baseClassName
            .slice(arbitraryStart + 2, -1)
            // 1fr_2fr                    → 1fr 2fr
            // 0_4px_10px_black           → 0 4px 10px black
            // url(my__image.png)         → url(my_image.png)
            // var(--my__color)           → var(--my_color)
            .replace(/__|_/g, v => v === '__' ? '_' : ' ')
        : remainingPath;


    // Stage 3: Generate the CSS value based on the resolved config.

    // Handle negative values properly
    let negateResolvedValue = false;
    if (isNegative) {
        if (!context.$negative) {
            return null; // This utility doesn't support negative values
        }

        if ([config, context.$values].some(
            map => map &&
                typeof map === 'object' &&
                !Array.isArray(map) &&
                hasOwn(map, valuePart)
        )) {
            // full -> 100%, then invert result
            negateResolvedValue = true;
        } else {
            // Prepend '-' to the value that will be processed.
            // This works for both numeric ('4' -> '-4') and arbitrary ('[10px]' -> '-10px') values.
            valuePart = `-${valuePart}`;
        }
    }

    let cssValue = null;

    if (isArbitrary) {
        // For arbitrary values like `p-[3px]`, `valuePart` is '3px' (or '-3px' if negative).
        if (typeof context.$arbitrary === 'function') {
            cssValue = context.$arbitrary(valuePart, context);
        } else if (context.$arbitrary === true) {
            cssValue = valuePart;
        }
    } else if (typeof config === 'string') {
        // Case 1: The final matched config is a direct CSS rule.
        // E.g., for 'block', `config` is 'display: block'.
        cssValue = config;
    } else if (typeof config === 'object' && config !== null && hasOwn(config, valuePart)) {
        // Case 2: The value is a key in the final config object.
        // E.g., for 'blur-sm', `config` is the blur object, `valuePart` is 'sm'.
        // We get the value from `config['sm']`.
        cssValue = config[valuePart];
    } else if (context.$values) {
        // Case 3: The value is defined in the $values lookup table or whitelist.
        if (Array.isArray(context.$values) && context.$values.includes(valuePart)) {
            // Case 3a: $values is just a whitelist array
            cssValue = valuePart;
        } else if (typeof context.$values === 'object' && !Array.isArray(context.$values)) {
            // Case 3b: $values is a map object: { sm: '0.5rem', lg: '1rem' }
            cssValue = context.$values[valuePart];
        }
    }

    // If no direct match was found, try resolving using functions
    if (cssValue == null) {
        const parts = valuePart.split('/')
        // Case 4: Check if it's a known color keyword (e.g., 'border-white').
        // We check the base color name, ignoring any opacity modifier like '/50'.
        if (typeof context.$color === 'function' && colorMap.has(parts[0])) {
            const opacity = parts[1] ? Number(parts[1])/100 : null;
            if (isNaN(opacity)) return null
            cssValue = context.$color(parts[0], opacity, context);
        }
        // Case 5: Handle fractional values like '1/2' if $frac handler exists.
        else if (typeof context.$frac === 'function' && parts.length > 1) {
            cssValue = context.$frac(valuePart, context);
        }
        // Case 5: The value part is numeric ('4', '1.5', '-10') and a specific '$num' handler exists.
        // e.g., for 'p-4', this calls the function provided in $num.
        else if (typeof context.$num === 'function' && valuePart !== '' && !isNaN(Number(valuePart))) {
            cssValue = context.$num(valuePart, context)
        }
        // Case 6: Fallback to a generic handler function.
        // E.g., for 'p-4', $default('4').
        else if (typeof context.$default === 'function') {
            cssValue = context.$default(valuePart, context);
        }
    }

    if (cssValue == null) return null; // No valid CSS could be generated

    // Negate named values after resolution, e.g. `full` -> `100%` -> `-100%`
    if (negateResolvedValue) {
        const value = String(cssValue).trim();
        if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?[a-z%]*$/i.test(value))
            return null;
        cssValue = value[0] === '-'
            ? value.slice(1)
            : `-${value.replace(/^\+/, '')}`;
    }

    // Stage 4: Format the final rule
    const importantSuffix = isImportant ? ' !important' : '';
    const prop = context.$prop;

    if (Array.isArray(prop)) {
        // Apply to each property in the array.
        cssValue = prop.map(p => `${p}: ${cssValue}${importantSuffix};`).join(' ');
    } else if (prop?.length > 0) {
        // Apply to the single property.
        cssValue = `${prop}: ${cssValue}${importantSuffix};`;
    } else {
        // Value is a full CSS rule string like `display: block` or multiple rules like for `sr-only`
        if (isImportant) {
            cssValue = cssValue
                .split(';')
                .filter(declaration => declaration.trim()) // handle trailing semicolons
                .map(declaration => `${declaration.trim()}${importantSuffix}`)
                .join('; ') + ';';
        } else {
                cssValue += ';';
        }
    }

    // Ensure the base string always ends with a semicolon
    const base = (context.$base && !context.$base.endsWith(';'))
        ? `${context.$base};`
        : context.$base;

    return {
        css: cssValue.trim(),
        base,
        selector: context.$selector,
        order: utilityOrder,
    };
}


const cssGenerationCache = new Map();

// Parses a utility class name and generates the corresponding CSS rules.
function resolveUtility(className) {
    if (!cssGenerationCache.has(className)) {
        cssGenerationCache.set(className, _resolveUtility(className))
    }
    return cssGenerationCache.get(className);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Splits a selector list only on top-level commas
// Like:
//   :is(.a, .b)
//   [data-value="a,b"]
function splitSelectorList(s) {
    const out = [];
    let start = 0, depth = 0, quote = '', escaped = false;

    for (let i = 0; i < s.length; i++) {
        const c = s[i];

        if (escaped) { escaped = false; continue; }
        if (c === '\\') { escaped = true; continue; }
        if (quote) { if (c === quote) quote = ''; continue; }
        if (c === '"' || c === "'") { quote = c; continue; }
        if (c === '(' || c === '[') depth++;
        else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
        else if (c === ',' && depth === 0) {
            out.push(s.slice(start, i).trim());
            start = i + 1;
        }
    }

    out.push(s.slice(start).trim());
    return out.filter(Boolean);
}

// A transformer may expand one selector into a selector list, as `marker`,
// `selection`, `group-*` and `peer-*` handlers do. Split that returned list
// again so subsequent variants are applied to every generated selector
const applySelectorHandler = (selectors, handler) =>
    selectors.flatMap(s => splitSelectorList(handler(s)));

const splitVariants = s =>
    s.match(/(?:\[[^\]]*]|[^:])+/g) ?? [];

/**
 * The core CSS generation logic, refactored from compileCss.
 * It takes a map of selectors to utility classes and returns the compiled CSS string.
 * @param {Map<string, string[]>} rules - A map where keys are CSS selectors and values are arrays of utility classes.
 * @param {string | null} [scopeClass=null] - An optional scoping class (e.g., '.j-css-1') to prepend to selectors.
 * @returns {string} The compiled CSS.
 */
function generateCssFromRules(rules, scopeClass = null) {
    // {'lg': {'.j-css-1 div:hover': ["background-color: var(--red-500);"]}}
    const groupByWrapper = new Map([['noWrapper', new Map()]])
    const wrappersByKey = new Map([['noWrapper', []]])

    for (const [rawSelector, selectorRule] of rules.entries()) {

        // Preserve commas nested inside :is(), :not(), attributes, etc
        const baseSelectorParts = splitSelectorList(rawSelector)
        if (scopeClass) {
            // Logic for <css> tags - add scope selector
            for (let i = 0; i < baseSelectorParts.length; i++) {
                const part = baseSelectorParts[i].trim();
                baseSelectorParts[i] = part.includes('&') ? part.replaceAll('&', scopeClass) : `${scopeClass} ${part}`;
            }
        }

        for (const utilityWithPrefix of selectorRule) {
            // Get own selectors copy for modification per utility
            let selectorParts = Array.from(baseSelectorParts)

            const prefixList = splitVariants(utilityWithPrefix)
            const utility = prefixList.pop()

            // Apply `dark` last so it remains the outer selector context:
            // `dark:group-hover:*` → `html.dark .group:hover ...`,
            // `dark:peer-focus:*`  → `html.dark .peer:focus ~ ...`.
            prefixList.sort((a, b) => (a === 'dark') - (b === 'dark'));

            const ruleWrappers = [];
            const wrapperPrefixes = [];

            // Apply all prefix handlers from the key (e.g., from "dark:hover")
            for (const prefix of prefixList) {
                const handlerConfig = getPrefixHandler(prefix);
                if (!handlerConfig) {
                    cssWarn(utilityWithPrefix, `[j-css] Skipped unknown prefix '${prefix}' in "${utilityWithPrefix}"`)
                    continue
                }
                if (handlerConfig.type === 'pseudo') {
                    selectorParts = applySelectorHandler(selectorParts, handlerConfig.handler)
                } else { // 'wrapper'
                    ruleWrappers.push(handlerConfig.handler);
                    wrapperPrefixes.push(prefix);
                }
            }

            const wrapperKey = wrapperPrefixes.length
                ? JSON.stringify(wrapperPrefixes)
                : 'noWrapper';

            if (!groupByWrapper.has(wrapperKey)) {
                groupByWrapper.set(wrapperKey, new Map());
                wrappersByKey.set(wrapperKey, ruleWrappers);
            }

            // This map will group CSS declarations by their final, transformed selector.
            // Key: a string like '.my-class:hover' or '.my-class::placeholder'
            // Value: a Set of CSS declarations like 'color: red;'
            const declarationsBySelectorByWrapper = groupByWrapper.get(wrapperKey);

            // Add declarations from utility classes
            const resolved = resolveUtility(utility);
            if (resolved) {

                // Apply the utility's selector function (e.g., identity, child selector, pseudo-element)
                if (resolved.selector) {
                    selectorParts = applySelectorHandler(selectorParts, resolved.selector.handler)
                }
                const finalSelector = selectorParts.join(',')

                // If the rule has a $base, add it to the SAME wrapper with all pseudo-classes,
                // but wrap it in :where() to drop its specificity to 0
                if (resolved.base) {
                    const supportBaseSelector = `:where(${finalSelector})`;
                    if (!declarationsBySelectorByWrapper.has(supportBaseSelector)) {
                        declarationsBySelectorByWrapper.set(supportBaseSelector, new Set());
                    }
                    declarationsBySelectorByWrapper.get(supportBaseSelector).add(resolved.base);
                }

                // Main utility rule with normal specificity
                if (!declarationsBySelectorByWrapper.has(finalSelector)) {
                    declarationsBySelectorByWrapper.set(finalSelector, new Set());
                }
                declarationsBySelectorByWrapper.get(finalSelector).add(resolved.css);
            } else {
                const relevantSelector = scopeClass ? `selector="${rawSelector}"` : `class="${utility}"`;
                cssWarn(utility, `[j-css] Unknown class "${utility}" found on ${relevantSelector}`)
            }
        }
    }

    // Generate CSS rules for each final selector group for each wrapper group.
    const finalCssChunks = [];
    for (const [wrapper, declarationsBySelector] of groupByWrapper.entries()) {
        const group = []
        for (const [ruleSelector, declarations] of declarationsBySelector.entries()) {
            if (declarations.size > 0) {
                group.push(`${ruleSelector} { ${[...declarations].join(' ')} }\n`);
            }
        }
        const wrappers = wrappersByKey.get(wrapper);
        let groupStr = group.join('');
        for (let i = wrappers.length - 1; i >= 0; i--) {
            groupStr = wrappers[i](`\n  ${groupStr}`);
        }
        if (wrappers.length) groupStr += '\n';

        finalCssChunks.push(groupStr)
    }
    return finalCssChunks.join('');
}


const DYNAMIC_VARIANT_STATES = new Set([
    'open',
    'hover',
    'focus',
    'focus-within',
    'focus-visible',
    'active',
    'visited',
    'target',
    'disabled',
    'enabled',
    'checked',
    'indeterminate',
    'placeholder-shown',
    'autofill',
    'required',
    'valid',
    'invalid',
    'in-range',
    'out-of-range',
    'read-only',
]);

// Matches the generated scope class inside a scoped component selector
const SCOPE_REGEX = /(\.j-css-[\w-]+)/;

// Handles static prefixes (e.g. `hover`, `md`) and dynamic ones (e.g. `group-focus`, `peer-checked`)
function _getPrefixHandler(prefix) {
    // Static prefixes are defined directly in PREFIX_HANDLERS
    if (hasOwn(PREFIX_HANDLERS, prefix)) {
        return PREFIX_HANDLERS[prefix];
    }

    // data-[state=open]:block
    // aria-[current=page]:font-bold
    const attributeMatch = prefix.match(/^(data|aria)-\[(.+)]$/);
    if (attributeMatch) {
        const [, namespace, rawExpression] = attributeMatch;

        const expression = rawExpression.replace(
            /__|_/g,
            value => value === '__' ? '_' : ' '
        );

        const match = expression.match(/^([\w-]+)(?:=(.*))?$/s);
        if (!match) return null;

        const [, name, value] = match;
        const attribute = `${namespace}-${name}`;

        const suffix = value === undefined
            ? `[${attribute}]`
            : `[${attribute}="${value
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')}"]`;

        return {
            type: 'pseudo',
            handler: selector => `${selector}${suffix}`,
        };
    }

    // Arbitrary variant like [&>p]:mt-4
    // Replaces underscores with spaces (except double underscores '__').
    if (
        prefix.length > 2 &&
        prefix.startsWith('[') &&
        prefix.endsWith(']')
    ) {
        const template = prefix
            .slice(1, -1)
            .replace(/__|_/g, v => v === '__' ? '_' : ' ');

            return {
                type: 'pseudo',
                handler(selector) {
                    return template.includes('&')
                        ? template.replaceAll('&', () => selector)
                        : `${template} ${selector}`;
                },
            };
    }

    const dynamicMatch = prefix.match(/^(group|peer)-(.*)$/);
    if (!dynamicMatch) return null;
    const [, type, state] = dynamicMatch;

    if (!DYNAMIC_VARIANT_STATES.has(state)) return null;
    const suffix = (state === 'open')  ?  '[open]'  : `:${state}`;

    const modifierSelector = `.${type}${suffix}`;

    return {
        type: 'pseudo',

        handler(selector) {
            const generatedSelectors = new Set();

            for (const item of splitSelectorList(selector)) {
                const currentSelector = item.trim();
                if (!currentSelector) continue;

                const hasScope = SCOPE_REGEX.test(currentSelector);

                if (type === 'group') {
                    // The group may be outside the component scope
                    // `.j-css-1 svg`  ->  `.group:hover .j-css-1 svg`
                    generatedSelectors.add(`${modifierSelector} ${currentSelector}`);
                    if (hasScope) {
                        // Also support the group on the scope root or inside the scope
                        // `.j-css-1 svg`  ->  `.j-css-1.group:hover svg`
                        generatedSelectors.add(currentSelector.replace(SCOPE_REGEX, `$1${modifierSelector}`));
                        generatedSelectors.add(currentSelector.replace(SCOPE_REGEX, `$1 ${modifierSelector}`));
                    }
                } else {
                    if (!hasScope) {
                        // A global peer utility targets a following sibling
                        // `.peer-checked\:block`  ->  `.peer:checked ~ .peer-checked\:block`
                        generatedSelectors.add(`${modifierSelector} ~ ${currentSelector}`);
                    } else {
                        // Insert the peer before the final target in a scoped selector
                        // `.j-css-1 label`  ->  `.j-css-1 .peer:checked ~ label`
                        const parts = currentSelector.split(/\s+/);
                        if (parts.length > 1) {
                            const target = parts.pop();
                            const base = parts.join(' ');
                            generatedSelectors.add(`${base} ${modifierSelector} ~ ${target}`);
                        }
                        // The scope root itself may also be the peer
                        // `.j-css-1 label`  ->  `.j-css-1.peer:checked label`
                        generatedSelectors.add(currentSelector.replace(SCOPE_REGEX, `$1${modifierSelector}`));
                    }
                }
            }

            return [...generatedSelectors].join(', ');
        }
    };
}


const prefixHandlerCache = new Map();
function getPrefixHandler(prefix) {
    if (!prefixHandlerCache.has(prefix)) {
        prefixHandlerCache.set(prefix, _getPrefixHandler(prefix));
    }
    return prefixHandlerCache.get(prefix);
}

// This regex uses named capture groups to identify either a native CSS block OR a custom rule in one go.
// (?<native_block>...) - Captures a native CSS block like `selector { body }`.
//   (?<native_selector>[^;{}]+?) - Non-greedily captures the selector part.
//   \{(?<native_body>[\s\S]*?)\} - Captures the body inside the braces.
// | - OR
// (?<custom_rule>[^;{}]+?:\s*[^;{}]+?;) - Captures a custom rule like `selector: classes;`.
const CSS_PARSE_PATTERN = /(?<native_block>(?<native_selector>[^;{}]+?)\s*\{(?<native_body>[\s\S]*?)\})|(?<custom_rule>[^;{}]+?:\s*[^;{}]+?;)/g;

// Matches /* block */, // line comments (requires trailing whitespace to preserve URLs like http://), and <!-- HTML comments -->
const CSS_STRIP_COMMENTS = /\/\*[\s\S]*?\*\/|\/\/[ \t]+[^\r\n]*|<!--[\s\S]*?-->/g;

/**
 * Parses the custom text format and compiles it into standard CSS.
 * It supports grouping prefixes at the line level, e.g., 'selector:prefix: class1 class2',
 * while correctly handling selectors that contain colons, like '[data-state:open]'.
 * @param {string} text - The content of the style tag.
 * @param {string} scopeClass - The unique class for component scoping (e.g., '.j-css-1').
 * @returns {string} The compiled, standard CSS.
*/
function compileCss(text, scopeClass) {
    // First, remove all CSS-style comments to prevent parsing errors
    const cleanedText = text.replace(CSS_STRIP_COMMENTS, '');
    const rules = new Map();
    const nativeCssBlocks = [];

    for (const match of cleanedText.matchAll(CSS_PARSE_PATTERN)) {
        const { native_selector, native_body, custom_rule } = match.groups;

        // Case 1: A native CSS block was found.
        if (native_selector !== undefined) {
            const trimmedSelector = native_selector.trim();
            if (trimmedSelector) {
                // Re-scope native CSS selectors with the component's unique scope class
                const scopedSelector = splitSelectorList(trimmedSelector)
                    .map(s => s.includes('&')
                         ? s.replaceAll('&', () => scopeClass)
                         : `${scopeClass} ${s}`
                    )
                    .join(', ');
                nativeCssBlocks.push(`${scopedSelector} {${native_body}}`);
            }
        }
        // Case 2: A custom rule was found.
        else if (custom_rule) {
            const trimmedLine = custom_rule.trim().slice(0, -1); // Remove trailing ';'
            if (!trimmedLine) continue;

            // Split the line into two parts on the first colon followed by a space.
            // This is a reliable way to separate the selector/prefix part from the utility class list.
            const parts = trimmedLine.split(/:\s+/, 2);
            if (parts.length < 2) {
                cssWarn(trimmedLine, `[j-css] Can't parse line '${trimmedLine}', no ': ' found`)
                continue
            };

            const selectorAndPrefixes = parts[0];
            const classesString = parts[1];

            const selectorParts = selectorAndPrefixes.split(':');
            let firstPrefixIndex = selectorParts.length;

            // To distinguish between a selector with a colon (e.g. `[data-state:open]`) and a group prefix (`dark:`),
            // we iterate backwards from the end of the parts.
            // We find the first part that is NOT a known prefix handler. Everything from that point to the
            // beginning is the selector. Everything after is a group prefix.
            // We start from `i > 0` because the very first part is always considered part of the selector.
            for (let i = selectorParts.length - 1; i > 0; i--) {
                const part = selectorParts[i];
                if (getPrefixHandler(part)) {
                    // This part is a valid prefix, so we continue checking the one before it.
                    firstPrefixIndex = i;
                } else {
                    // This part is not a prefix, so it must be part of the selector.
                    // We can stop here. Everything before this point is also part of the selector.
                    break;
                }
            }

            // Reconstruct the selector and isolate the line-level prefixes.
            const rawSelector = selectorParts.slice(0, firstPrefixIndex).join(':');
            const linePrefixes = selectorParts.slice(firstPrefixIndex);

            const classes = classesString.split(/\s+/).filter(c => c);

            // Prepend the line-level prefixes to each utility class.
            // e.g., if linePrefixes is ["dark", "hover"], "text-white" becomes "dark:hover:text-white".
            const finalClasses = linePrefixes.length > 0
                ? classes.map(cls => `${linePrefixes.join(':')}:${cls}`)
                : classes;

            if (!rules.has(rawSelector)) {
                rules.set(rawSelector, []);
            }
            rules.get(rawSelector).push(...finalClasses);
        }
    }

    const generatedCss = generateCssFromRules(rules, scopeClass);
    return [generatedCss, ...nativeCssBlocks].join('\n');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function appendStyleTag(id, text = '') {
    const style = document.createElement('style');
    style.id = id;
    if (J.CSSNonce) style.nonce = J.CSSNonce;
    style.textContent = text;
    document.head.appendChild(style);
    return style;
}

let scopeCount = 0;

/**
 * Processes a single <css> tag at compile time.
 * @param {HTMLElement} node - The <css> element itself.
 * @param {HTMLElement} parent - The parent element to which the styles will be scoped.
 */
J.processCssNode = function(node, parent) {
    const rawCss = node.textContent;

    const userProvidedId = node.getAttribute('id');
    const SCOPE_PREFIX = 'j-css-';
    let cssScope;

    if (userProvidedId) {
        cssScope = `${SCOPE_PREFIX}${userProvidedId}`;
    } else {
        scopeCount++;
        cssScope = `${SCOPE_PREFIX}${scopeCount}`;
    }

    // Apply the generated scope class to the parent element
    parent.classList.add(cssScope);
    // Compile the custom syntax into standard CSS, scoped with our class
    const compiledCss = compileCss(rawCss, '.' + cssScope);

    let styleElement = document.getElementById(cssScope);
    if (!styleElement) {
        styleElement = appendStyleTag(cssScope)
    }
    styleElement.textContent = compiledCss;

    if (J.CleanDOM) {
        // Make node to avoid linker index error
        node.replaceWith(document.createComment(''));
    } else {
        node.hidden = true;
    }
}

// Create a style tag to temporarily disable all transitions during initial rendering.
// This prevents a "flicker" or "dance" of elements that have both `transition`
// and `transform` utilities applied on first load. The browser would otherwise try
// to transition from a default transform (e.g., translate(0,0)) to the utility's
// value (e.g., translate(1rem, 0)), causing an unwanted animation.
const noTransitionStyle = appendStyleTag(
    'j-css-no-transitions',
    '*, *::before, *::after { transition: none !important; }'
);

// Auto dark-theme toggling
if (J.AutoDarkMode !== false) {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () =>
        document.documentElement.classList.toggle('dark', query.matches);
    sync();
    query.addEventListener('change', sync);
}

// Minified preflight.css + animations
appendStyleTag('j-css-preflight', `
    :root{--font-sans:ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';--font-serif:ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace}*,::after,::backdrop,::before,::file-selector-button{box-sizing:border-box;margin:0;padding:0;border:0 solid #e5e7eb}:host,html{line-height:1.5;-webkit-text-size-adjust:none;tab-size:4;font-family:var( --font-sans, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' );font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var( --font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace );font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}::file-selector-button,button,input,optgroup,select,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;border-radius:0;background-color:transparent;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type='button'],[type='reset'],[type='submit']),::file-selector-button{appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden='until-found'])){display:none !important}
    .container{width:100%}
    @media(min-width:40rem){.container{max-width:40rem}}
    @media(min-width:48rem){.container{max-width:48rem}}
    @media(min-width:64rem){.container{max-width:64rem}}
    @media(min-width:80rem){.container{max-width:80rem}}
    @media(min-width:96rem){.container{max-width:96rem}}

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes pulse {
        50% { opacity: .5; }
    }
    @keyframes bounce {
        0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
    }
    @keyframes ping {
        75%, 100% {
        transform: scale(2);
        opacity: 0;
        }
    }
    /* A custom animation, as an example */
    @keyframes fade {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    /* j-transition="fade" */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    /* j-transition="slide-up" */
    .slide-up-enter-active,
    .slide-up-leave-active {
        transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
    }
    .slide-up-enter-from,
    .slide-up-leave-to {
        opacity: 0;
        transform: translateY(20px);
    }

    /* j-transition="zoom" */
    .zoom-enter-active,
    .zoom-leave-active {
        /* cubic-bezier дает легкий эффект пружинки (bounce-back) в конце */
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
    }
    .zoom-enter-from,
    .zoom-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }

    /* j-transition="bounce-in" */
    .bounce-in-enter-active {
        animation: bounce-in-keyframe 0.4s;
    }
    .bounce-in-leave-active {
        animation: bounce-in-keyframe 0.4s reverse;
    }
    @keyframes bounce-in-keyframe {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

`)


// =========================================================================
// Tailwind-like runtime utility classes
// =========================================================================

// Generated CSS remains in the stylesheet after a class is removed
const generatedUtilityClasses = new Set();

const knownUtilityClasses = new Set();

let utilityStyleElement = null;

// PREFIX_HANDLERS is already declared in the intended cascade order
const PREFIX_ORDER = new Map(
    Object.keys(PREFIX_HANDLERS)
        .map((prefix, index) => [prefix, index])
);

function getPrefixRank(prefix) {
    const staticRank = PREFIX_ORDER.get(prefix);

    if (staticRank !== undefined) {
        return staticRank * 3;
    }

    const match = prefix.match(/^(group|peer)-(.+)$/);

    if (match) {
        const [, type, state] = match;
        const stateRank =
            PREFIX_ORDER.get(state) ?? PREFIX_ORDER.size;

        // Keep dynamic variants next to their underlying state:
        // hover, group-hover, peer-hover.
        return stateRank * 3 + (type === 'group' ? 1 : 2);
    }

    // Unknown prefixes are sorted last. They are normally rejected earlier.
    return PREFIX_ORDER.size * 3 + 3;
}

function compareOrderPaths(a, b) {
    const length = Math.min(a.length, b.length);

    for (let i = 0; i < length; i++) {
        if (a[i] !== b[i]) {
            return a[i] - b[i];
        }
    }

    // A parent utility must precede a more specific child utility
    return a.length - b.length;
}

function compareUtilityTokens(a, b) {
    if (a === b) return 0;

    const partsA = splitVariants(a)
    const partsB = splitVariants(b)

    const utilityA = partsA.pop();
    const utilityB = partsB.pop();

    // Variants are compared before utilities so media groups are emitted in breakpoint order rather than lexicographic order
    let difference = compareOrderPaths(
        partsA.map(getPrefixRank),
        partsB.map(getPrefixRank)
    );

    if (difference !== 0) {
        return difference;
    }

    difference = compareOrderPaths(
        resolveUtility(utilityA)?.order ?? [Number.MAX_SAFE_INTEGER],
        resolveUtility(utilityB)?.order ?? [Number.MAX_SAFE_INTEGER]
    );

    if (difference !== 0) {
        return difference;
    }

    // Ensure a deterministic order for values from the same utility branch
    return a < b ? -1 : 1;
}

J.rebuildUtilityStylesheet = function() {
    const rules = new Map();

    const classNames = [...knownUtilityClasses]
        .sort(compareUtilityTokens);

    for (const className of classNames) {
        rules.set(`.${CSS.escape(className)}`, [className]);
    }

    utilityStyleElement ||= appendStyleTag('j-css-utilities')

    utilityStyleElement.textContent =
        generateCssFromRules(rules);
}

/**
 * Checks whether a class can produce at least one CSS rule.
 * Ordinary application classes such as "card" or "modal" are silently ignored.
 */
function isKnownUtilityToken(token) {
    const parts = splitVariants(token)
    const utility = parts.pop();
    for (const prefix of parts) {
        if (!getPrefixHandler(prefix)) {
            return false;
        }
    }
    return resolveUtility(utility) !== null;
}

function generateAndInjectCssForClasses(classNames) {
    if (!J.CSSClassMode) return;
    const start = J.CSSPerformance ? performance.now() : 0;
    const before = knownUtilityClasses.size;
    let hasNewUtilities = false;

    for (const className of classNames) {
        if (!className || generatedUtilityClasses.has(className)) {
            continue;
        }

        // Mark it even when it is not a utility. Otherwise every class mutation
        // would repeatedly try to process ordinary application classes.
        generatedUtilityClasses.add(className);

        // Ignore internal scoped-CSS classes.
        if (className.startsWith('j-css-')) {
            continue;
        }

        // Marker classes do not generate CSS by themselves.
        if (className === 'group' || className === 'peer') {
            continue;
        }

        if (!isKnownUtilityToken(className)) {
            const parts = splitVariants(className);
            const utility = parts.pop().replace(/^!?-?/, '');
            const keys = Object.keys(UTILITY_CONFIG).filter(k => k[0] !== '$');
            const badVariant = parts.find(p => !getPrefixHandler(p));
            const family = keys.find(k => utility === k || utility.startsWith(k + '-'));
            const stem = utility.replace(/-(?:\[.*\]|[^-]+)$/, '');
            const similar = !family && stem.length > 2 &&
                keys.find(k => k.startsWith(stem) || stem.startsWith(k));

            if (badVariant)
                cssWarn(className, `[j-css] Unknown variant "${badVariant}" in "${className}"`);
            else if (family)
                cssWarn(className, `[j-css] Unknown value in "${className}" (utility: "${family}")`);
            else if (similar)
                cssWarn(className, `[j-css] Unknown utility "${className}". Did you mean "${similar}"?`);
            else if (parts.length)
                cssWarn(className, `[j-css] Unknown utility "${className}"`);

            continue;
        }

        knownUtilityClasses.add(className);
        hasNewUtilities = true
    }

    if (hasNewUtilities) J.rebuildUtilityStylesheet();

    if (J.CSSPerformance) console.debug(
        `[j-css] ${classNames.size} classes found, ` +
        `${knownUtilityClasses.size - before} new, ` +
        `${(performance.now() - start).toFixed(2)} ms`
    );
}

function collectElementClasses(element, output) {
    for (const className of element.classList)
        output.add(className);
}

function collectClasses(root, output = new Set()) {
    if (!root) return output;

    if (root.nodeType === Node.ELEMENT_NODE && root.classList) {
        collectElementClasses(root, output);
    }

    if (root.querySelectorAll) {
        for (const element of root.querySelectorAll('[class]')) {
            collectElementClasses(element, output);
        }
    }

    return output;
}

/**
 * Observe:
 *
 * 1. Elements inserted by j-if, j-for and j-html.
 * 2. Class changes made by :class / j-bind:class.
 */
let utilityClassObserver = null;

function startUtilityClassObserver() {
    if (!J.CSSClassMode || utilityClassObserver) {
        return;
    }

    utilityClassObserver = new MutationObserver((mutations) => {
        const discoveredClasses = new Set();

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const addedNode of mutation.addedNodes) {
                    collectClasses(addedNode, discoveredClasses);
                }
            } else if (mutation.type === 'attributes') {
                collectElementClasses(
                    mutation.target,
                    discoveredClasses
                );
            }
        }

        if (discoveredClasses.size) {
            generateAndInjectCssForClasses(discoveredClasses);
        }
    });

    utilityClassObserver.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['class'],
    });
}
// =========================================================================

// Scan static HTML immediately. initCSS() runs before framework linking.
if (J.CSSClassMode) generateAndInjectCssForClasses(collectClasses(document));

// Watch classes added later by j-if, j-for, j-html and :class.
startUtilityClassObserver();

// Remove the transition override after initial framework linking and utility
// generation. MutationObserver callbacks run before the following timer,
// therefore initial dynamic :class values are normally compiled in time.
setTimeout(() => {
    requestAnimationFrame(() => {
        noTransitionStyle.remove();
    });
}, 1);


// =========================================================================
// Standalone-only: automatic processing of <css> tags
// =========================================================================

if (J.CSSTagMode) {
    const processedCssNodes = new WeakSet();

    function processStandaloneCssNode(node) {
        if (
            !node ||
            node.nodeType !== Node.ELEMENT_NODE ||
            node.localName !== 'css' ||
            processedCssNodes.has(node)
        ) {
            return;
        }

        const parent = node.parentElement;
        if (!parent) {
            return;
        }

        processedCssNodes.add(node);
        J.processCssNode(node, parent);
    }

    function scanStandaloneCssTags(root = document) {
        if (!root) return;
        processStandaloneCssNode(root);

        if (root.querySelectorAll) {
            for (const node of root.querySelectorAll('css')) {
                processStandaloneCssNode(node);
            }
        }
    }

    // Initial scan
    scanStandaloneCssTags(document);

    // Continuous processing
    const cssTagObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') continue;

            for (const addedNode of mutation.addedNodes) {
                scanStandaloneCssTags(addedNode);
            }
        }
    });

    cssTagObserver.observe(document.documentElement, {
        subtree: true,
        childList: true,
    });
}


})();
