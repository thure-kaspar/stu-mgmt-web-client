import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AssignmentDto, UsersService, GroupDto } from "../../../../../api";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { EditAssignmentDialog, EditAssignmentDialogData } from "../../dialogs/edit-assignment/edit-assignment.dialog";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";
import { getRouteParam } from "../../../../../utils/helper";
import { ParticipantFacade } from "../../../course/services/participant.facade";
import { Participant } from "../../../domain/participant.model";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { Subject } from "rxjs";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
	selector: "app-assignment-card",
	templateUrl: "./assignment-card.component.html",
	styleUrls: ["./assignment-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentCardComponent extends UnsubscribeOnDestroy implements OnInit {

	@Input() assignment: AssignmentDto;
	group$ = new Subject<GroupDto>();

	participant: Participant;

	typeEnum = AssignmentDto.TypeEnum;
	stateEnum = AssignmentDto.StateEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;
	courseId: string;

	constructor(private participantFacade: ParticipantFacade,
				private route: ActivatedRoute,
				private dialog: MatDialog,
				private assignmentManagement: AssignmentManagementFacade,
				private userService: UsersService,
				private toast: ToastService) { super(); }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.subs.sink = this.participantFacade.participant$.subscribe(p => {
			this.participant = p;

			if (this.shouldLoadGroup(this.assignment, this.participant)) {
				this.loadGroupOfAssignment(this.participant);
			}
		});

	}

	private shouldLoadGroup(assignment: AssignmentDto, participant: Participant): boolean {
		return this.assignment.state === AssignmentDto.StateEnum.INPROGRESS 
			&& this.allowsGroups(assignment)
			&& participant.isStudent();
	}

	private allowsGroups(assignment: AssignmentDto): boolean {
		switch(assignment.collaboration) {
		case AssignmentDto.CollaborationEnum.GROUP: return true;
		case AssignmentDto.CollaborationEnum.GROUPORSINGLE: return true;
		default: return false;
		}
	}

	private loadGroupOfAssignment(participant: Participant): void {
		this.subs.sink = this.userService.getGroupOfAssignment(participant.userId, this.courseId, this.assignment.id).subscribe(
			group => {
				console.log(`Group of ${this.assignment.name}:`, group);
				this.group$.next(group);
			},
			error => {
				this.toast.warning("You have no group for this assignment.", this.assignment.name);
			}
		);
	}

	openEditDialog(): void {
		const data: EditAssignmentDialogData = { courseId: this.courseId, assignmentId: this.assignment.id };
		this.dialog.open(EditAssignmentDialog, { data });
	}

	onDelete(): void {
		const data: ConfirmDialogData = { params: [this.assignment.name] };
		this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data }).afterClosed().subscribe(
			confirmed => {
				if (confirmed) {
					this.subs.sink = this.assignmentManagement.remove(this.assignment, this.courseId).subscribe(
						deleted => {
							if (deleted) {
								// TODO: Support undo ?
							}
						},
					);
				}
			}
		);
	}

}
