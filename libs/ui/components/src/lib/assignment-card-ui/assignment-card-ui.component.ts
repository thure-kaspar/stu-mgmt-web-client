import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { AssessmentDtoExtended, Participant } from "@student-mgmt-client/domain-types";
import {
	AssignmentTypeChipComponentModule,
	CardComponentModule,
	ChipComponentModule,
	CollaborationTypeChipComponentModule,
	IconComponentModule,
	PersonListComponentModule
} from "@student-mgmt-client/shared-ui";
import { AssignmentDto, GroupDto } from "@student-mgmt/api-client";

export type AssignmentCardUiComponentProps = {
	assignment: AssignmentDto;
	assessment?: AssessmentDtoExtended;
	requiredPoints?: number;
	courseId: string;
	group?: GroupDto | null;
	displayNoGroupWarning?: boolean;
	participant: Participant;
	passFailSubmittedState?: "passed" | "failed" | "submitted" | null | undefined;
};

@Component({
	selector: "student-mgmt-assignment-card-ui",
	templateUrl: "./assignment-card-ui.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentCardUiComponent {
	@Input() props!: AssignmentCardUiComponentProps;

	@Output() editClicked = new EventEmitter<void>();
	@Output() deleteClicked = new EventEmitter<void>();

	typeEnum = AssignmentDto.TypeEnum;
	stateEnum = AssignmentDto.StateEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;
}

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatDividerModule,
		MatButtonModule,
		MatMenuModule,
		TranslateModule,
		CardComponentModule,
		ChipComponentModule,
		IconComponentModule,
		AssignmentTypeChipComponentModule,
		CollaborationTypeChipComponentModule,
		PersonListComponentModule
	],
	declarations: [AssignmentCardUiComponent],
	exports: [AssignmentCardUiComponent]
})
export class AssignmentCardUiComponentModule {}
