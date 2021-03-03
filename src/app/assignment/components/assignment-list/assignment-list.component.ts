import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { AssignmentDto } from "../../../../../api";
import { Participant } from "../../../domain/participant.model";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { CreateAssignmentDialog } from "../../dialogs/create-assignment/create-assignment.dialog";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";
import { CourseFacade } from "../../../shared/services/course.facade";
import { ParticipantFacade } from "../../../shared/services/participant.facade";

class AssignmentsStateMap {
	inProgress: AssignmentDto[] = [];
	inReview: AssignmentDto[] = [];
	evaluated: AssignmentDto[] = [];
	closed: AssignmentDto[] = [];
	invisible: AssignmentDto[] = [];
}

@Component({
	selector: "app-assignment-list",
	templateUrl: "./assignment-list.component.html",
	styleUrls: ["./assignment-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentListComponent extends UnsubscribeOnDestroy implements OnInit, OnDestroy {
	courseId: string;

	assignments$: Observable<AssignmentsStateMap>;
	participant$: Observable<Participant>;

	constructor(
		public courseFacade: CourseFacade,
		private participantFacade: ParticipantFacade,
		private assignmentManagement: AssignmentManagementFacade,
		private route: ActivatedRoute,
		public dialog: MatDialog
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = this.route.parent.parent.snapshot.paramMap.get("courseId");
		this.assignmentManagement.loadAssignmentsOfCourse(this.courseId);
		this.subscribeToAssignments();

		this.participant$ = this.participantFacade.participant$.pipe(
			filter(p => !!p), // Only perform the following check once participant is loaded
			tap(participant => {
				if (participant.isStudent) {
					this.participantFacade.loadAssignmentGroups();
				}
			})
		);

		this.subs.sink = this.participant$.subscribe();
	}

	private subscribeToAssignments(): void {
		this.assignments$ = this.assignmentManagement.assignments$.pipe(
			map(assignments => {
				const map = new AssignmentsStateMap();
				map.inProgress = assignments.filter(a => a.state === "IN_PROGRESS");
				map.inReview = assignments.filter(a => a.state === "IN_REVIEW");
				map.evaluated = assignments.filter(a => a.state === "EVALUATED");
				map.closed = assignments.filter(a => a.state === "CLOSED");
				map.invisible = assignments.filter(a => a.state === "INVISIBLE");
				return map;
			})
		);
	}

	openAddDialog(): void {
		this.dialog.open(CreateAssignmentDialog, { data: this.courseId });
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.participantFacade.clearAssignmentGroups();
	}
}
