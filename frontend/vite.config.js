/** @format */

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/zzzz
export default defineConfig({
    base: "/react-crypto-app/",
    plugins: [react()],
})
