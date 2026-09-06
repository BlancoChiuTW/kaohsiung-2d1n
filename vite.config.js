import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base 用相對路徑，GitHub Pages 放在 /<repo>/ 子路徑下也能正常載入資源
export default defineConfig({
  base: './',
  plugins: [react()],
})
