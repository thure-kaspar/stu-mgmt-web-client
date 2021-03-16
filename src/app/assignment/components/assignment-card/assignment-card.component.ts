import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AssignmentDto, GroupDto, UsersService } from "../../../../../api";
import { getRouteParam } from "../../../../../utils/helper";
import { Course } from "../../../domain/course.model";
import { Participant } from "../../../domain/participant.model";
import {
	ConfirmDialog,
	ConfirmDialogData
} from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { ToastService } from "../../../shared/services/toast.service";
import { ParticipantSelectors } from "../../../state/participant";
import { State } from "../../../state/participant/groups/groups.reducer";
import {
	EditAssignmentDialog,
	EditAssignmentDialogData
} from "../../dialogs/edit-assignment/edit-assignment.dialog";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";

@Component({
	selector: "app-assignment-card",
	templateUrl: "./assignment-card.component.html",
	styleUrls: ["./assignment-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentCardComponent extends UnsubscribeOnDestroy implements OnInit {
	@Input() assignment: AssignmentDto;
	@Input() course: Course;
	@Input() participant: Participant;

	/**
	 * Can be used to display a warning about this assignment, i.e. "You have no group for this assignment."
	 * Will be translated in the template.
	 */
	warning?: string;
	courseId: string;
	group$: Observable<GroupDto>;

	typeEnum = AssignmentDto.TypeEnum;
	stateEnum = AssignmentDto.StateEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private assignmentManagement: AssignmentManagementFacade,
		private userService: UsersService,
		private translate: TranslateService,
		private toast: ToastService,
		private store: Store
	) {
		super();
	}

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.group$ = this.store.select(ParticipantSelectors.selectParticipantGroupsState).pipe(
			tap(state => {
				if (this.studentHasNoGroup(state)) {
					if (
						this.assignment.state === "IN_PROGRESS" &&
						this.studentShouldHaveAGroup(this.assignment, this.participant)
					) {
						this.warning = this.translate.instant("Text.Group.NoGroupForAssignment");
						this.toast.warning("Text.Group.NoGroupForAssignment", this.assignment.name);
					}
				}
			}),
			map(state => state.data?.[this.assignment.id])
		);
	}

	private studentHasNoGroup(state: State): boolean {
		return state.hasLoaded && !state.data?.[this.assignment.id];
	}

	private studentShouldHaveAGroup(assignment: AssignmentDto, participant: Participant): boolean {
		return (
			assignment.collaboration === AssignmentDto.CollaborationEnum.GROUP &&
			participant.isStudent
		);
	}

	openEditDialog(): void {
		const data: EditAssignmentDialogData = {
			courseId: this.courseId,
			assignmentId: this.assignment.id
		};
		this.dialog.open(EditAssignmentDialog, { data });
	}

	onDelete(): void {
		const data: ConfirmDialogData = { params: [this.assignment.name] };
		this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed()
			.subscribe(confirmed => {
				if (confirmed) {
					this.subs.sink = this.assignmentManagement
						.remove(this.assignment, this.courseId)
						.subscribe(() => {
							this.toast.success(this.assignment.name, "Message.Removed");
						});
				}
			});
	}

	/**
	 * Navigates the user to his assessment for this assignment.
	 */
	goToAssessment(): void {
		this.subs.sink = this.userService
			.getAssessmentOfUser(this.participant.userId, this.courseId, this.assignment.id)
			.subscribe({
				next: assessment => {
					this.router.navigate([
						"/courses",
						this.courseId,
						"assignments",
						this.assignment.id,
						"assessments",
						"view",
						assessment.id
					]);
				},
				error: error => {
					this.toast.apiError(error);
				}
			});
	}
}
