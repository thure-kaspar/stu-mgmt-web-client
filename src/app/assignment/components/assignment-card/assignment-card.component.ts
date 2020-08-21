import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AssignmentDto } from "../../../../../api";
import { ConfirmDialog, ConfirmDialogData } from "../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { EditAssignmentDialog, EditAssignmentDialogData } from "../../dialogs/edit-assignment/edit-assignment.dialog";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";
import { getRouteParam } from "../../../../../utils/helper";
import { ParticipantFacade } from "../../../course/services/participant.facade";
import { Participant } from "../../../domain/participant.model";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";

@Component({
	selector: "app-assignment-card",
	templateUrl: "./assignment-card.component.html",
	styleUrls: ["./assignment-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentCardComponent extends UnsubscribeOnDestroy implements OnInit {

	@Input() assignment: AssignmentDto;

	participant: Participant;

	typeEnum = AssignmentDto.TypeEnum;
	stateEnum = AssignmentDto.StateEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;
	courseId: string;

	constructor(private participantFacade: ParticipantFacade,
				private route: ActivatedRoute,
				private dialog: MatDialog,
				private assignmentManagement: AssignmentManagementFacade) { super(); }

	ngOnInit(): void {
		this.courseId = getRouteParam("courseId", this.route);
		this.subs.sink = this.participantFacade.participant$.subscribe(p => this.participant = p);
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
					this.assignmentManagement.remove(this.assignment, this.courseId).subscribe(
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
