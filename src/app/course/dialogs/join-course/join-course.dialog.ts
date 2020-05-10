import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { JoinGroupDialog } from "../../../group/dialogs/join-group/join-group.dialog";
import { CourseMembershipsFacade } from "../../services/course-memberships.facade";

/**
 * Dialog that allows a user to join a course. 
 * Returns a boolean, indicating, wether the user has joined the course.
 */
@Component({
	selector: "app-join-course",
	templateUrl: "./join-course.dialog.html",
	styleUrls: ["./join-course.dialog.scss"]
})
export class JoinCourseDialog implements OnInit {

	password: string;
	error: string;

	constructor(private dialogRef: MatDialogRef<JoinGroupDialog, boolean>,
				@Inject(MAT_DIALOG_DATA) private courseId: string,
				private courseMemberships: CourseMembershipsFacade) { }

	ngOnInit(): void {
	}

	onCancel(): void {
		return this.dialogRef.close(false);
	}

	onJoin(): void {
		try {
			this.courseMemberships.joinCourse(this.courseId, this.password);
			this.dialogRef.close(true);
		} catch(error) {
			this.error = "Error"; // TODO: Error handling
		}
	}

}
