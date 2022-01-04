import { Meta, moduleMetadata, Story } from "@storybook/angular";
import { PersonListComponent, PersonListComponentModule } from "./person-list.component";
import { PARTICIPANT_STUDENT } from "@student-mgmt-client/testing";
import { StorybookTranslateModule } from "@student-mgmt-client/storybook";

export default {
	component: PersonListComponent,
	title: "PersonListComponent",
	decorators: [
		moduleMetadata({
			imports: [PersonListComponentModule, StorybookTranslateModule]
		})
	]
} as Meta<PersonListComponent>;

const Template: Story<PersonListComponent> = (args: PersonListComponent) => ({
	component: PersonListComponent,
	props: args
});

export const Default = Template.bind({});
Default.args = {
	participants: [PARTICIPANT_STUDENT, PARTICIPANT_STUDENT, PARTICIPANT_STUDENT]
};

export const WithRemoveButton = Template.bind({});
WithRemoveButton.args = {
	participants: [PARTICIPANT_STUDENT, PARTICIPANT_STUDENT, PARTICIPANT_STUDENT],
	displayRemoveButton: true
};
