import { componentWrapperDecorator } from "@storybook/angular";

export const decorators = [
	componentWrapperDecorator(story => `<div class="mat-typography">${story}</div>`)
];
