const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? "build" : "watch";

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	purge: {
		content: ["./apps/**/*.{html,scss}", "./libs/**/*.{html,scss}"]
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
