import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import {
	AssignmentWithAssessment,
	mapToExtendedAssessmentDto
} from "@student-mgmt-client/domain-types";
import { CourseFacade, ParticipantFacade } from "@student-mgmt-client/services";
import { CardComponentModule, SimpleChipComponentModule } from "@student-mgmt-client/shared-ui";
import { getRouteParam } from "@student-mgmt-client/util-helper";
import { AssessmentApi, AssessmentEventDto, AssignmentDto } from "@student-mgmt/api-client";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AssessmentHeaderComponentModule } from "../assessment/components/assessment-header/assessment-header.component";
import { PartialAssessmentComponentModule } from "./partial-assessment/partial-assessment.component";

@Component({
    selector: "student-mgmt-assessment-viewer",
    templateUrl: "./assessment-viewer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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

@NgModule({
	declarations: [AssessmentViewerComponent],
	exports: [AssessmentViewerComponent],
	imports: [
		CommonModule,
		TranslateModule,
		AssessmentHeaderComponentModule,
		SimpleChipComponentModule,
		CardComponentModule,
		PartialAssessmentComponentModule
	]
})
export class AssessmentViewerComponentModule {}
