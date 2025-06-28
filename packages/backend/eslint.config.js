import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig({
  files: ["**/*.{js,mjs,cjs,jsx}"],
  plugins: { js },
  extends: ["js/recommended", pluginReact.configs.flat.recommended],
  languageOptions: { 
    globals: { 
      ...globals.node, // ← Questa linea definisce le variabili globali di Node.js
      process: "readonly",
      Buffer: "readonly"
    }
  },
  ignores: ["node_modules"],
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "no-unused-vars": ["warn"]
  }
});
