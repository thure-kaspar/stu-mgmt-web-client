import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
	AssessmentDto,
	AssessmentEventDto,
	AssessmentsService,
	AssignmentDto
} from "../../../../../api";
import { ParticipantFacade } from "../../../shared/services/participant.facade";

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
		private assessmentService: AssessmentsService
	) {}

	ngOnInit(): void {}

	/**
	 * Loads the assessment events, if `showEvents` is false.
	 */
	loadAssessmentEvents(): void {
		if (!this.showEvents) {
			this.assessmentService
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
