import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { AssignmentDto } from "../../../../../api";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { CourseFacade } from "../../../shared/services/course.facade";
import { AssignmentActions, AssignmentSelectors } from "../../../state/assignment";
import { ParticipantSelectors } from "../../../state/participant";
import { CreateAssignmentDialog } from "../../dialogs/create-assignment/create-assignment.dialog";

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
export class AssignmentListComponent extends UnsubscribeOnDestroy implements OnInit {
	courseId: string;
	assignments$ = this.store
		.select(AssignmentSelectors.selectAssignments)
		.pipe(map(assignments => this.createAssignmentsStateMap(assignments)));
	participant$ = this.store.select(ParticipantSelectors.selectParticipant);

	constructor(
		readonly courseFacade: CourseFacade,
		private dialog: MatDialog,
		private route: ActivatedRoute,
		private store: Store
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.route.params.subscribe(({ courseId }) => {
			this.courseId = courseId;
			this.store.dispatch(AssignmentActions.loadAssignments({ courseId }));
		});
	}

	openAddDialog(): void {
		this.dialog.open(CreateAssignmentDialog, { data: this.courseId });
	}

	private createAssignmentsStateMap(assignments: AssignmentDto[]): AssignmentsStateMap {
		const map = new AssignmentsStateMap();
		for (const assignment of assignments) {
			switch (assignment.state) {
				case AssignmentDto.StateEnum.IN_PROGRESS:
					map.inProgress.push(assignment);
					break;
				case AssignmentDto.StateEnum.IN_REVIEW:
					map.inReview.push(assignment);
					break;
				case AssignmentDto.StateEnum.EVALUATED:
					map.evaluated.push(assignment);
					break;
				case AssignmentDto.StateEnum.CLOSED:
					map.closed.push(assignment);
					break;
				case AssignmentDto.StateEnum.INVISIBLE:
					map.invisible.push(assignment);
					break;
				default:
					break;
			}
		}
		return map;
	}
}
