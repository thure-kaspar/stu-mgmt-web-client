import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
	AssessmentDto,
	AssessmentEventDto,
	AssessmentApi,
	AssignmentDto
} from "@student-mgmt/api-client";
import { ParticipantFacade } from "@student-mgmt-client/services";

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
