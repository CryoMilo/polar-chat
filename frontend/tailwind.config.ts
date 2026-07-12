/** @type {import('tailwindcss').Config} */
export default {
	// Content paths - essential for purging unused styles
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./src/**/*.html",
		// Add any other paths where you use Tailwind classes
	],

	// Dark mode strategy
	darkMode: "class", // or 'media' for system preference

	// Theme configuration
	theme: {
		// Extend the default theme instead of overriding
		extend: {
			// Colors - use semantic naming
			colors: {
				// Primary color palette
				primary: {
					50: "#eff6ff",
					100: "#dbeafe",
					200: "#bfdbfe",
					300: "#93c5fd",
					400: "#60a5fa",
					500: "#3b82f6",
					600: "#2563eb",
					700: "#1d4ed8",
					800: "#1e40af",
					900: "#1e3a8a",
					950: "#172554",
				},

				// Secondary/Accent color
				secondary: {
					50: "#f0fdf4",
					100: "#dcfce7",
					200: "#bbf7d0",
					300: "#86efac",
					400: "#4ade80",
					500: "#22c55e",
					600: "#16a34a",
					700: "#15803d",
					800: "#166534",
					900: "#14532d",
					950: "#052e16",
				},

				// Neutral/Gray palette
				neutral: {
					50: "#fafafa",
					100: "#f5f5f5",
					200: "#e5e5e5",
					300: "#d4d4d4",
					400: "#a3a3a3",
					500: "#737373",
					600: "#525252",
					700: "#404040",
					800: "#262626",
					900: "#171717",
					950: "#0a0a0a",
				},

				// Semantic colors
				success: "#22c55e",
				warning: "#f59e0b",
				error: "#ef4444",
				info: "#3b82f6",

				// Background & Surface
				background: {
					light: "#ffffff",
					dark: "#171717",
				},

				// Text colors
				text: {
					primary: "#171717",
					secondary: "#525252",
					inverse: "#ffffff",
				},
			},

			// Font families
			fontFamily: {
				sans: [
					"Inter",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"Helvetica Neue",
					"Arial",
					"sans-serif",
				],
				serif: ["Merriweather", "Georgia", "serif"],
				mono: [
					"JetBrains Mono",
					"Menlo",
					"Monaco",
					"Consolas",
					"Liberation Mono",
					"monospace",
				],
			},

			// Typography scale
			fontSize: {
				xs: ["0.75rem", { lineHeight: "1rem" }],
				sm: ["0.875rem", { lineHeight: "1.25rem" }],
				base: ["1rem", { lineHeight: "1.5rem" }],
				lg: ["1.125rem", { lineHeight: "1.75rem" }],
				xl: ["1.25rem", { lineHeight: "1.75rem" }],
				"2xl": ["1.5rem", { lineHeight: "2rem" }],
				"3xl": ["1.875rem", { lineHeight: "2.25rem" }],
				"4xl": ["2.25rem", { lineHeight: "2.5rem" }],
				"5xl": ["3rem", { lineHeight: "1" }],
				"6xl": ["3.75rem", { lineHeight: "1" }],
				"7xl": ["4.5rem", { lineHeight: "1" }],
				"8xl": ["6rem", { lineHeight: "1" }],
				"9xl": ["8rem", { lineHeight: "1" }],
			},

			// Spacing scale (extends default)
			spacing: {
				18: "4.5rem",
				88: "22rem",
				120: "30rem",
				128: "32rem",
				144: "36rem",
			},

			// Border radius
			borderRadius: {
				"4xl": "2rem",
				"5xl": "2.5rem",
			},

			// Box shadows
			boxShadow: {
				// Custom soft shadows
				soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
				card: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
				"card-hover":
					"0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
				// Extend default shadows
				"2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
			},

			// Animation
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-in": "slideIn 0.3s ease-out",
				"spin-slow": "spin 3s linear infinite",
				"pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"bounce-slow": "bounce 2s infinite",
			},

			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideIn: {
					"0%": { transform: "translateY(-10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},

			// Container configuration
			container: {
				center: true,
				padding: {
					DEFAULT: "1rem",
					sm: "2rem",
					lg: "4rem",
					xl: "5rem",
					"2xl": "6rem",
				},
			},

			// Screens/Breakpoints
			screens: {
				xs: "475px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1536px",
				"3xl": "1920px",
			},

			// Z-index scale
			zIndex: {
				1: "1",
				2: "2",
				3: "3",
				4: "4",
				5: "5",
				10: "10",
				20: "20",
				30: "30",
				40: "40",
				50: "50",
				75: "75",
				100: "100",
				auto: "auto",
				// Common UI layers
				dropdown: "1000",
				sticky: "1020",
				fixed: "1030",
				modal: "1040",
				popover: "1050",
				tooltip: "1060",
			},
		},
	},

	// Optimizations
	future: {
		hoverOnlyWhenSupported: true,
	},

	// Safelist (classes that should never be purged)
	safelist: [
		// Dynamic classes
		"bg-red-500",
		"bg-blue-500",
		"bg-green-500",
		"text-red-500",
		"text-blue-500",
		"text-green-500",
		// Modal classes
		"modal-open",
		"modal-closed",
		// Toast notifications
		"toast-success",
		"toast-error",
		"toast-warning",
		// Animation classes
		"animate-fade-in",
		"animate-slide-in",
	],

	// Disable unused features for smaller bundles
	corePlugins: {
		// Disable if you don't use them
		// preflight: false, // Only if you want to disable base styles
		// ringWidth: false, // If you don't use ring utilities
		// ringColor: false,
		// ringOffsetWidth: false,
		// ringOffsetColor: false,
		// scrollSnapType: false,
		// scrollSnapAlign: false,
		// scrollMargin: false,
		// scrollPadding: false,
	},
};
