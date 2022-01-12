import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { StatCardComponent, StatCardComponentModule } from "./stat-card.component";

export default {
	component: StatCardComponent,
	title: "StatCardComponent",
	decorators: [
		moduleMetadata({
			imports: [StatCardComponentModule]
		})
	]
} as Meta<StatCardComponent>;

const Template: Story<StatCardComponent> = (args: StatCardComponent) => ({
	component: StatCardComponent,
	props: args
});

const defaultArgs: Partial<StatCardComponent> = {
	title: "Answer",
	value: 42
};

export const Default = Template.bind({});
Default.args = defaultArgs;
