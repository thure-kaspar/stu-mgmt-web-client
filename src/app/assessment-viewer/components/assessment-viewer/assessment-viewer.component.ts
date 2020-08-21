import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentDto, AssignmentDto, AssessmentEventDto, AssessmentsService } from "../../../../../api";
import { ParticipantFacade } from "../../../course/services/participant.facade";
import { getRouteParam } from "../../../../../utils/helper";
import { Participant } from "../../../domain/participant.model";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";

@Component({
	selector: "app-assessment-viewer",
	templateUrl: "./assessment-viewer.component.html",
	styleUrls: ["./assessment-viewer.component.scss"],
})
export class AssessmentViewerComponent extends UnsubscribeOnDestroy implements OnInit {

	assessment: AssessmentDto;
	assignment: AssignmentDto;
	events: AssessmentEventDto[];

	showEvents = false;

	participant: Participant;

	courseId: string;
	assignmentId: string;
	assessmentId: string;

	constructor(private assessmentService: AssessmentsService,
				private participantFacade: ParticipantFacade,
				private router: Router,
				private route: ActivatedRoute) { super(); }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);
		this.assessmentId = getRouteParam("assessmentId", this.route);

		this.loadAssessment();
		this.subs.sink = this.participantFacade.participant$.subscribe(p => this.participant = p);
	}

	private loadAssessment(): void {
		this.assessmentService.getAssessmentById(this.courseId, this.assignmentId, this.assessmentId).subscribe(
			assessment => {
				console.log("Assessment:", assessment);
				this.assessment = assessment;
				this.assignment = assessment.assignment;
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
						this.events = result;
						this.showEvents = true;
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
