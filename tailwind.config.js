/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ["./apps/client/src/app/**/*.html", "./libs/**/*.html"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"card-bg": "var(--card-bg)",
				"color-bg": "var(--color-bg)"
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
