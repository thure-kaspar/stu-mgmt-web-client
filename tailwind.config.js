/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	//	mode: "jit",
	purge: {
		content: ["./apps/client/src/app/**/*.html", "./libs/**/*.html"]
	},
	darkMode: "class",
	theme: {
		extend: {}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
