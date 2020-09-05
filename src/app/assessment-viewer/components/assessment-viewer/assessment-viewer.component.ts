import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { AssessmentDto, AssessmentEventDto, AssessmentsService, AssignmentDto } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { ParticipantFacade } from "../../../shared/services/participant.facade";

@Component({
	selector: "app-assessment-viewer",
	templateUrl: "./assessment-viewer.component.html",
	styleUrls: ["./assessment-viewer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentViewerComponent extends UnsubscribeOnDestroy implements OnInit {

	assessment$ = new Subject<AssessmentDto>();
	assignment: AssignmentDto;

	assessmentEvents$ = new BehaviorSubject<AssessmentEventDto[]>(undefined);
	showEvents = false;

	courseId: string;
	assignmentId: string;
	assessmentId: string;

	constructor(
		public participantFacade: ParticipantFacade,
		private assessmentService: AssessmentsService,
		private router: Router,
		private route: ActivatedRoute
	) { super(); }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);
		this.assessmentId = getRouteParam("assessmentId", this.route);

		this.loadAssessment();
	}

	private loadAssessment(): void {
		this.assessmentService.getAssessmentById(this.courseId, this.assignmentId, this.assessmentId).subscribe(
			assessment => {
				this.assignment = assessment.assignment;
				this.assessment$.next(assessment);
			}
		);
	}

	/**
	 * Loads the assessment events, if `showEvents` is false.
	 */
	loadAssessmentEvents(): void {
		if (!this.showEvents) {
			this.assessmentService.getEventsOfAssessment(this.courseId, this.assessmentId, this.assessmentId)
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

	/**
	 * Navigates the user to the editor for this assessment.
	 */
	navigateToEdit(): void {
		this.router.navigate([
			"/courses", 
			this.courseId, 
			"assignments", 
			this.assignmentId, 
			"assessments", 
			"editor",
			"edit",
			this.assessmentId
		]);
	}
}
