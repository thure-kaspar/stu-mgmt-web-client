import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { AssessmentDto, UsersService } from "../../../../../api";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { getRouteParam } from "../../../../../utils/helper";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-participant-assessments",
	templateUrl: "./participant-assessments.component.html",
	styleUrls: ["./participant-assessments.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantAssessmentsComponent extends UnsubscribeOnDestroy implements OnInit {

	assessmentsDataSource$ = new BehaviorSubject(new MatTableDataSource<AssessmentDto>([]));
	displayedColumns = ["view", "assignment", "achievedPoints", "maxPoints", "percent"];

	userId: string;
	courseId: string;

	constructor(
		private userService: UsersService,
		private route: ActivatedRoute,
	) { super(); }

	ngOnInit(): void {
		this.userId = getRouteParam("userId", this.route);
		this.courseId = getRouteParam("courseId", this.route);

		this.loadAssessmentsOfUser();
	}

	/**
	 * Loads the assessments of this participant and emits them via `assessments$`.
	 */
	private loadAssessmentsOfUser(): void {
		this.subs.sink = this.userService.getAssessmentsOfUserForCourse(this.userId, this.courseId).subscribe(
			assessments => {
				this.assessmentsDataSource$.next(new MatTableDataSource(assessments));
			}
		);
	}

}
