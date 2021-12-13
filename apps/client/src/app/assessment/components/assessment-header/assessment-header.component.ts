import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ParticipantFacade } from "@student-mgmt-client/services";
import {
	AssignmentTypeChipComponentModule,
	CardComponentModule,
	ChipComponentModule,
	IconComponentModule
} from "@student-mgmt-client/shared-ui";
import {
	AssessmentApi,
	AssessmentDto,
	AssessmentEventDto,
	AssignmentDto
} from "@student-mgmt/api-client";
import { BehaviorSubject } from "rxjs";
import {
	AssessmentTargetComponent,
	AssessmentTargetComponentModule
} from "../assessment-target/assessment-target.component";

@Component({
	selector: "app-assessment-header",
	templateUrl: "./assessment-header.component.html",
	styleUrls: ["./assessment-header.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentHeaderComponent implements OnInit {
	@Input() assignment: AssignmentDto;
	@Input() assessment: AssessmentDto;
	@Input() courseId: string;
	@Input() isEditMode = false;
	assessmentEvents$ = new BehaviorSubject<AssessmentEventDto[]>(undefined);
	showEvents = false;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(
		public participantFacade: ParticipantFacade,
		private assessmentApi: AssessmentApi
	) {}

	ngOnInit(): void {}

	/**
	 * Loads the assessment events, if `showEvents` is false.
	 */
	loadAssessmentEvents(): void {
		if (!this.showEvents) {
			this.assessmentApi
				.getEventsOfAssessment(this.courseId, this.assignment.id, this.assessment.id)
				.subscribe(
					result => {
						this.showEvents = true;
						this.assessmentEvents$.next(result);
					},
					error => {
						console.log(error);
					}
				);
		}
	}
}

@NgModule({
	declarations: [AssessmentHeaderComponent],
	exports: [AssessmentHeaderComponent],
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		TranslateModule,
		AssessmentTargetComponentModule,
		IconComponentModule,
		CardComponentModule,
		AssignmentTypeChipComponentModule,
		ChipComponentModule,
		AssessmentTargetComponentModule
	]
})
export class AssessmentHeaderComponentModule {}
