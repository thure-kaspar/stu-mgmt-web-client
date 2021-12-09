import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AssessmentEventDto, AssessmentApi, AssignmentDto } from "@student-mgmt/api-client";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import {
	AssignmentWithAssessment,
	mapToExtendedAssessmentDto
} from "@student-mgmt-client/domain-types";
import { CourseFacade } from "@student-mgmt-client/services";
import { ParticipantFacade } from "@student-mgmt-client/services";

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
		private assessmentApi: AssessmentApi,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.assignmentId = getRouteParam("assignmentId", this.route);
		this.assessmentId = getRouteParam("assessmentId", this.route);

		this.vm$ = combineLatest([
			this.assessmentApi.getAssessmentById(
				this.courseId,
				this.assignmentId,
				this.assessmentId
			),
			this.courseFacade.course$
		]).pipe(
			filter(([assessment, course]) => !!assessment && !!course),
			map(([assessment, course]): AssignmentWithAssessment => {
				if (!(course.admissionCriteria?.rules?.length > 0)) {
					return { ...assessment.assignment, assessment };
				}

				const [assessmentExt, requiredPoints] = mapToExtendedAssessmentDto(
					assessment,
					assessment.assignment,
					course.admissionCriteria
				);

				return { ...assessment.assignment, requiredPoints, assessment: assessmentExt };
			})
		);
	}
}
