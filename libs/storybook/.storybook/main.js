const rootMain = require("../../../.storybook/main");

module.exports = {
	...rootMain,
	core: { ...rootMain.core, builder: "webpack5" },
	stories: [
		...rootMain.stories,
		"../../../apps/client/src/app/**/*.stories.ts",
		"../../../libs/**/*.stories.ts"
	],
	addons: ["@storybook/addon-essentials", ...rootMain.addons],
	webpackFinal: async (config, { configType }) => {
		// apply any global webpack configs that might have been specified in .storybook/main.js
		if (rootMain.webpackFinal) {
			config = await rootMain.webpackFinal(config, { configType });
		}

		// add your own webpack tweaks if needed

		return config;
	}
};
