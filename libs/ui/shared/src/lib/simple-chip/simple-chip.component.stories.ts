import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { SimpleChipComponent, SimpleChipComponentModule } from "./simple-chip.component";

export default {
	component: SimpleChipComponent,
	title: "Chips/SimpleChip",
	decorators: [
		moduleMetadata({
			imports: [SimpleChipComponentModule]
		})
	]
} as Meta<SimpleChipComponent>;

const Template: Story<SimpleChipComponent> = (args: SimpleChipComponent) => ({
	component: SimpleChipComponent,
	props: args,
	template:
		"<student-mgmt-simple-chip class='bg-purple-200 text-purple-800'>hello world</student-mgmt-simple-chip>"
});

export const Default = Template.bind({});
