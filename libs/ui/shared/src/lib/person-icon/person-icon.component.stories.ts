import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { PersonIconComponent, PersonIconComponentModule } from "./person-icon.component";

export default {
	title: "PersonIcon",
	component: PersonIconComponent,
	decorators: [
		moduleMetadata({
			imports: [PersonIconComponentModule]
		})
	]
} as Meta<PersonIconComponent>;

const Template: Story<PersonIconComponent> = (args: PersonIconComponent) => ({
	component: PersonIconComponent,
	props: args
});

export const FirstAndLastname = Template.bind({});
FirstAndLastname.args = {
	name: "Max Mustermann"
};

export const OneWord = Template.bind({});
OneWord.args = {
	name: "User"
};
