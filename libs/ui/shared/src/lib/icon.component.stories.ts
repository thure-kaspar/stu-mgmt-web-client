import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { IconComponent, IconComponentModule } from "./icon.component";

export default {
	component: IconComponent,
	title: "Icon",
	decorators: [
		moduleMetadata({
			imports: [IconComponentModule]
		})
	]
} as Meta<IconComponent>;

const Template: Story<IconComponent> = (args: IconComponent) => ({
	component: IconComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = {
	name: "home"
};

export const Small = Template.bind({});
Small.args = {
	name: "person",
	size: "14"
};

export const Big = Template.bind({});
Big.args = {
	name: "person",
	size: "64"
};
