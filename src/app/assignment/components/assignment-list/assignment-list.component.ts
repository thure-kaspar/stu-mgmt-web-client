import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AssignmentDto } from "../../../../../api";
import { CourseFacade } from "../../../course/services/course.facade";
import { ParticipantFacade } from "../../../course/services/participant.facade";
import { CreateAssignmentDialog } from "../../dialogs/create-assignment/create-assignment.dialog";
import { AssignmentManagementFacade } from "../../services/assignment-management.facade";
import { Participant } from "../../../domain/participant.model";

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
	//changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentListComponent implements OnInit {

	courseId: string;
	assignments = new AssignmentsStateMap();
	participant: Participant;

	constructor(public course: CourseFacade,
				private participantFacade: ParticipantFacade,
				private assignmentManagement: AssignmentManagementFacade,
				private route: ActivatedRoute,
				public dialog: MatDialog) { }

	ngOnInit(): void {
		this.courseId = this.route.parent.parent.snapshot.paramMap.get("courseId");
		this.assignmentManagement.loadAssignmentsOfCourse(this.courseId);
		this.participantFacade.p$.subscribe(p => this.participant = p);
		this.assignmentManagement.assignments$.subscribe(
			assignments => {
				this.assignments.inProgress = assignments.filter(a => a.state === "IN_PROGRESS");
				this.assignments.inReview = assignments.filter(a => a.state === "IN_REVIEW");
				this.assignments.evaluated = assignments.filter(a => a.state === "EVALUATED");
				this.assignments.closed = assignments.filter(a => a.state === "CLOSED");
				this.assignments.invisible = assignments.filter(a => a.state === "INVISIBLE");
			}
		);
	}

	openAddDialog(): void {
		this.dialog.open(CreateAssignmentDialog, { data: this.courseId });
	}

}
