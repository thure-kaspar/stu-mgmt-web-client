import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { JoinGroupDialog } from "../../../group/dialogs/join-group/join-group.dialog";
import { CourseMembershipsFacade } from "../../services/course-memberships.facade";
import { CoursesService, CanJoinCourseDto, CourseParticipantsService } from "../../../../../api";
import { AuthService } from "../../../auth/services/auth.service";

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

	canJoinDto: CanJoinCourseDto;

	constructor(private dialogRef: MatDialogRef<JoinGroupDialog, boolean>,
				@Inject(MAT_DIALOG_DATA) public courseId: string,
				private courseParticipantsService: CourseParticipantsService,
				private auth: AuthService,
				private courseMemberships: CourseMembershipsFacade) { }

	ngOnInit(): void {
		const userId = this.auth.getAuthToken().user.id;
		this.courseParticipantsService.canUserJoinCourse(this.courseId, userId).subscribe(
			result => {
				this.canJoinDto = result;
				this.error = this.canJoinDto.reason;
			}
		);
	}

	onCancel(): void {
		return this.dialogRef.close(false);
	}

	onJoin(): void {
		this.courseMemberships.joinCourse(this.courseId, this.password).subscribe(
			success => this.dialogRef.close(true),
			error => {
				if (error.error?.message) {
					this.error = error.error?.message; // TODO: Check if known error and translate
				}
			}
		);
	}

}
