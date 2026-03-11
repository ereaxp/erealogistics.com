import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		noExternal: ['bits-ui']
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('/node_modules/three/')) return 'three';
					if (id.includes('/node_modules/gsap/') || id.includes('/node_modules/lenis/')) return 'gsap';
				}
			}
		}
	}
});
