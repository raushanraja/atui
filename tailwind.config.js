/** @type {import('tailwindcss').Config} */
import dimtheme from 'daisyui/src/theming/themes';
export default {
    content: [
        './node_modules/daisyui/**/*.js',
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                raleway: ['Raleway'],
                notosans: ['NotoSans'],
            },
        },
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: [
            {
                dim: {
                    ...dimtheme['dim'],
                    error: '#ffae9c',
                },
            },
        ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: 'dim', // name of one of the included themes for dark mode
        styled: true, // include daisyUI colors and design decisions for all components
        base: true, // applies background color and foreground color for root element by default
        utils: true, // adds responsive and modifier utility classes
        rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
        prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    },
};
