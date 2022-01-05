module.exports = {
	stories: [],
	addons: ["@storybook/addon-essentials", "storybook-dark-mode", "storybook-tailwind-dark-mode"],
	typescript: {
		check: false,
		reactDocgen: false
	}
	// uncomment the property below if you want to apply some webpack config globally
	// webpackFinal: async (config, { configType }) => {
	//   // Make whatever fine-grained changes you need that should apply to all storybook configs

	//   // Return the altered config
	//   return config;
	// },
};
