import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        ignores: [
            "node_modules/**",
            "generated/**",
            "dist/**",
        ]
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "semi": ["error", "always"],
            "quotes": ["error", "double"],
            "indent": ["error", 4],
            "no-console": "off",
        },
    },
];