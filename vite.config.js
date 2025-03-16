import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Remove if not using React

export default defineConfig({
    plugins: [react()], // Remove this line if not using React
    server: {
        port: 5173,
        open: true, // Opens the browser when running `npm run dev`
    },
});
