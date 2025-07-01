/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");
module.exports = {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                tertiary: 'var(--color-tertiary)',
                quaternary: 'var(--color-quaternary)',
                quinary: 'var(--color-quinary)',
                senary: 'var(--color-senary)',
                septenary: 'var(--color-septenary)',
                octonary: 'var(--color-octonary)',
                nonary: 'var(--color-nonary)',
                denary: 'var(--color-denary)',
                blueish: 'var(--color-blueish)',
                reddish: 'var(--color-reddish)',
                greenish: 'var(--color-greenish)',
            },
        },
    },
    darkMode: "class",
    plugins: [nextui()],
};

// module.exports = {
//     content: [
//         "./src/**/*.{js,jsx,ts,tsx}",
//     ],
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// }