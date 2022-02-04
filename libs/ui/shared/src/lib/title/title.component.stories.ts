import { MatButtonModule } from "@angular/material/button";
import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { TitleComponent, TitleComponentModule } from "./title.component";

export default {
	component: TitleComponent,
	title: "Title",
	decorators: [
		moduleMetadata({
			imports: [TitleComponentModule, MatButtonModule]
		})
	]
} as Meta<TitleComponent>;

const Template: Story<TitleComponent> = (args: TitleComponent) => ({
	component: TitleComponent,
	props: args,
	template:
		"<student-mgmt-title><button mat-flat-button color='accent'>Click me</button></student-mgmt-title>"
});

export const Default = Template.bind({});
Default.args = {
	title: "Lorem Ipsum"
};
