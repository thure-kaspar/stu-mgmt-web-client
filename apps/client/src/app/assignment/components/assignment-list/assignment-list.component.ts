import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { CourseFacade } from "@student-mgmt-client/services";
import { IconComponentModule, TitleComponentModule } from "@student-mgmt-client/shared-ui";
import {
	AssignmentActions,
	AssignmentSelectors,
	ParticipantSelectors
} from "@student-mgmt-client/state";
import { UnsubscribeOnDestroy } from "@student-mgmt-client/util-helper";
import { AssignmentDto } from "@student-mgmt/api-client";
import { map } from "rxjs/operators";
import { AssignmentCreateComponent } from "../../../assignment-create/assignment-create.component";
import { AssignmentsByStateComponentModule } from "../assignments-by-state/assignments-by-state.component";
import { ParticipantAdmissionStatusContainerComponentModule } from "../participant-admission-status-container/participant-admission-status-container.component";

class AssignmentsStateMap {
	inProgress: AssignmentDto[] = [];
	inReview: AssignmentDto[] = [];
	evaluated: AssignmentDto[] = [];
	closed: AssignmentDto[] = [];
	invisible: AssignmentDto[] = [];
}

@Component({
	selector: "student-mgmt-assignment-list",
	templateUrl: "./assignment-list.component.html",
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
		this.dialog.open(AssignmentCreateComponent, { data: this.courseId });
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

@NgModule({
	declarations: [AssignmentListComponent],
	exports: [AssignmentListComponent],
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		MatDividerModule,
		TranslateModule,
		TitleComponentModule,
		IconComponentModule,
		ParticipantAdmissionStatusContainerComponentModule,
		AssignmentsByStateComponentModule
	]
})
export class AssignmentListComponentModule {}
