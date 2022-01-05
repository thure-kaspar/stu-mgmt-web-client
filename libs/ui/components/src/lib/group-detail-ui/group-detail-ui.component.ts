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
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Participant } from "@student-mgmt-client/domain-types";
import {
	ChipComponentModule,
	IconComponentModule,
	PersonListComponentModule,
	TitleComponentModule
} from "@student-mgmt-client/shared-ui";
import { AssessmentDto, GroupDto, ParticipantDto } from "@student-mgmt/api-client";

@Component({
	selector: "student-mgmt-group-detail-ui",
	templateUrl: "./group-detail-ui.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailUiComponent {
	@Input() group!: GroupDto;
	@Input() participant!: Participant;
	@Input() courseId!: string;
	@Input() assessments?: AssessmentDto[];

	@Output() editGroupClicked = new EventEmitter<void>();
	@Output() removeGroupClicked = new EventEmitter<void>();
	@Output() leaveGroupClicked = new EventEmitter<void>();
	@Output() addParticipantClicked = new EventEmitter<void>();
	@Output() removeParticipantClicked = new EventEmitter<ParticipantDto>();
}

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		MatDividerModule,
		TranslateModule,
		TitleComponentModule,
		PersonListComponentModule,
		ChipComponentModule,
		IconComponentModule
	],
	declarations: [GroupDetailUiComponent],
	exports: [GroupDetailUiComponent]
})
export class GroupDetailUiComponentModule {}
