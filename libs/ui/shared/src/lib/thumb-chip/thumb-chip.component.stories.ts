import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { ThumbChipComponent, ThumbChipComponentModule } from "./thumb-chip.component";

export default {
	component: ThumbChipComponent,
	title: "Chips/ThumbChip",
	decorators: [
		moduleMetadata({
			imports: [ThumbChipComponentModule]
		})
	]
} as Meta<ThumbChipComponent>;

const Template: Story<ThumbChipComponent> = (args: ThumbChipComponent) => ({
	component: ThumbChipComponent,
	props: args
});

export const ThumbsUp = Template.bind({});
ThumbsUp.args = { condition: true };

export const ThumbsDown = Template.bind({});
ThumbsDown.args = { condition: false };
