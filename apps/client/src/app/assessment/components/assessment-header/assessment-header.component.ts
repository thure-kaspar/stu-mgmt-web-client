import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ParticipantFacade } from "@student-mgmt-client/services";
import {
	AssignmentTypeChipComponentModule,
	CardComponentModule,
	CollaborationTypeChipComponentModule,
	IconComponentModule,
	SimpleChipComponentModule
} from "@student-mgmt-client/shared-ui";
import {
	AssessmentApi,
	AssessmentDto,
	AssessmentEventDto,
	AssignmentDto
} from "@student-mgmt/api-client";
import { BehaviorSubject } from "rxjs";
import { AssessmentTargetComponentModule } from "../assessment-target/assessment-target.component";

@Component({
    selector: "student-mgmt-assessment-header",
    templateUrl: "./assessment-header.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AssessmentHeaderComponent {
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
		CollaborationTypeChipComponentModule,
		SimpleChipComponentModule,
		AssessmentTargetComponentModule
	]
})
export class AssessmentHeaderComponentModule {}
