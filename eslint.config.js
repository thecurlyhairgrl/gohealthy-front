import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Código generado por la CLI de shadcn: no se edita a mano, así que se
    // relajan reglas que chocan con sus propios patrones (import * as React
    // sin usarlo con el nuevo JSX transform, setState síncrono en el efecto
    // de useIsMobile, export de componente + variantes en el mismo archivo).
    files: ['src/components/ui/**/*.{js,jsx}', 'src/hooks/use-mobile.js'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],
    },
  },
])
