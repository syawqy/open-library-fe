import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Set base for GitHub Pages project site. Update '/openlib/' to your repo name if different.
  base: '/open-library-fe/',
  plugins: [vue()],
})
