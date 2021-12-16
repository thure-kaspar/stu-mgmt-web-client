import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { ChipComponent, ChipComponentModule } from "./chip.component";

export default {
	component: ChipComponent,
	title: "ChipComponent",
	decorators: [
		moduleMetadata({
			imports: [ChipComponentModule]
		})
	]
} as Meta<ChipComponent>;

const Template: Story<ChipComponent> = (args: ChipComponent) => ({
	component: ChipComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = {
	text: "Hello world",
	icon: "home",
	color: "#7732a8"
};

export const TextOnly = Template.bind({});
TextOnly.args = {
	text: "Gruppenabgabe",
	color: "#7732a8"
};

export const IconOnly = Template.bind({});
IconOnly.args = {
	icon: "home",
	color: "#7732a8"
};
