import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AssessmentEventDto, AssessmentsService, AssignmentDto } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import {
	AssignmentWithAssessment,
	mapToExtendedAssessmentDto
} from "../../../domain/assignment.model";
import { CourseFacade } from "../../../shared/services/course.facade";
import { ParticipantFacade } from "../../../shared/services/participant.facade";

@Component({
	selector: "app-assessment-viewer",
	templateUrl: "./assessment-viewer.component.html",
	styleUrls: ["./assessment-viewer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentViewerComponent implements OnInit {
	vm$: Observable<AssignmentWithAssessment>;

	assessmentEvents$ = new BehaviorSubject<AssessmentEventDto[]>(undefined);
	showEvents = false;

	courseId: string;
	assignmentId: string;
	assessmentId: string;

	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(
		public participantFacade: ParticipantFacade,
		private courseFacade: CourseFacade,
		private assessmentService: AssessmentsService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);
		this.assessmentId = getRouteParam("assessmentId", this.route);

		this.vm$ = combineLatest([
			this.assessmentService.getAssessmentById(
				this.courseId,
				this.assignmentId,
				this.assessmentId
			),
			this.courseFacade.course$
		]).pipe(
			filter(([assessment, course]) => !!assessment && !!course),
			map(
				([assessment, course]): AssignmentWithAssessment => {
					if (!(course.admissionCriteria.rules?.length > 0)) {
						return { ...assessment.assignment, assessment };
					}

					const [assessmentExt, requiredPoints] = mapToExtendedAssessmentDto(
						assessment,
						assessment.assignment,
						course.admissionCriteria
					);

					return { ...assessment.assignment, requiredPoints, assessment: assessmentExt };
				}
			)
		);
	}

	/**
	 * Loads the assessment events, if `showEvents` is false.
	 */
	loadAssessmentEvents(): void {
		if (!this.showEvents) {
			this.assessmentService
				.getEventsOfAssessment(this.courseId, this.assessmentId, this.assessmentId)
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
